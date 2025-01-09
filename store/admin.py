from django.contrib import admin
from store.models import *
from store import models


# Register your models here.
@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    search_fields = ["description"]
    list_display = ["description", "discount"]
    list_editable = ["discount"]
    list_per_page = 10


@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    list_display = ["title", "featured_product"]
    list_editable = ["featured_product"]
    list_per_page = 10


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["title", "price", "inventory", "last_update"]
    list_editable = ["price", "inventory"]
    list_per_page = 10


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ["first_name", "email", "membership"]
    list_editable = ["membership"]
    search_fields = ["first_name", "last_name", "email"]
    ordering = ["first_name", "last_name"]
    list_per_page = 10


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["id", "Order_placed_at"]
    list_per_page = 10


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ["id", "order", "product", "quantity", "unit_price"]
    list_per_page = 10


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ["street", "city"]
    list_per_page = 10


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ["id", "created_at"]
    list_per_page = 10


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ["id", "cart", "product", "quantity"]
    list_per_page = 10
