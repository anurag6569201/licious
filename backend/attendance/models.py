from django.db import models

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