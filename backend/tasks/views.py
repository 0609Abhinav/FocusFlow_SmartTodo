from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Task, Category, ContextEntry
from .serializers import TaskSerializer, CategorySerializer, ContextEntrySerializer
from .filters import TaskFilterBackend
from .ai_engine import pipeline

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by("name")
    serializer_class = CategorySerializer
    http_method_names = ["get"]

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by("-created_at")
    serializer_class = TaskSerializer
    filter_backends = [TaskFilterBackend]

class ContextEntryViewSet(viewsets.ModelViewSet):
    queryset = ContextEntry.objects.all().order_by("-created_at")
    serializer_class = ContextEntrySerializer

class AISuggestView(APIView):
    """
    POST payload example:
    {
      "task": {"title": "...", "description": "...", "category": "Personal"},
      "contexts": [{"content":"...", "source":"email"}, ...],
      "user_preferences": {"work_hours":"10-18"},
      "current_load": 5
    }
    """
    def post(self, request):
        data = request.data
        out = pipeline.generate_suggestions(
            task=data.get("task", {}),
            contexts=data.get("contexts", []),
            user_preferences=data.get("user_preferences", {}),
            current_load=data.get("current_load"),
        )
        return Response(out, status=status.HTTP_200_OK)
