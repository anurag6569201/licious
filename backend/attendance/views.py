from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Employee,EmployeeAttendance,InventoryItem,Supplier,ConsumptionHistory
from .serializers import EmployeeSerializer,EmployeeAttendanceSerializer,InventoryItemSerializer,SupplierSerializer
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from rest_framework.decorators import api_view,permission_classes
from django.http import JsonResponse
from django.db.models import Count


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

    data = request.data.copy()
    data['aadhaarImage'] = request.FILES.get('aadhaarImage')

    serializer = EmployeeSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "New Employee added"}, status=status.HTTP_201_CREATED)

    return Response({"error": "Failed to add new employee", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def employee_list(request):
    employees = Employee.objects.all()
    serializer = EmployeeSerializer(employees, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def attendance_list(request):
    date = request.GET.get('date')
    attendance = EmployeeAttendance.objects.all()

    if date:
        attendance = attendance.filter(date=date)

    attendance_data = [
        {
            "id": record.id,
            "date": record.date,
            "attendance": record.attendance,
            "day_type": record.day_type,
            "employee": EmployeeSerializer(record.employee).data
        }
        for record in attendance
    ]

    return Response(attendance_data)


@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_employee(request, id):
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
        try:
            employee = Employee.objects.get(pk=id)
            employee.delete()
            return Response({"message": "Employee deleted successfully"}, status=status.HTTP_200_OK)
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=status.HTTP_404_NOT_FOUND)
        


@api_view(['GET'])
@permission_classes([AllowAny])
def check_attendance_exists(request):
    date = request.query_params.get('date')
    if not date:
        return Response({'error': 'Date is required'}, status=status.HTTP_400_BAD_REQUEST)

    attendance = EmployeeAttendance.objects.filter(date=date)
    return Response(attendance.values('id', 'employee__name'))

@api_view(['POST'])
@permission_classes([AllowAny])
def add_employee_attendance(request):
    serializer = EmployeeAttendanceSerializer(data=request.data, many=True)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Attendance saved successfully'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# View to get the employee count
def employee_count(request):
    count = Employee.objects.count()
    return JsonResponse({"count": count})

def attendance_count(request):
    # Use aggregate to count present and absent in a single query
    attendance_counts = EmployeeAttendance.objects.values('attendance').annotate(count=Count('attendance'))
    
    # Initialize counts for 'present' and 'absent' to 0
    present_count = next((item['count'] for item in attendance_counts if item['attendance'] == 'present'), 0)
    absent_count = next((item['count'] for item in attendance_counts if item['attendance'] == 'absent'), 0)
    
    return JsonResponse({
        "presentCount": present_count,
        "absentCount": absent_count
    })

# View to get the job role counts
def job_role_count(request):
    job_roles = Employee.objects.values('jobrole').annotate(count=Count('jobrole'))
    return JsonResponse(list(job_roles), safe=False)




# --------------------------------------------------------
# inventory
# --------------------------------------------------------
@api_view(['POST'])
@permission_classes([AllowAny])  # Change this if authentication is needed
def add_inventory_item(request):
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
    else:
        return Response({'error': 'Token missing'}, status=401)

    try:
        user = User.objects.get(auth_token=token)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    if not user.is_staff:  # Only staff members can add inventory items
        return Response({'error': 'Permission denied'}, status=403)

    serializer = InventoryItemSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Inventory item added successfully"}, status=status.HTTP_201_CREATED)

    return Response({"error": "Failed to add inventory item", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_inventory_item(request):
    inventory = InventoryItem.objects.all()
    serialized_inventory = InventoryItemSerializer(inventory, many=True)
    return JsonResponse({"inventory": serialized_inventory.data}, safe=False)


@api_view(['PUT'])
@permission_classes([AllowAny])
def get_inventory_item_update(request):
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
    else:
        return Response({'error': 'Token missing'}, status=401)

    try:
        user = User.objects.get(auth_token=token)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    if not user.is_staff:  # Only staff members can update inventory items
        return Response({'error': 'Permission denied'}, status=403)

    item_id = request.data.get('id')
    consumption_amount = request.data.get('quantity')

    try:
        item = InventoryItem.objects.get(id=item_id)
        if consumption_amount > item.quantity:
            return Response({'error': 'Not enough stock'}, status=400)
        
        item.quantity -= consumption_amount
        item.save()

        # Log consumption history
        ConsumptionHistory.objects.create(
            item=item,
            quantity_consumed=consumption_amount
        )

        return Response({'message': 'Inventory updated', 'remaining_quantity': item.quantity}, status=200)
    
    except InventoryItem.DoesNotExist:
        return Response({'error': 'Item not found'}, status=404)
    

@api_view(['GET'])
@permission_classes([AllowAny])
def get_consumption_history(request):
    history = ConsumptionHistory.objects.all().order_by('-consumed_at')
    history_data = [
        {
            'unit':entry.item.unit,
            "item_name": entry.item.name,
            "quantity_consumed": entry.quantity_consumed,
            "date": entry.consumed_at.strftime('%Y-%m-%d %H:%M:%S')
        }
        for entry in history
    ]
    return Response(history_data, status=200)


@api_view(['DELETE'])
@permission_classes([AllowAny])
def get_inventory_item_delete(request):
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
    else:
        return Response({'error': 'Token missing'}, status=401)

    try:
        user = User.objects.get(auth_token=token)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    if not user.is_staff:  # Only staff members can delete inventory items
        return Response({'error': 'Permission denied'}, status=403)

    item_id = request.data.get('id')
    try:
        item = InventoryItem.objects.get(id=item_id)
    except InventoryItem.DoesNotExist:
        return Response({'error': 'Inventory item not found'}, status=404)

    item.delete()
    return Response({"message": "Inventory item deleted successfully"}, status=status.HTTP_200_OK)


# --------------------------------------------------------
# supplier
# --------------------------------------------------------


@api_view(['POST'])
@permission_classes([AllowAny])  # Change this if authentication is needed
def add_supplier_item(request):
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
    else:
        return Response({'error': 'Token missing'}, status=401)

    try:
        user = User.objects.get(auth_token=token)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    if not user.is_staff:  # Only staff members can add supplier items
        return Response({'error': 'Permission denied'}, status=403)

    serializer = SupplierSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "supplier item added successfully"}, status=status.HTTP_201_CREATED)

    return Response({"error": "Failed to add supplier item", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_supplier_item(request):
    supplier = Supplier.objects.all()
    serialized_supplier = SupplierSerializer(supplier, many=True)
    return JsonResponse({"supplier": serialized_supplier.data}, safe=False)


@api_view(['DELETE'])
@permission_classes([AllowAny])
def get_supplier_item_delete(request):
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
    else:
        return Response({'error': 'Token missing'}, status=401)

    try:
        user = User.objects.get(auth_token=token)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    if not user.is_staff:  # Only staff members can delete inventory items
        return Response({'error': 'Permission denied'}, status=403)

    item_id = request.data.get('id')
    try:
        item = Supplier.objects.get(id=item_id)
    except Supplier.DoesNotExist:
        return Response({'error': 'Inventory item not found'}, status=404)

    item.delete()
    return Response({"message": "Inventory item deleted successfully"}, status=status.HTTP_200_OK)
