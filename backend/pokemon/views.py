import csv
import io
import openpyxl 
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
    permission_classes = [permissions.IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        pokemon = self.get_object()
        if pokemon.owner != request.user:
            return Response(
                {"error": "You do not have permission to delete this Pokémon."}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=['post'], url_path='toggle_favorite')
    def toggle_favorite(self, request, pk=None):
        pokemon = self.get_object()
        fav, created = Favorite.objects.get_or_create(user=request.user, pokemon=pokemon)
        if not created:
            fav.delete()
            return Response({'is_favorite': False}, status=status.HTTP_200_OK)
        return Response({'is_favorite': True}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], url_path='upload_csv')
    def upload_csv(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file uploaded."}, status=400)
            
        try:
            # Handle CSV Files
            if file.name.endswith('.csv'):
                data_set = file.read().decode('UTF-8')
                io_string = io.StringIO(data_set)
                reader = csv.reader(io_string)
                next(reader)
                for row in reader:
                    self._create_pokemon_from_row(row, request.user)
                    
            # Handle XLSX Files
            elif file.name.endswith('.xlsx'):
                wb = openpyxl.load_workbook(file, data_only=True)
                sheet = wb.active
                rows = list(sheet.iter_rows(values_only=True))
                for row in rows[1:]:
                    if row[0]: 
                        self._create_pokemon_from_row(row, request.user)
            
            else:
                return Response({"error": "Unsupported file format. Please upload a .csv or .xlsx file."}, status=400)

            return Response({"status": "Uploaded successfully"}, status=201)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

    def _create_pokemon_from_row(self, row, user):
        """Helper to create a Pokemon regardless of whether it came from CSV or XLSX"""
        Pokemon.objects.create(
            name=str(row[0]),
            latitude=float(row[1]), 
            longitude=float(row[2]),
            coordinates=Point(float(row[2]), float(row[1])),
            types=str(row[3]), 
            encounter_location=str(row[4]),
            recent_moves=str(row[5]), 
            sprite_url=str(row[6]), 
            is_custom=True,
            owner=user
        )

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
        
        # return registration errors
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
        return Response({"error": "Invalid credentials"}, status=401)

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"status": "success"})