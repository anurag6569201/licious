from django.db import models
from django.utils import timezone


class Employee(models.Model):
    name = models.CharField(max_length=255)
    nic = models.CharField(max_length=20, unique=True)
    aadhaarImage = models.ImageField(upload_to='docs/')
    email = models.EmailField(null=True, blank=True)
    contactNumber = models.CharField(max_length=15)
    gender = models.CharField(max_length=10)
    age = models.IntegerField()
    address = models.TextField()
    jobrole = models.CharField(max_length=100)
    qualifications = models.TextField()

    def __str__(self):
        return self.name


class EmployeeAttendance(models.Model):
    employee = models.ForeignKey('Employee', on_delete=models.CASCADE, related_name='attendance_records')
    date = models.DateField()
    attendance = models.CharField(max_length=10, choices=[('present', 'Present'), ('absent', 'Absent')])
    day_type = models.CharField(max_length=20, choices=[('workday', 'Workday'), ('holiday', 'Holiday')])

    class Meta:
        unique_together = ('employee', 'date')

    def __str__(self):
        return f"{self.employee.name} - {self.date}"
    



class InventoryItem(models.Model):
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    quantity = models.FloatField()
    unit = models.CharField(max_length=50, default='kg')
    min_stock = models.FloatField()
    expiration_date = models.DateField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    cost = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name

    def is_expired(self):
        return self.expiration_date and self.expiration_date < timezone.now().date()
    

class Supplier(models.Model):
    name = models.CharField(max_length=255)
    contact = models.CharField(max_length=255)
    specialty = models.CharField(max_length=255)
    rating = models.IntegerField(default=3)
    last_delivery = models.CharField(max_length=100)

    def __str__(self):
        return self.name
