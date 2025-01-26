from django.db import models

class Employee(models.Model):
    name = models.CharField(max_length=255)
    nic = models.CharField(max_length=20, unique=True)
    email = models.EmailField(null=True, blank=True)
    contactNumber = models.CharField(max_length=15)
    gender = models.CharField(max_length=10)
    age = models.IntegerField()
    address = models.TextField()
    jobrole = models.CharField(max_length=100)
    qualifications = models.TextField()

    def __str__(self):
        return self.name
