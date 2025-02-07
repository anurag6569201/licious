from django.urls import path
from userstuff import views
from .views import get_product, get_all_products,get_all_products_category
app_name='userstuff'

urlpatterns = [
    path('',views.home,name='home'),
    path('profile/getuser/', views.get_user, name='get_user'),
    path('profile/updateuser/', views.update_user, name='update_user'),

    path('profile/getaddress/', views.get_address,name="get_address"),
    path('profile/createaddress/', views.create_address, name="create_address"),  # URL for creating address
    path('profile/deleteaddress/<int:id>/', views.delete_address, name="delete_address"),  # URL for deleting address by ID


    path('profile/getcartprod/', views.get_cart_products, name="get_cart_products"),  # Get Cart Products
    path('profile/createcartprod/', views.create_cart_product, name="create_cart_product"),  # Add Cart Product
    path('profile/deletecartprod/<int:id>/', views.delete_cart_product, name="delete_cart_product"),  # Delete Cart Product


    path("fooditems/get/", get_all_products, name="get_all_products"),
    path("category/all/", get_all_products_category, name="get_all_products_category"),
    path("fooditems/get/<str:id>/", get_product, name="get_product"),

    path('profile/getmyorderprod/', views.get_my_orders, name="get_my_orders"),  # Get Orders
    path('profile/createmyorderprod/', views.create_my_order, name="create_my_order"),  # Create Order
    path('cart/update/<int:item_id>/', views.update_cart_quantity, name='update_cart_quantity'),

    path('attendance/',views.attendance,name='attendance'),


    path('delivery/',views.delivery,name='delivery'),
    path('delivery-check/',views.is_delivery_person,name='is_delivery_person'),
    path('confirm_order/',views.confirm_order,name='confirm_order'),
    path('show-orders/',views.orders_to_show,name='orders_to_show'),
]