import json

from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from django.contrib.gis.db.models.functions import Distance
from django.contrib.auth import get_user_model

import graphene
from graphql.language import ast
from graphene_django.types import DjangoObjectType

from world.models import Item


User = get_user_model()


class GraphItem(DjangoObjectType):

    location = graphene.List(graphene.Float)

    class Meta:
        model = Item


class GraphUser(DjangoObjectType):

    location = graphene.List(graphene.Float)

    class Meta:
        model = User


class Query(graphene.ObjectType):

    closest_items = graphene.List(GraphItem,
                                  user_location=graphene.Argument(graphene.List(graphene.Float)))
    user = graphene.List(GraphUser)

    def resolve_user(self, context, request, info):
        return User.objects.all()

    def resolve_closest_items(self, context, request, info):
        distance = 5000
        user_coords = context.get('user_location')
        if user_coords is not None:
            user_location = Point(*user_coords)
            return Item.objects.filter(
                location__distance_lte=(user_location, D(m=1000000))
                ).annotate(distance=Distance('location', user_location)
                ).order_by('distance')


schema = graphene.Schema(query=Query)
