from django.contrib import admin
from .models import Address, CartProduct, MyOrder,FoodItem,ProductCategory
from import_export.admin import ImportExportModelAdmin

admin.site.register(Address)
admin.site.register(CartProduct)
admin.site.register(MyOrder)
admin.site.register(FoodItem,ImportExportModelAdmin)


admin.site.register(ProductCategory,ImportExportModelAdmin)
