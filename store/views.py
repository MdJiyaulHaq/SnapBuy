from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view

# Create your views here.
@api_view()
def product_list(request):
    return Response("Hello, World!")

@api_view()
def product_detail(request, id):
    return Response(id)