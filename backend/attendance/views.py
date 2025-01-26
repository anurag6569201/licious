from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Employee
from .serializers import EmployeeSerializer
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from rest_framework.decorators import api_view,permission_classes

@api_view(['POST'])
@permission_classes([AllowAny])
def add_employee(request):
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
    else:
        return Response({'error': 'Token missing'}, status=401)

    try:
        user = User.objects.get(auth_token=token)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    
    if not user.is_superuser:
        return Response({'error': 'Permission denied'}, status=403)
    else:
        serializer = EmployeeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "New Employee added"}, status=status.HTTP_201_CREATED)
    return Response({"error": "Failed to add new employee", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
