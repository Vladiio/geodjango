from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from django.contrib.gis.db.models.functions import Distance
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate


import graphene
from graphene_django.types import DjangoObjectType

from world.models import Item


User = get_user_model()


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
                location__distance_lte=(user_location, D(m=1000000))
                ).annotate(distance=Distance('location', user_location)
                ).order_by('distance')


class Query(graphene.ObjectType):

    user = graphene.Field(
        GraphUser,
        username=graphene.Argument(graphene.String, required=True),
        password=graphene.Argument(graphene.String, required=True)
    )

    def resolve_user(self, context, request, info):
        username = context.get("username", "")
        password = context.get("password", "")

        user = None
        if not request.user.is_authenticated:
            user = authenticate(request,
                                username=username,
                                password=password)
        else:
            user = request.user

        return user


schema = graphene.Schema(query=Query)
