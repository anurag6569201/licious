from django.contrib import admin
from .models import Address, CartProduct, MyOrder

admin.site.register(Address)
admin.site.register(CartProduct)
admin.site.register(MyOrder)
