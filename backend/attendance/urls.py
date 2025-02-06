from django.urls import path
from attendance import views
app_name='attendance'

urlpatterns = [
    path('employee/add', views.add_employee, name='add_employee'),
    path('employee/attendance/add', views.add_employee_attendance, name='add_employee_attendance'),
    path('employee', views.employee_list, name='employee_list'),
    path('employee/delete/<int:id>', views.delete_employee, name='delete_employee'),
    path('employee/attendance/report', views.check_attendance_exists, name='check_attendance_exists'),

    path('employee/count', views.employee_count, name='employee_count'),
    path('employee/attendance-count', views.attendance_count, name='attendance_count'),
    path('employee/jobrole-count', views.job_role_count, name='job_role_count'),

    path('attendance-list', views.attendance_list, name='attendance_list'),


    path('inventory/add', views.add_inventory_item, name='add_inventory_item'),
    path('inventory/get', views.get_inventory_item, name='get_inventory_item'),
    path('inventory/update', views.get_inventory_item_update, name='get_inventory_item_update'),
    path('inventory/delete', views.get_inventory_item_delete, name='get_inventory_item_delete'),
    path('inventory/consumption-history', views.get_consumption_history, name='get_consumption_history'),

    path('supplier/add', views.add_supplier_item, name='add_supplier_item'),
    path('supplier/get', views.get_supplier_item, name='get_supplier_item'),
    path('supplier/delete', views.get_supplier_item_delete, name='get_supplier_item_delete'),

]