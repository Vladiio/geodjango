from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from django.contrib.gis.db.models.functions import Distance
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from django.conf import settings


import graphene
from graphene_django.types import DjangoObjectType

from world.models import Item


User = get_user_model()


def get_user(context):
    token = context.session.get('token')
    if not token:
        return
    try:
        user = User.objects.get(token=token)
        return user
    except:
        raise Exception('User not found')


class GraphItem(DjangoObjectType):

    location = graphene.List(graphene.Float)
    distance = graphene.Int()

    class Meta:
        model = Item

    def resolve_distance(self, context, request, info):
        return int(self.distance.m)


class GraphUser(DjangoObjectType):

    location = graphene.List(graphene.Float)
    items = graphene.List(GraphItem)

    class Meta:
        model = User

    def resolve_items(self, context, request, info):
        distance = 5000
        user_location = Point(self.location.x, self.location.y)
        return Item.objects.filter(
                location__distance_lte=(user_location, D(m=distance))
                ).annotate(distance=Distance('location', user_location)
                ).order_by('distance')


class CreateUser(graphene.Mutation):
    user = graphene.Field(GraphUser)

    class Input:
        username = graphene.String(required=True)
        password = graphene.String(required=True)

    @staticmethod
    def mutate(root, input, context, info):
        username = input.get('username')
        password = input.get('password')

        user = User(username=username)
        user.location = Point(x=settings.DEFAULT_LOCATION.get('lat'),
                              y=settings.DEFAULT_LOCATION.get('lng'))
        user.set_password(password)
        user.save()
        return CreateUser(user=user)


class LogIn(graphene.Mutation):
    user = graphene.Field(GraphUser)

    class Input:
        username = graphene.String()
        password = graphene.String()

    @staticmethod
    def mutate(root, input, context, info):
        user = authenticate(
            username=input.get('username'),
            password=input.get('password')
        )

        if not user:
            raise Exception('Invalid username or password')
        context.session['token'] = user.token
        return LogIn(user=user)


class LogOut(graphene.Mutation):
    status = graphene.String()

    @staticmethod
    def mutate(root, input, context, info):
        token = context.session.get('token')
        if not token:
            raise Exception('You are not logged in')
        del context.session['token']
        return LogOut(status="Logged Out")


class UserMutation(graphene.AbstractType):
    create_user = CreateUser.Field()
    login = LogIn.Field()
    logout = LogOut.Field()


class UserQuery(graphene.AbstractType):

    user = graphene.Field(GraphUser)

    def resolve_user(self, args, context, info):
        user = get_user(context)
        if not user:
            raise Exception('Not logged')

        return user


class Query(UserQuery, graphene.ObjectType):
    pass


class Mutation(UserMutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
