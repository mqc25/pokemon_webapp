import json
import asyncio
import random
from channels.generic.websocket import AsyncWebsocketConsumer

class WeatherConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # check if user is still connected in the background task
        self.is_connected = True
        await self.accept()
        self.weather_task = asyncio.create_task(self.send_weather_updates())

    async def disconnect(self, close_code):
        # when user leaves, cancel background task
        self.is_connected = False
        if hasattr(self, 'weather_task'):
            self.weather_task.cancel()

    async def send_weather_updates(self):
        refresh_time = 10
        try:
            while self.is_connected:
                conditions = ['Sunny', 'Rainy', 'Cloudy', 'Thunderstorm']
                current_weather = random.choice(conditions)
                
                match current_weather:
                    case 'Sunny':
                        energy = random.randint(80, 100)
                    case 'Rainy':
                        energy = random.randint(60, 80)
                    case 'Cloudy':
                        energy = random.randint(40, 60)
                    case 'Thunderstorm':
                        energy = random.randint(20, 40)
                
                await self.send(text_data=json.dumps({
                    'energy_level': energy,
                    'condition': current_weather
                }))
                
                await asyncio.sleep(refresh_time)
                
        except asyncio.CancelledError:
            pass
        except Exception as e:
            print(f"WebSocket Error: {e}")