from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from .models import Address, CartProduct, MyOrder,ProductCategory
from .serializers import AddressSerializer, CartProductSerializer, MyOrderSerializer,ProductCategorySerializer,MyOrderSerializerDelivery
from django.contrib.auth.models import User
from django.shortcuts import render

from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny

from rest_framework import generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import FoodItem
from .serializers import FoodItemSerializer

from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required,permission_required
from datetime import timedelta
from django.utils import timezone
# Profile Routes

def get_user(request):
    auth_header = request.headers.get('Authorization')

    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
    else:
        return JsonResponse({'error': 'Token missing'}, status=401)

    try:
        user = User.objects.get(auth_token=token)
        return JsonResponse({'id': user.id, 'username': user.username, 'email': user.email, 'first_name':user.first_name,'last_name':user.last_name,'date_joined':user.date_joined,'role':user.is_superuser})  # Serialize user
    except User.DoesNotExist:
        return JsonResponse({'error': 'Invalid token'}, status=401)
import json

@csrf_exempt
def update_user(request):
    # Extract the Authorization token
    auth_header = request.headers.get('Authorization')

    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
    else:
        return JsonResponse({'error': 'Token missing'}, status=401)

    try:
        # Parse the JSON data from the body
        data = json.loads(request.body)
        first_name = data.get("first_name")
        last_name = data.get("last_name")
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON format'}, status=400)

    try:
        # Retrieve the user using the token (ensure the `auth_token` field matches your model)
        user = User.objects.get(auth_token=token)
        
        # Update user details if provided
        if first_name:
            user.first_name = first_name
        if last_name:
            user.last_name = last_name

        user.save()

        return JsonResponse({
            "msg": "Details Updated Successfully", 
            "updated_user": user.email
        }, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

from django.http import JsonResponse
from django.contrib.auth.models import User


def home(request):
    # auth_header = request.headers.get('Authorization')

    # if auth_header and auth_header.startswith('Bearer '):
    token = "40a011f3caa4ae5b610074f2de739599cf9209ad"
    # else:
    #     return JsonResponse({'error': 'Token missing'}, status=401)

    try:
        user = User.objects.get(auth_token=token)
        otp=950822
        order = MyOrder.objects.get(user=user, otp_token=otp)
        print(order)
        return JsonResponse({'id': user.id, 'username': user.username, 'email': user.email, 'first_name':user.first_name,'last_name':user.last_name,'date_joined':user.date_joined})  # Serialize user
    except User.DoesNotExist:
        return JsonResponse({'error': 'Invalid token'}, status=401)



@api_view(["GET"])
@permission_classes([AllowAny])
def get_product(request, id):
    try:
        item = FoodItem.objects.filter(category_id=id).all()
        serializer = FoodItemSerializer(item,many=True)
        return Response({"data": serializer.data})  # Wrap the data in a 'data' key
    except FoodItem.DoesNotExist:
        return Response({"error": "Food item not found"}, status=404)

@api_view(["GET"])
@permission_classes([AllowAny])
def get_all_products(request):
    items = FoodItem.objects.all()
    serializer = FoodItemSerializer(items, many=True)
    return Response({"data": serializer.data}) 

@api_view(["GET"])
@permission_classes([AllowAny])
def get_all_products_category(request):
    items = ProductCategory.objects.all()
    serializer = ProductCategorySerializer(items, many=True)
    return Response(serializer.data)






@api_view(["GET"])
@permission_classes([AllowAny])
def get_address(request):
    auth_header = request.headers.get('Authorization')

    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
    else:
        return Response({'error': 'Token missing'}, status=401)
    try:
        user = User.objects.get(auth_token=token)
        item = Address.objects.filter(user=user).all()
        serializer = AddressSerializer(item,many=True)
        return Response(serializer.data)  # Wrap the data in a 'data' key
    except FoodItem.DoesNotExist:
        return Response({"error": "Food item not found"}, status=404)


@api_view(["POST"])
@permission_classes([AllowAny])
def create_address(request):
    auth_header = request.headers.get('Authorization')

    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
    else:
        return Response({'error': 'Token missing'}, status=401)

    try:
        user = User.objects.get(auth_token=token)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    serializer = AddressSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(["DELETE"])
@permission_classes([AllowAny])
def delete_address(request, id):
    auth_header = request.headers.get('Authorization')

    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
    else:
        return Response({'error': 'Token missing'}, status=401)

    try:
        user = User.objects.get(auth_token=token)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    try:
        address = Address.objects.get(id=id, user=user)
        address.delete()
        return Response({'message': 'Address deleted successfully'}, status=204)
    except Address.DoesNotExist:
        return Response({'error': 'Address not found'}, status=404)
    


@api_view(["GET"])
@permission_classes([AllowAny])
def get_cart_products(request):
    auth_header = request.headers.get('Authorization')

    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
    else:
        return Response({'error': 'Token missing'}, status=401)

    try:
        user = User.objects.get(auth_token=token)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    cart_products = CartProduct.objects.filter(user=user).all()
    serializer = CartProductSerializer(cart_products, many=True)
    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([AllowAny])
def create_cart_product(request):
    auth_header = request.headers.get('Authorization')

    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
    else:
        return Response({'error': 'Token missing'}, status=401)

    try:
        user = User.objects.get(auth_token=token)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    name = request.data.get('name')
    if CartProduct.objects.filter(user=user, name=name).exists():
        return Response({'message': 'Product already in cart'}, status=200)

    serializer = CartProductSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(["DELETE"])
@permission_classes([AllowAny])
def delete_cart_product(request, id):
    auth_header = request.headers.get('Authorization')

    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
    else:
        return Response({'error': 'Token missing'}, status=401)

    try:
        user = User.objects.get(auth_token=token)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    try:
        cart_product = CartProduct.objects.get(id=id, user=user)
        cart_product.delete()
        return Response({'message': 'Cart product deleted successfully'}, status=204)
    except CartProduct.DoesNotExist:
        return Response({'error': 'Cart product not found'}, status=404)
    


# Get My Orders
@api_view(["GET"])
@permission_classes([AllowAny])
def get_my_orders(request):
    auth_header = request.headers.get('Authorization')

    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
    else:
        return Response({'error': 'Token missing'}, status=401)
    try:
        user = User.objects.get(auth_token=token)
        item = MyOrder.objects.filter(user=user).all()
        serializer = MyOrderSerializer(item,many=True)
        return Response(serializer.data)  # Wrap the data in a 'data' key
    except FoodItem.DoesNotExist:
        return Response({"error": "Food item not found"}, status=404)


# Create New Order
@api_view(["POST"])
@permission_classes([AllowAny])
def create_my_order(request):
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
    else:
        return Response({'error': 'Token missing'}, status=401)

    try:
        user = User.objects.get(auth_token=token)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    serializer = MyOrderSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@csrf_exempt
def update_cart_quantity(request, item_id):
    if request.method == "PATCH":
        try:
            data = json.loads(request.body)
            new_qty = data.get("qty")

            if new_qty is None or new_qty < 1:
                return JsonResponse({"error": "Invalid quantity"}, status=400)

            cart_item = CartProduct.objects.get(id=item_id)
            cart_item.qty = new_qty
            cart_item.save()

            return JsonResponse({"message": "Quantity updated", "id": cart_item.id, "qty": cart_item.qty}, status=200)

        except CartProduct.DoesNotExist:
            return JsonResponse({"error": "Item not found"}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)



def attendance(request):
    return render(request,'attendance/attendance.html')







def is_delivery_person(request):
    auth_header = request.headers.get('Authorization')

    if not auth_header or not auth_header.startswith('Bearer '):
        return Response({'error': 'Token missing or invalid'}, status=401)

    token = auth_header.split(' ')[1]

    try:
        user = User.objects.get(auth_token=token)
        permissions = set(user.user_permissions.values_list('codename', flat=True))
        group_permissions = set(user.groups.values_list('permissions__codename', flat=True))
        all_permissions = permissions | group_permissions  # Merge permissions
        if 'change_myorder' in all_permissions:
            return JsonResponse({
                'delivery_person':True
            })
        else:
            return JsonResponse({'error': 'Permission denied'}, status=403)

    except User.DoesNotExist:
        return JsonResponse({'error': 'Invalid token'}, status=401)
    

def delivery(request):
    # Extract the Authorization header
    auth_header = request.headers.get('Authorization')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        return JsonResponse({'error': 'Token missing or invalid'}, status=401)
    
    token = auth_header.split(' ')[1]

    try:
        user = User.objects.get(auth_token=token)
    except User.DoesNotExist:
        return JsonResponse({'error': 'Invalid token'}, status=401)

    permissions = set(user.user_permissions.values_list('codename', flat=True))
    group_permissions = set(user.groups.values_list('permissions__codename', flat=True))
    all_permissions = permissions | group_permissions  # Merge permissions
    if 'change_myorder' in all_permissions:
        otp = request.GET.get('otp')
        otp = int(otp)
        if not otp:
            return JsonResponse({'error': 'OTP is required'}, status=400)

        try:
            order = MyOrder.objects.get(otp_token=otp)
            serializer = MyOrderSerializerDelivery(order)  # Removed `many=True`
            return JsonResponse(serializer.data, safe=False)
        except MyOrder.DoesNotExist:
            return JsonResponse({'error': 'No order found for this OTP'}, status=404)
        

@api_view(['POST'])
@permission_classes([AllowAny])
def confirm_order(request):
    data = request.data

    order_id = data.get("order_id")
    otp = data.get("otp_token")
    if not order_id:
        return Response(
            {"detail": "Order ID is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    print(data)
    try:
        order = MyOrder.objects.get(id=order_id,otp_token=otp)  
        order.is_delivered = True
        order.save()

        return Response(
            {"success": True, "message": "Order has been confirmed."},
            status=status.HTTP_200_OK,
        )

    except MyOrder.DoesNotExist:
        return Response(
            {"detail": "Order not found or does not belong to the authenticated user."},
            status=status.HTTP_404_NOT_FOUND,
        )

    except Exception as e:
        return Response(
            {"detail": f"An error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    


def orders_to_show(request):
    # Extract the Authorization header
    auth_header = request.headers.get('Authorization')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        return JsonResponse({'error': 'Token missing or invalid'}, status=401)
    
    token = auth_header.split(' ')[1]

    try:
        user = User.objects.get(auth_token=token)
    except User.DoesNotExist:
        return JsonResponse({'error': 'Invalid token'}, status=401)

    permissions = set(user.user_permissions.values_list('codename', flat=True))
    group_permissions = set(user.groups.values_list('permissions__codename', flat=True))
    all_permissions = permissions | group_permissions  
    if 'change_myorder' in all_permissions:
        last_24_hours = timezone.now() - timedelta(days=1)
        orders = MyOrder.objects.filter(is_delivered=False, created_at__gte=last_24_hours)
        serializer = MyOrderSerializerDelivery(orders, many=True)
        return JsonResponse(serializer.data, safe=False)
    return JsonResponse({'error': 'Insufficient permissions'}, status=403)