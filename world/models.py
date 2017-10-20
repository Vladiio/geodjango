import binascii
import os

from django.db import models
from django.contrib.gis.db import models as geo_models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    location = geo_models.PointField()
    token = models.CharField(max_length=40)

    def save(self, *args, **kwargs):
        if not self.token:
            self.token = binascii.hexlify(os.urandom(20)).decode()
        super().save(*args, **kwargs)


class Item(models.Model):
    name = models.CharField(max_length=50)
    location = geo_models.PointField()

    def __str__(self):
        return self.name
