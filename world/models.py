from django.db import models
from django.contrib.gis.db import models as geo_models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    location = geo_models.PointField(blank=True, null=True)


class Item(models.Model):
    name = models.CharField(max_length=50)
    location = geo_models.PointField()

    def __str__(self):
        return self.name
