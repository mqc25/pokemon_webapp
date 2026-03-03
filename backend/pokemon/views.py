import csv
import io
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.gis.geos import Point
from .models import Pokemon, Favorite
from .serializers import PokemonSerializer, RegisterSerializer

class PokemonViewSet(viewsets.ModelViewSet):
    queryset = Pokemon.objects.all().order_by('name')
    serializer_class = PokemonSerializer
    parser_classes = [MultiPartParser, FormParser]
    # FIX: Prevents AnonymousUser from ever hitting your favorite logic
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'], url_path='toggle_favorite')
    def toggle_favorite(self, request, pk=None):
        # Line 34: Logic must be indented 4 spaces inside the function
        pokemon = self.get_object()
        
        # request.user is now guaranteed to be a real User ID
        fav, created = Favorite.objects.get_or_create(
            user=request.user, 
            pokemon=pokemon
        )
        
        if not created:
            fav.delete()
            return Response({'is_favorite': False}, status=status.HTTP_200_OK)
            
        return Response({'is_favorite': True}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], url_path='upload_csv')
    def upload_csv(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file"}, status=400)
        try:
            data_set = file.read().decode('UTF-8')
            io_string = io.StringIO(data_set)
            reader = csv.reader(io_string)
            next(reader) 
            for row in reader:
                Pokemon.objects.create(
                    name=row[0], latitude=float(row[1]), longitude=float(row[2]),
                    location=Point(float(row[2]), float(row[1])),
                    types=row[3], encounter_location=row[4],
                    recent_moves=row[5], sprite_url=row[6], is_custom=True
                )
            return Response({"status": "Uploaded"}, status=201)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            login(request, user)
            return Response({
                "status": "success", 
                "username": user.username
            }, status=status.HTTP_201_CREATED)
        
        # Returns specific requirement errors (e.g., password length) to the user
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            return Response({"status": "success"})
        return Response({"error": "Invalid"}, status=401)

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"status": "success"})