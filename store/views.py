from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render, get_list_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Collection, Product
from django.db.models import Count
from .serializers import CollectionSerializer, ProductSerializer


# Create your views here.
@api_view(["GET", "POST"])
def product_list(request):
    if request.method == "GET":
        queryset = Product.objects.select_related("collection").all()
        serializer = ProductSerializer(queryset, many=True)
        serializer.data
        return Response(serializer.data)

    elif request.method == "POST":
        serializer = ProductSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data
        serializer.save
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT", "DELETE"])
def product_detail(request, pk):
    product = get_object_or_404(Product, id=pk)
    if request.method == "GET":
        serializer = ProductSerializer(product)
        serializer.data
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = ProductSerializer(product, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    elif request.method == "DELETE":
        if product.orderitem_set.count() > 0:
            return Response(
                {"error": "Item cannot be deleted."},
                status=status.HTTP_405_METHOD_NOT_ALLOWED,
            )
        product.delete
        return Response({"error": "Item Deleted"}, status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST"])
def collection_list(request):
    if request.method == "GET":
        queryset = Collection.objects.annotate(product_count=Count("product")).all()
        serializer = CollectionSerializer(queryset, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        serializer = CollectionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT", "DELETE"])
def collection_detail(request, pk):
    collection = get_object_or_404(
        Collection.objects.annotate(product_count=Count("product")), id=pk
    )
    if request.method == "GET":
        serializer = CollectionSerializer(collection)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = CollectionSerializer(collection, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    elif request.method == "DELETE":
        if collection.product_set.count() > 0:
            return Response(
                {"error": "collection cannot be deleted"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        collection.delete()
        return Response(
            {"error": "Collection Deleted"}, status=status.HTTP_204_NO_CONTENT
        )
