from django.urls import path
from attendance import views
app_name='attendance'

urlpatterns = [
    path('employee/add', views.add_employee, name='add_employee'),
]