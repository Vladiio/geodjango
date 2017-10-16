from django.contrib.gis.geos import Point

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
            latitude, longitude = values
            return Point(latitude, longitude)

    @staticmethod
    def parse_value(value):
        return value


class GraphItem(DjangoObjectType):

    location = LocationPoint()

    class Meta:
        model = Item


class Query(graphene.ObjectType):
    closest_items = graphene.List(GraphItem, user_location=graphene.Argument(LocationPoint))

    def resolve_closest_items(self, context, request, info):
        user_location = context.get('user_location')
        if user_location is not None:
            return Item.objects.all()


schema = graphene.Schema(query=Query)
