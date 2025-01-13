from decimal import Decimal
from rest_framework import serializers
from .models import Product, Collection


class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = ["id", "title"]


# it is better to use ModelSerializer class for Models
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            "id",
            "title",
            "description",
            "slug",
            "inventory",
            "price",
            "price_with_tax",
            "collection",
        ]

    price_with_tax = serializers.SerializerMethodField(method_name="calculate_tax")

    def calculate_tax(self, product: Product):
        return product.price * Decimal(1.18)
