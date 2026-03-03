import json
import random
import requests
from django.core.management.base import BaseCommand
from django.contrib.gis.geos import Point
from pokemon.models import Pokemon

class Command(BaseCommand):
    help = 'Fetches 100 Pokemon and assigns coordinates from Polyline files'

    def handle(self, *args, **options):
        # 1. Load and parse the Polyline files
        def get_points_from_file(filename):
            with open(filename, 'r') as f:
                data = json.load(f)
                points = []
                # Flatten the MultiLineString segments into a simple list of points
                for segment in data['coordinates']:
                    for coord in segment:
                        points.append(coord) # Each coord is [lng, lat]
                return points

        points_aj = get_points_from_file('A - J')
        points_kz = get_points_from_file('K -Z')

        self.stdout.write("Fetching Pokemon from PokeAPI...")
        response = requests.get("https://pokeapi.co/api/v2/pokemon?limit=100")
        results = response.json()['results']

        # Clear existing PokeAPI pokemon to avoid duplicates during testing
        Pokemon.objects.filter(is_custom=False).delete()

        for entry in results:
            detail_res = requests.get(entry['url']).json()
            name = detail_res['name'].capitalize()
            first_letter = name[0].upper()

            # 2. Determine which polyline group to use
            if 'A' <= first_letter <= 'J':
                chosen_coord = random.choice(points_aj)
            else:
                chosen_coord = random.choice(points_kz)

            lng, lat = chosen_coord

            # 3. Create the Pokemon
            Pokemon.objects.create(
                name=name,
                sprite_url=detail_res['sprites']['front_default'],
                types=", ".join([t['type']['name'].capitalize() for t in detail_res['types']]),
                latitude=lat,
                longitude=lng,
                coordinates=Point(lng, lat),
                recent_moves=str([m['move']['name'] for m in detail_res['moves'][:4]]),
                is_custom=False
            )

        self.stdout.write(self.style.SUCCESS(f'Successfully imported 100 Pokemon using Polylines!'))