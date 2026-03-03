import json
import asyncio
import random
from channels.generic.websocket import AsyncWebsocketConsumer

class WeatherConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        refresh_time = 10
        await self.accept()
        try:
            while True:
                conditions = ['Sunny', 'Rainy', 'Cloudy', 'Thunderstorm']
                current_weather = random.choice(conditions)
                
                # Sunny (80-100), Rainy (60-80), Cloudy (40-60), Thunderstorm (20-40)
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
        except Exception as e:
            print(f"WebSocket Error: {e}")