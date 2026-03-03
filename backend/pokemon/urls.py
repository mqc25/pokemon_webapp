from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PokemonViewSet, LoginView, LogoutView, RegisterView

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'pokemon', PokemonViewSet)

urlpatterns = [
    # Router-generated paths: /api/pokemon/, /api/pokemon/upload_csv/, etc.
    path('', include(router.urls)),
    
    # REQUIREMENT: Real Authentication paths
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('register/', RegisterView.as_view(), name='register'),
]