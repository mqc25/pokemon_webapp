import json
import random
import requests
from django.core.management.base import BaseCommand
from django.contrib.gis.geos import Point
from pokemon.models import Pokemon

class Command(BaseCommand):
    help = 'Fetches 100 Pokemon and assigns coordinates from Polyline files'

    def handle(self, *args, **options):
        if Pokemon.objects.exists():
            self.stdout.write(self.style.SUCCESS('Database already has Pokemon. Skipping fetch.'))
            return

        # parse the Polyline files
        def get_points_from_file(filename):
            with open(filename, 'r') as f:
                data = json.load(f)
                points = []
                # flatten the list of coordinates
                for segment in data['coordinates']:
                    for coord in segment:
                        points.append(coord)
                return points

        points_aj = get_points_from_file('A - J')
        points_kz = get_points_from_file('K -Z')

        self.stdout.write("Fetching Pokemon data via GraphQL (1 Request)...")

        # GraphQL query to fetch Pokemon data with types, moves, encounters, and sprites
        graphql_query = """
        query GetPokemonData {
          pokemon_v2_pokemon(limit: 100, order_by: {id: asc}) {
            name
            pokemon_v2_pokemontypes {
              pokemon_v2_type {
                name
              }
            }
            pokemon_v2_pokemonmoves(limit: 4) {
              pokemon_v2_move {
                name
              }
            }
            pokemon_v2_encounters {
              pokemon_v2_locationarea {
                name
              }
            }
            pokemon_v2_pokemonsprites {
              sprites
            }
          }
        }
        """

        try:
            response = requests.post(
                'https://beta.pokeapi.co/graphql/v1beta',
                json={'query': graphql_query},
                timeout=15
            )
            response.raise_for_status()
            
            results = response.json()['data']['pokemon_v2_pokemon']
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Failed to fetch data: {e}"))
            return

        # Clear initial leftover pokemon
        Pokemon.objects.filter(is_custom=False).delete()

        # Parse the GraphQL JSON response
        for p in results:
            name = p['name'].capitalize()
            first_letter = name[0].upper()

            # Format Types
            types = ", ".join([t['pokemon_v2_type']['name'].capitalize() for t in p['pokemon_v2_pokemontypes']])

            # Format Moves
            moves = str([m['pokemon_v2_move']['name'] for m in p['pokemon_v2_pokemonmoves']])

            # Format Encounters
            encounters = p['pokemon_v2_encounters']
            if encounters:
                all_locations = [loc['pokemon_v2_locationarea']['name'].replace('-', ' ').title() for loc in encounters]
                locations_string = ", ".join(all_locations)
                
                if len(locations_string) > 255:
                    encounter_location = locations_string[:252] + "..."
                else:
                    encounter_location = locations_string
            else:
                encounter_location = "Unknown Location"

            # Format Sprite
            try:
                sprites_data = p['pokemon_v2_pokemonsprites'][0]['sprites']
                if isinstance(sprites_data, str):
                    sprites_data = json.loads(sprites_data)
                sprite_url = sprites_data.get('front_default', '')
            except (IndexError, json.JSONDecodeError):
                sprite_url = ''

            # Choose coordinates
            if 'A' <= first_letter <= 'J':
                chosen_coord = random.choice(points_aj)
            else:
                chosen_coord = random.choice(points_kz)

            lng, lat = chosen_coord

            # Save to Database
            Pokemon.objects.create(
                name=name,
                sprite_url=sprite_url,
                types=types,
                latitude=lat,
                longitude=lng,
                coordinates=Point(lng, lat),
                recent_moves=moves,
                encounter_location=encounter_location,
                is_custom=False,
                owner=None
            )

        self.stdout.write(self.style.SUCCESS('Successfully imported wild Pokemon'))