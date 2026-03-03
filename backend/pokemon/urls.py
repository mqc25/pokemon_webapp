from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PokemonViewSet, LoginView, LogoutView, RegisterView

router = DefaultRouter()
router.register(r'pokemon', PokemonViewSet)

urlpatterns = [
    # Api path
    path('', include(router.urls)),
    
    # Auth path
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('register/', RegisterView.as_view(), name='register'),
]