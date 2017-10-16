from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from django.contrib.gis.db.models.functions import Distance

import graphene
from graphql.language import ast
from graphene_django.types import DjangoObjectType

from world.models import Item


class LocationPoint(graphene.Scalar):
    # custom field for location data

    @staticmethod
    def serialize(point):
        return [point.x, point.y]

    @staticmethod
    def parse_literal(node):
        if isinstance(node, ast.ListValue):
            values = [float(location.value) for location in node.values]
            return Point(*values)

    @staticmethod
    def parse_value(value):
        return Point(*value)


class GraphItem(DjangoObjectType):

    location = LocationPoint()

    class Meta:
        model = Item


class Query(graphene.ObjectType):
    # TODO create user field
    closest_items = graphene.List(GraphItem, user_location=graphene.Argument(LocationPoint))

    def resolve_closest_items(self, context, request, info):
        distance = 5000
        user_location = context.get('user_location')
        if user_location is not None:
            return Item.objects.filter(
                location__distance_lte=(user_location, D(m=1000000))
                ).annotate(distance=Distance('location', user_location)
                ).order_by('distance')


schema = graphene.Schema(query=Query)
