import json
import asyncio
import random
import requests
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Pokemon # Import the model to get coordinates

class WeatherConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.pokemon_id = self.scope['url_route']['kwargs']['pokemon_id']
        self.is_connected = True
        await self.accept()
        
        # Start the background task to push weather & energy
        self.weather_task = asyncio.create_task(self.send_weather_updates())

    async def disconnect(self, close_code):
        self.is_connected = False
        if hasattr(self, 'weather_task'):
            self.weather_task.cancel()

    async def send_weather_updates(self):
        refresh_time = 10
        try:
            # Get the Pokemon's coordinates from the database
            coords = await self.get_pokemon_coords()
            if not coords:
                await self.send(text_data=json.dumps({'condition': 'Error', 'energy_level': 0}))
                return
            
            lat, lon = coords

            while self.is_connected:
                # Fetch live weather data
                weather_data = await self.fetch_real_weather(lat, lon)
                weathercode = weather_data.get('weathercode', -1)
                energy, condition = self.calculate_energy(weathercode)

                # Send the energy level and condition to the frontend
                await self.send(text_data=json.dumps({
                    'energy_level': energy,
                    'condition': condition
                }))
                
                # Wait before refresh
                await asyncio.sleep(refresh_time)

        except asyncio.CancelledError:
            pass
        except Exception as e:
            print(f"WebSocket Error: {e}")

    @sync_to_async
    def get_pokemon_coords(self):
        try:
            pokemon = Pokemon.objects.get(id=self.pokemon_id)
            return pokemon.latitude, pokemon.longitude
        except Pokemon.DoesNotExist:
            return None

    @sync_to_async
    def fetch_real_weather(self, lat, lon):
        try:
            url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
            response = requests.get(url, timeout=5)
            response.raise_for_status()
            return response.json().get('current_weather', {})
        except requests.RequestException:
            return {}

    def calculate_energy(self, code):
        # Open-Meteo WMO Weather interpretation codes
        if code == 0:
            condition = 'Sunny'
            base_energy = 85
        elif code in [1, 2, 3]:
            condition = 'Cloudy'
            base_energy = 65
        elif code in [45, 48]:
            condition = 'Fog'
            base_energy = 60
        elif code in [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82]:
            condition = 'Rainy'
            base_energy = 45
        elif code in [71, 73, 75, 77, 85, 86]:
            condition = 'Snow'
            base_energy = 35
        elif code in [95, 96, 99]:
            condition = 'Thunderstorm'
            base_energy = 25
        else:
            condition = 'Unknown'
            base_energy = 50

        # Apply +- 20% variance
        variance = random.randint(-20, 20)
        final_energy = max(0, min(100, base_energy + variance))
        
        return final_energy, condition