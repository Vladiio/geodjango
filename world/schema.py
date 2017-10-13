from graphene import ObjectType, Node, Schema, AbstractType
from graphene_django.fields import DjangoConnectionField
from graphene_django.types import DjangoObjectType
import graphene

from world.models import Item


class ItemNode(DjangoObjectType):

    location = graphene.String()

    def resolve_location(self, *args, **kwargs):
        return "x: {} y: {}".format(
            self.location.x,
            self.location.y
        )

    class Meta:
        model = Item
        interfaces = (Node, )


class SearchItems(graphene.Mutation):

    all_items = graphene.List(ItemNode)

    def mutate(root, args, request, info):
        all_items = Item.objects.all()[:]
        return SearchItems(all_items=all_items)


class MyMutations(graphene.ObjectType):

    search_items = SearchItems.Field()




class Query(ObjectType):
    #item = Node.Field(ItemNode)
    all_items = DjangoConnectionField(ItemNode)

    def resolve_item(self):
        return None


schema = Schema(query=Query, mutation=MyMutations)
