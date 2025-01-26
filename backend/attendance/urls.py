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

    path('attendance-list', views.attendance_list, name='attendance_list')
]