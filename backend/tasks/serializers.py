from rest_framework import serializers
from .models import Task, Category, ContextEntry

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

class TaskSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Task
        fields = "__all__"
    def get_category_name(self, obj):
        return obj.category.name if obj.category else None

class ContextEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContextEntry
        fields = "__all__"
