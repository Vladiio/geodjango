import random

from django.core.management.base import BaseCommand, CommandError
from django.contrib.gis.geos import Point
from django.conf import settings

from world.models import Item


class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        for item_name in ('Bakery', 'Butcher\'s', 'Chemist\'s'):
            difference = random.choice((0.02, 0.05, 0.0001, 0.000004))

            lat = settings.DEFAULT_LOCATION['lat'] - difference
            lng = settings.DEFAULT_LOCATION['lng'] - difference
            point = Point(lat, lng)

            Item.objects.create(name=item_name, location=point)
        self.stdout.write(self.style.SUCCESS('Successefuly created 3 items'))