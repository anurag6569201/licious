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
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cart_products",blank=True,null=True)
    name = models.CharField(max_length=255)
    imgUrl = models.URLField(blank=True, null=True)
    short_desc = models.TextField(blank=True, null=True)
    net = models.CharField(max_length=50)  # Example: "10gms", "0.5lts"
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    qty = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.name} - {self.qty} qty"


# Order Model
class MyOrder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders",blank=True,null=True)
    products = models.JSONField()  # Store product IDs & quantities in JSON format
    payment_id = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} by {self.user.email}"



# home page category api model
class ProductCategory(models.Model):
    product_id=models.CharField(max_length=100)
    imgSrc=models.URLField()
    name=models.CharField(max_length=50)

# food items
class FoodItem(models.Model):
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    food_id = models.CharField(max_length=100)
    name = models.CharField(max_length=255)
    imgUrl = models.URLField()
    imgUrl2 = models.URLField(blank=True, null=True)
    short_desc = models.TextField()
    net = models.CharField(max_length=100)  # e.g., "10gms", "0.5lts"
    tags = models.CharField(max_length=255, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    qty = models.CharField(max_length=50, blank=True, null=True)
    category_id = models.CharField(max_length=255)
    sub_cate = models.CharField(max_length=255)
    desc = models.TextField()
    isAvailable = models.BooleanField(default=True)

    def __str__(self):
        return self.name
