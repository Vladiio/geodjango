import random

from django.core.management.base import BaseCommand, CommandError
from django.contrib.gis.geos import Point
from django.conf import settings

from world.models import Item


class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        default_lat = settings.DEFAULT_LOCATION['lat']
        default_lng = settings.DEFAULT_LOCATION['lng']

        for item_name in ('Bakery', 'Butcher\'s', 'Chemist\'s'):
            difference = random.choice((0.02, 0.05, 0.0002, 0.0004))

            item_lat = default_lat - difference
            item_lng = default_lng + difference
            point = Point(item_lat, item_lng)

            Item.objects.create(name=item_name, location=point)
        self.stdout.write(self.style.SUCCESS('Successefuly created 3 items'))