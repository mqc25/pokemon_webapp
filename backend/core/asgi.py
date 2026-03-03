import os
import django
from django.core.asgi import get_asgi_application

# Set environment before importing anything else
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from channels.routing import ProtocolTypeRouter, URLRouter
from pokemon.routing import websocket_urlpatterns

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter(
        websocket_urlpatterns
    ),
})