import json
import asyncio
import random
from channels.generic.websocket import AsyncWebsocketConsumer

class WeatherConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        # Start a loop to send weather/energy updates
        try:
            while True:
                # Simulate weather correlation requirement
                conditions = ['Sunny', 'Rainy', 'Cloudy', 'Thunderstorm']
                current_weather = random.choice(conditions)
                
                # Logic: Energy is higher when Sunny, lower when Stormy
                energy = random.randint(80, 100) if current_weather == 'Sunny' else random.randint(30, 60)
                
                await self.send(text_data=json.dumps({
                    'energy_level': energy,
                    'condition': current_weather
                }))
                await asyncio.sleep(10) # Update every 10 seconds
        except Exception as e:
            print(f"WebSocket Error: {e}")