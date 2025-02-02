from django.contrib import admin

from attendance import models

admin.site.register(models.Employee)
admin.site.register(models.EmployeeAttendance)
admin.site.register(models.InventoryItem)