from django.contrib import admin
from .models import Pokemon

# This class allows us to customize how the table looks in the admin panel
@admin.register(Pokemon)
class PokemonAdmin(admin.ModelAdmin):
    # These columns will show up in the main list view
    list_display = ('name', 'types', 'is_custom', 'encounter_location')
    
    # Adds a search bar so you can easily find specific Pokemon later
    search_fields = ('name', 'types')
    
    # Adds filters on the right sidebar
    list_filter = ('is_custom', 'types')