from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from .models import Address, CartProduct, MyOrder,ProductCategory
from .serializers import AddressSerializer, CartProductSerializer, MyOrderSerializer,ProductCategorySerializer
from django.contrib.auth.models import User
from django.shortcuts import render

# Profile Routes

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    email = request.data.get("email")
    try:
        user = User.objects.get(email=email)
        return Response({"user": user.email}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user(request):
    email = request.data.get("email")
    name = request.data.get("name")
    mobile = request.data.get("mobile")
    try:
        user = User.objects.get(email=email)
        user.name = name
        user.mobile = mobile
        user.save()
        return Response({"msg": "Details Updated Successfully", "updated_user": user.email}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

# Address Routes

@api_view(['GET'])
def get_address(request):
    email = request.query_params.get("email")  # Use query_params for GET requests
    if not email:
        return Response({"error": "Email parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
        addresses = user.addresses.all()
        serializer = AddressSerializer(addresses, many=True)
        return Response({"msg": f"Address for {email}", "address_List": serializer.data}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_address(request):
    email = request.data.get("email")
    bldgno = request.data.get("bldgno")
    locality = request.data.get("locality")
    landmark = request.data.get("landmark")
    city = request.data.get("city")
    try:
        user = User.objects.get(email=email)
        new_address = Address.objects.create(
            user=user,
            bldgno=bldgno,
            locality=locality,
            landmark=landmark,
            city=city
        )
        return Response({"msg": f"Address created for {email} Successfully", "new_add": AddressSerializer(new_address).data}, status=status.HTTP_201_CREATED)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_address(request, id):
    try:
        address = Address.objects.get(id=id)
        address.bldgno = request.data.get("bldgno")
        address.locality = request.data.get("locality")
        address.landmark = request.data.get("landmark")
        address.city = request.data.get("city")
        address.save()
        return Response({"msg": "Address updated successfully", "Updated_address": AddressSerializer(address).data}, status=status.HTTP_200_OK)
    except Address.DoesNotExist:
        return Response({"error": "Address not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_address(request, id):
    try:
        address = Address.objects.get(id=id)
        address.delete()
        return Response({"msg": "Address Deleted Successfully"}, status=status.HTTP_200_OK)
    except Address.DoesNotExist:
        return Response({"error": "Address not found"}, status=status.HTTP_404_NOT_FOUND)

# Cart Product Routes

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart_products(request):
    email = request.data.get("email")
    try:
        user = User.objects.get(email=email)
        cart_products = user.cart_products.all()
        serializer = CartProductSerializer(cart_products, many=True)
        return Response({"cart": serializer.data}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_cart_product(request):
    email = request.data.get("email")
    try:
        user = User.objects.get(email=email)
        new_cart_product = CartProduct.objects.create(
            user=user,
            name=request.data.get("name"),
            imgUrl=request.data.get("imgUrl"),
            short_desc=request.data.get("short_desc"),
            net=request.data.get("net"),
            price=request.data.get("price"),
            discount=request.data.get("discount"),
            qty=request.data.get("qty")
        )
        return Response({"msg": "Item added to cart", "new_cart_prod": CartProductSerializer(new_cart_product).data}, status=status.HTTP_201_CREATED)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_cart_product(request, id):
    try:
        cart_product = CartProduct.objects.get(id=id)
        cart_product.delete()
        return Response({"msg": "Item removed from cart"}, status=status.HTTP_200_OK)
    except CartProduct.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

# MyOrder Routes

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_my_order(request):
    email = request.data.get("email")
    try:
        user = User.objects.get(email=email)
        cart_products = user.cart_products.all()
        my_order = MyOrder.objects.create(
            user=user,
            products=[prod.id for prod in cart_products]  # Store product IDs
        )
        return Response({"msg": "Order created successfully"}, status=status.HTTP_201_CREATED)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_orders(request):
    email = request.data.get("email")
    try:
        user = User.objects.get(email=email)
        orders = user.orders.all()
        serializer = MyOrderSerializer(orders, many=True)
        return Response({"orders": serializer.data}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


def home(request):
    print(request.user.auth_token)
    return render(request, 'home.html')







from rest_framework import generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import FoodItem
from .serializers import FoodItemSerializer

# Get all food items
class FoodItemListView(generics.ListAPIView):
    queryset = FoodItem.objects.all()
    serializer_class = FoodItemSerializer

# Get a single food item by ID
class FoodItemDetailView(generics.RetrieveAPIView):
    queryset = FoodItem.objects.all()
    serializer_class = FoodItemSerializer
    lookup_field = "id"  # Assumes MongoDB ObjectId as ID

from rest_framework.decorators import permission_classes
from rest_framework.permissions import AllowAny

@api_view(["GET"])
@permission_classes([AllowAny])
def get_product(request, id):
    try:
        item = FoodItem.objects.get(food_id=id)
        serializer = FoodItemSerializer(item)
        return Response({"data": [serializer.data]})  # Wrap the data in a 'data' key
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