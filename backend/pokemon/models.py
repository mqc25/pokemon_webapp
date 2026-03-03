from django.contrib.gis.db import models
from django.contrib.auth.models import User
from django.conf import settings

class Pokemon(models.Model):
    name = models.CharField(max_length=100)
    sprite_url = models.URLField(max_length=500, blank=True, null=True)
    types = models.CharField(max_length=100)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    
    # PostGIS distance calculations
    coordinates = models.PointField(geography=True, blank=True, null=True) 

    encounter_location = models.CharField(max_length=255, blank=True, null=True)
    
    # TextField coversion to avoid JSON errors
    recent_moves = models.TextField(blank=True, null=True) 

    is_custom = models.BooleanField(default=False)
    favorited_by = models.ManyToManyField(User, related_name='favorite_pokemon', blank=True)

    def __str__(self):
        source = "Custom/CSV" if self.is_custom else "PokeAPI"
        return f"{self.name} ({source})"

class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    pokemon = models.ForeignKey(Pokemon, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'pokemon')