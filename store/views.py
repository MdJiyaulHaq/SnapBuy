from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render, get_list_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Collection, Product
from django.db.models import Count
from .serializers import CollectionSerializer, ProductSerializer
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView


# Create your views here.
class ProductList(ListCreateAPIView):
    # using advanced concepts like Mixins

    def get_queryset(self):
        return Product.objects.select_related("collection").all()

    def get_serializer_class(self):
        return ProductSerializer

    def get_serializer_context(self):
        return super().get_serializer_context()

    # it can be shortened even more because we are not using any special logic

    Product.objects.select_related("collection").all()
    serializer_class = ProductSerializer

    def get_serializer_context(self):
        return super().get_serializer_context()


# class ProductList(APIView):
#     def get(self, request):
#         queryset = Product.objects.select_related("collection").all()
#         serializer = ProductSerializer(
#             queryset, many=True, context={"request": request}
#         )
#         serializer.data
#         return Response(serializer.data)

#     def post(self, request):
#         serializer = ProductSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.validated_data
#         serializer.save
#         return Response(serializer.data, status=status.HTTP_201_CREATED)


# @api_view(["GET", "POST"])
# def product_list(request):
#     if request.method == "GET":
#         queryset = Product.objects.select_related("collection").all()
#         serializer = ProductSerializer(queryset, many=True)
#         serializer.data
#         return Response(serializer.data)

#     elif request.method == "POST":
#         serializer = ProductSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.validated_data
#         serializer.save
#         return Response(serializer.data, status=status.HTTP_201_CREATED)


class ProductDetail(RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    # override the delete method for extra
    def delete(self, request, pk):
        product = get_object_or_404(Product, id=pk)
        if product.orderitem_set.count() > 0:
            return Response(
                {"error": "Item cannot be deleted."},
                status=status.HTTP_405_METHOD_NOT_ALLOWED,
            )
        product.delete
        return Response({"error": "Item Deleted"}, status=status.HTTP_204_NO_CONTENT)


# class ProductDetail(APIView):

#     def get(self, request, pk):
#         product = get_object_or_404(Product, id=pk)
#         serializer = ProductSerializer(product)
#         serializer.data
#         return Response(serializer.data)

#     def put(self, request, pk):
#         product = get_object_or_404(Product, id=pk)
#         serializer = ProductSerializer(product, data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.validated_data
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)

#     def delete(self, request, pk):
#         product = get_object_or_404(Product, id=pk)
#         if product.orderitem_set.count() > 0:
#             return Response(
#                 {"error": "Item cannot be deleted."},
#                 status=status.HTTP_405_METHOD_NOT_ALLOWED,
#             )
#         product.delete
#         return Response({"error": "Item Deleted"}, status=status.HTTP_204_NO_CONTENT)


# @api_view(["GET", "PUT", "DELETE"])
# def product_detail(request, pk):
#     product = get_object_or_404(Product, id=pk)
#     if request.method == "GET":
#         serializer = ProductSerializer(product)
#         serializer.data
#         return Response(serializer.data)

#     elif request.method == "PUT":
#         serializer = ProductSerializer(product, data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.validated_data
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)

#     elif request.method == "DELETE":
#         if product.orderitem_set.count() > 0:
#             return Response(
#                 {"error": "Item cannot be deleted."},
#                 status=status.HTTP_405_METHOD_NOT_ALLOWED,
#             )
#         product.delete
#         return Response({"error": "Item Deleted"}, status=status.HTTP_204_NO_CONTENT)


class CollectionList(ListCreateAPIView):
    queryset = Collection.objects.annotate(product_count=Count("product")).all()
    serializer_class = CollectionSerializer

    def get_serializer_context(self):
        return {"request": self.request}


# class CollectionList(APIView):
#     def get(self, request):
#         queryset = Collection.objects.annotate(product_count=Count("product")).all()
#         serializer = CollectionSerializer(queryset, many=True)
#         return Response(serializer.data)

#     def post(self, request):
#         serializer = CollectionSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)


# @api_view(["GET", "POST"])
# def collection_list(request):
#     if request.method == "GET":
#         queryset = Collection.objects.annotate(product_count=Count("product")).all()
#         serializer = CollectionSerializer(queryset, many=True)
#         return Response(serializer.data)

#     elif request.method == "POST":
#         serializer = CollectionSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)


class CollectionDetail(APIView):
    def get(self, request, pk):
        collection = get_object_or_404(
            Collection.objects.annotate(product_count=Count("product")), id=pk
        )
        serializer = CollectionSerializer(collection)
        return Response(serializer.data)

    def put(self, request, pk):
        collection = get_object_or_404(
            Collection.objects.annotate(product_count=Count("product")), id=pk
        )
        serializer = CollectionSerializer(collection, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, delete, pk):
        collection = get_object_or_404(
            Collection.objects.annotate(product_count=Count("product")), id=pk
        )
        if collection.product_set.count() > 0:
            return Response(
                {"error": "collection cannot be deleted"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        collection.delete()
        return Response(
            {"error": "Collection Deleted"}, status=status.HTTP_204_NO_CONTENT
        )


# @api_view(["GET", "PUT", "DELETE"])
# def collection_detail(request, pk):
#     collection = get_object_or_404(
#         Collection.objects.annotate(product_count=Count("product")), id=pk
#     )
#     if request.method == "GET":
#         serializer = CollectionSerializer(collection)
#         return Response(serializer.data)

#     elif request.method == "PUT":
#         serializer = CollectionSerializer(collection, data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)

#     elif request.method == "DELETE":
#         if collection.product_set.count() > 0:
#             return Response(
#                 {"error": "collection cannot be deleted"},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )
#         collection.delete()
#         return Response(
#             {"error": "Collection Deleted"}, status=status.HTTP_204_NO_CONTENT
#         )
