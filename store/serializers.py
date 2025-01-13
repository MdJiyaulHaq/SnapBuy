from decimal import Decimal
from rest_framework import serializers
from .models import Product, Collection


class CollectionSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField(max_length=255)


class ProductSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField(max_length=255)
    price = serializers.DecimalField(max_digits=6, decimal_places=2)
    # one way to serialize a relationship
    collection = serializers.PrimaryKeyRelatedField(queryset=Collection.objects.all())
    
    # second way
    # dont forget to write select related in views file
    # queryset = Product.objects.select_related("collection").all()
    collection = serializers.StringRelatedField()

    # third way
    # make sure CollectionSerializer class is defined
    collection = CollectionSerializer()

    # fourth way
    collection = serializers.HyperlinkedRelatedField(
        queryset=Collection.objects.all(),
        view_name="collection_detail",
        # define a method collection_detail in views. also update url
    )

