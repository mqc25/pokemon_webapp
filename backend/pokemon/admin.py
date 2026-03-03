from django.contrib import admin
from .models import Pokemon

@admin.register(Pokemon)
class PokemonAdmin(admin.ModelAdmin):
    list_display = ('name', 'types', 'is_custom', 'encounter_location')
    search_fields = ('name', 'types')
    list_filter = ('is_custom', 'types')