from django.contrib.gis.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    location = models.PointField()


class Item(models.Model):
    name = models.CharField(max_length=50)
    location = models.PointField()

    def __str__(self):
        return self.name
