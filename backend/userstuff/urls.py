from django.urls import path
from userstuff import views
from .views import get_product, get_all_products,get_all_products_category
app_name='userstuff'

urlpatterns = [
    path('',views.home,name='home'),
    path('profile/getuser/', views.get_user, name='get_user'),
    path('profile/updateuser/', views.update_user, name='update_user'),

    # Address routes
    path('profile/getaddress/', views.get_address, name='get_address'),
    path('profile/createaddress/', views.create_address, name='create_address'),
    path('profile/updateaddress/<int:id>/', views.update_address, name='update_address'),
    path('profile/deleteaddress/<int:id>/', views.delete_address, name='delete_address'),

    path("fooditems/get/", get_all_products, name="get_all_products"),
    path("category/all/", get_all_products_category, name="get_all_products_category"),
    path("fooditems/get/<str:id>/", get_product, name="get_product"),
]