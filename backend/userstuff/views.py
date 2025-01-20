from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from .models import Address, CartProduct, MyOrder,ProductCategory
from .serializers import AddressSerializer, CartProductSerializer, MyOrderSerializer,ProductCategorySerializer
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
# Profile Routes

def get_user(request):
    auth_header = request.headers.get('Authorization')

    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
    else:
        return JsonResponse({'error': 'Token missing'}, status=401)

    try:
        user = User.objects.get(auth_token=token)
        return JsonResponse({'id': user.id, 'username': user.username, 'email': user.email, 'first_name':user.first_name,'last_name':user.last_name,'date_joined':user.date_joined})  # Serialize user
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
    auth_header = request.headers.get('Authorization')

    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
    else:
        return JsonResponse({'error': 'Token missing'}, status=401)

    try:
        user = User.objects.get(auth_token=token)
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
def get_my_orders(request):
    user = request.user
    orders = MyOrder.objects.filter(user=user)
    serializer = MyOrderSerializer(orders, many=True)
    return Response(serializer.data, status=200)

# Create New Order
@api_view(["POST"])
def create_my_order(request):
    user = request.user
    serializer = MyOrderSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save(user=user)
        return Response(serializer.data, status=201)
    
    return Response(serializer.errors, status=400)