from django.http import HttpResponse
from django.shortcuts import render, get_list_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Collection, Product
from .serializers import CollectionSerializer, ProductSerializer


# Create your views here.
@api_view()
def product_list(request):
    queryset = Product.objects.select_related("collection").all()
    serializer = ProductSerializer(queryset, many=True)
    serializer.data
    return Response(serializer.data)


@api_view()
def product_detail(request, pk):
    product = Product.objects.get(id=pk)
    serializer = ProductSerializer(product)
    serializer.data
    return Response(serializer.data)


@api_view()
def collection_detail(request, pk):
    return Response("Ok")
