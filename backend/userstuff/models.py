from django.db import models
from django.contrib.auth.models import User

# Address Model
class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="addresses")
    name = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    bldgno = models.CharField(max_length=255, blank=True, null=True)
    locality = models.CharField(max_length=255, blank=True, null=True)
    landmark = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.name} - {self.city}"


# Cart Product Model
class CartProduct(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cart_products")
    name = models.CharField(max_length=255)
    imgUrl = models.URLField(blank=True, null=True)
    short_desc = models.TextField(blank=True, null=True)
    net = models.CharField(max_length=50)  # Example: "10gms", "0.5lts"
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    qty = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.name} - {self.qty} qty"


# Order Model
class MyOrder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    products = models.JSONField()  # Store product IDs & quantities in JSON format
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} by {self.user.email}"

