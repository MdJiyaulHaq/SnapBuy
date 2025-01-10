from django.contrib import admin
from django.urls import reverse
from store.models import *
from store import models
from django.db.models import Count
from django.utils.html import format_html, urlencode


# Register your models here.
@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    search_fields = ["description"]
    list_display = ["description", "discount"]
    list_editable = ["discount"]
    list_per_page = 10


@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    list_display = ["title", "featured_product", "product_count"]
    list_per_page = 10
    search_fields = ["title"]

    @admin.display(description="Product Count")
    def product_count(self, collection):
        url = (
            reverse("admin:store_product_changelist")
            + "?"
            + urlencode({"collection__id": f"{collection.id}"})
        )
        return format_html('<a href="{}">{}</a>', url, collection.product_count)

    # Modify the base queryset to include the product count:
    def get_queryset(self, request):
        return super().get_queryset(request).annotate(product_count=Count("product"))


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    autocomplete_fields = ["collection"]
    actions = ["clear_inventory"]
    list_select_related = ["collection"]
    list_display = [
        "title",
        "price",
        "inventory_status",
        "collection_featured_product",
    ]
    list_editable = ["price"]
    list_per_page = 10
    search_fields = ["title", "description"]

    def collection_featured_product(self, product):
        return product.collection.featured_product

    @admin.display(ordering="inventory")
    def inventory_status(self, product):
        if product.inventory < 10:
            return "Low"
        return "OK"

    @admin.action(description="Clear inventory")
    def clear_inventory(self, request, queryset):
        updated_count = queryset.update(inventory=0)
        self.message_user(
            request, f"{updated_count} products were successfully updated."
        )


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ["first_name", "email", "membership"]
    list_editable = ["membership"]
    list_per_page = 10
    search_fields = ["first_name__istartswith", "last_name_istartswith"]
    ordering = ["first_name", "last_name"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_select_related = ["customer"]
    list_display = ["id", "Order_placed_at", "customer_name"]
    list_per_page = 10

    @admin.display(ordering="-placed_at")
    def customer_name(self, order):
        full_name = order.customer.first_name + " " + order.customer.last_name
        return full_name


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
