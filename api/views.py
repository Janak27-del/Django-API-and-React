from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('-created_at')
    serializer_class = TaskSerializer

@api_view(['GET'])
def aether_root(request):
    return Response({
        "status": "Neural Core Online",
        "system": "Aether Intelligence System",
        "endpoints": {
            "api": "/api/tasks/",
            "admin": "/admin/"
        },
        "message": "Synaptic connection successful. Data streams are active."
    })
