from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render, get_list_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Collection, Product
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
        serializer.save
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    elif request.method == "DELETE":
        if product.orderitem_set.count() > 0:
            return Response(
                {"error": "Item cannot be deleted."},
                status=status.HTTP_405_METHOD_NOT_ALLOWED,
            )
        product.delete
        return Response({"error": "Item Deleted"}, status=status.HTTP_204_NO_CONTENT)


@api_view()
def collection_detail(request, pk):
    collection = get_object_or_404(Collection, id=pk)
    serializer = CollectionSerializer(collection)
    serializer.data
    return Response(serializer.data)
