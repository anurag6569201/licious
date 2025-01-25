from rest_framework import serializers
from .models import Address, CartProduct, MyOrder,FoodItem,ProductCategory

# Address Serializer
class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'user', 'name', 'email', 'bldgno', 'locality', 'landmark', 'city']

# CartProduct Serializer
class CartProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartProduct
        fields = ['id', 'user', 'name', 'imgUrl', 'short_desc', 'net', 'price', 'discount', 'qty']

# MyOrder Serializer
class MyOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyOrder
        fields = ['id', 'user', 'products','payment_id','address_id', 'created_at']






class FoodItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodItem
        fields = '__all__'


class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = '__all__'
