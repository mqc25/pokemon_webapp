from rest_framework import serializers
from .models import Pokemon, Favorite
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.models import User
from django.db import transaction

class PokemonSerializer(serializers.ModelSerializer):
    # favorite tag
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = Pokemon
        fields = [
            'id', 'name', 'latitude', 'longitude', 'types', 
            'sprite_url', 'encounter_location', 'recent_moves', 
            'is_custom', 'is_favorite'
        ]

    def get_is_favorite(self, obj):
        # check for favorite tag
        user = self.context.get('request').user
        if user and user.is_authenticated:
            return Favorite.objects.filter(user=user, pokemon=obj).exists()
        return False

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password]
    )
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email')

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )