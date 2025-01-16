from django.urls import path
from userstuff import views

app_name='userstuff'

urlpatterns = [
    path('profile/getuser/', views.get_user, name='get_user'),
    path('profile/updateuser/', views.update_user, name='update_user'),

    # Address routes
    path('profile/getaddress/', views.get_address, name='get_address'),
    path('profile/createaddress/', views.create_address, name='create_address'),
    path('profile/updateaddress/<int:id>/', views.update_address, name='update_address'),
    path('profile/deleteaddress/<int:id>/', views.delete_address, name='delete_address'),

    # Cart product routes
    path('profile/getcartprod/', views.get_cart_products, name='get_cart_products'),
    path('profile/createcartprod/', views.create_cart_product, name='create_cart_product'),
    path('profile/deletecartprod/<int:id>/', views.delete_cart_product, name='delete_cart_product'),

    # MyOrder routes
    path('profile/createmyorderprod/', views.create_my_order, name='create_my_order'),
    path('profile/getmyorderprod/', views.get_my_orders, name='get_my_orders'),
]