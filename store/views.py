from django.http import HttpResponse
from django.shortcuts import render, get_list_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Product
from .serializers import ProductSerializer


# Create your views here.
@api_view()
def product_list(request):
    queryset = Product.objects.all()
    serializer = ProductSerializer(queryset, many=True)
    serializer.data
    return Response(serializer.data)


@api_view()
def product_detail(request, id):
    # product = Product.objects.get(pk=id)
    # if you want to handle exception as well
    product = get_list_or_404(Product, pk=id)
    serializer = ProductSerializer(product)
    serializer.data
    return Response(serializer.data)
