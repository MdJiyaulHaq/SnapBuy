from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render, get_list_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view, action
from rest_framework import status
from rest_framework.permissions import *
from rest_framework.exceptions import PermissionDenied
from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from store.permissions import IsAdminOrReadOnly, FullDjangoModelPermission
from store.filters import ProductFilter
from store.pagination import ProductPagination
from .models import (
    Collection,
    Customer,
    Order,
    Product,
    OrderItem,
    Review,
    Cart,
    CartItem,
)
from django.db.models import Count
from .serializers import (
    CollectionSerializer,
    CreateOrderSerializer,
    CustomerSerializer,
    OrderItemSerializer,
    OrderSerializer,
    ProductSerializer,
    ReviewSerializer,
    CartSerializer,
    CartItemSerializer,
    AddCartItemSerializer,
    UpdateCartItemSerializer,
)
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.mixins import (
    CreateModelMixin,
    RetrieveModelMixin,
    UpdateModelMixin,
    DestroyModelMixin,
)
from rest_framework.viewsets import GenericViewSet


class CartViewSet(
    CreateModelMixin, RetrieveModelMixin, DestroyModelMixin, GenericViewSet
):
    queryset = Cart.objects.prefetch_related("items__product").all()
    serializer_class = CartSerializer


class CartItemViewSet(ModelViewSet):
    http_method_names = ["get", "post", "patch", "delete"]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return AddCartItemSerializer
        elif self.request.method == "PATCH":
            return UpdateCartItemSerializer
        return CartItemSerializer

    def get_serializer_context(self):
        return {"cart_id": self.kwargs["cart_pk"]}

    def get_queryset(self):
        return CartItem.objects.select_related("product").filter(
            cart_id=self.kwargs["cart_pk"]
        )


class ReviewViewSet(ModelViewSet):
    def get_queryset(self):
        return Review.objects.filter(product_id=self.kwargs["product_pk"])

    serializer_class = ReviewSerializer

    def get_serializer_context(self):
        return {"product_id": self.kwargs["product_pk"]}


class ProductViewSet(ModelViewSet):
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]
    pagination_class = ProductPagination
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]
    filterset_class = ProductFilter
    search_fields = ["title", "description"]
    ordering_fields = ["price", "last_update"]

    def get_serializer_context(self):
        return {"request": self.request}

    def destroy(self, request, *args, **kwargs):
        if OrderItem.objects.filter(pk=kwargs["pk"]).count() > 0:
            return Response(
                {"error": "Item cannot be deleted."},
                status=status.HTTP_405_METHOD_NOT_ALLOWED,
            )
        return super().destroy(request, *args, **kwargs)


# class ProductList(ListCreateAPIView):
#     # using advanced concepts like Mixins

#     def get_queryset(self):
#         return Product.objects.select_related("collection").all()

#     def get_serializer_class(self):
#         return ProductSerializer

#     def get_serializer_context(self):
#         return super().get_serializer_context()

#     # it can be shortened even more because we are not using any special logic

#     queryset = Product.objects.select_related("collection").all()
#     serializer_class = ProductSerializer

#     def get_serializer_context(self):
#         return super().get_serializer_context()


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


# class ProductDetail(RetrieveUpdateDestroyAPIView):
#     queryset = Product.objects.all()
#     serializer_class = ProductSerializer

#     # override the delete method for extra
#     def delete(self, request, pk):
#         product = get_object_or_404(Product, id=pk)
#         if product.orderitem_set.count() > 0:
#             return Response(
#                 {"error": "Item cannot be deleted."},
#                 status=status.HTTP_405_METHOD_NOT_ALLOWED,
#             )
#         product.delete
#         return Response({"error": "Item Deleted"}, status=status.HTTP_204_NO_CONTENT)


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


class CollectionViewSet(ModelViewSet):
    queryset = Collection.objects.annotate(product_count=Count("product"))
    serializer_class = CollectionSerializer
    permission_classes = [DjangoModelPermissionsOrAnonReadOnly]

    def get_serializer_context(self):
        return {"request": self.request}

    def destroy(self, request, *args, **kwargs):
        collection = (
            Collection.objects.filter(pk=kwargs["pk"])
            .annotate(product_count=Count("product"))
            .first()
        )
        if collection and collection.product_count > 0:
            return Response(
                {"error": "collection cannot be deleted"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {"error": "Collection Deleted"}, status=status.HTTP_204_NO_CONTENT
        )


# class CollectionList(ListCreateAPIView):
#     queryset = Collection.objects.annotate(product_count=Count("product")).all()
#     serializer_class = CollectionSerializer

#     def get_serializer_context(self):
#         return {"request": self.request}


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


# class CollectionDetail(RetrieveUpdateDestroyAPIView):
#     queryset = Collection.objects.annotate(product_count=Count("product"))
#     serializer_class = CollectionSerializer

#     def get_serializer_context(self):
#         return {"request": self.request}

#     def delete(self, delete, pk):
#         collection = get_object_or_404(
#             Collection.objects.annotate(product_count=Count("product")), id=pk
#         )
#         if collection.product_set.count() > 0:
#             return Response(
#                 {"error": "collection cannot be deleted"},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )
#         collection.delete()
#         return Response(
#             {"error": "Collection Deleted"}, status=status.HTTP_204_NO_CONTENT
#         )


# class CollectionDetail(APIView):
#     def get(self, request, pk):
#         collection = get_object_or_404(
#             Collection.objects.annotate(product_count=Count("product")), id=pk
#         )
#         serializer = CollectionSerializer(collection)
#         return Response(serializer.data)

#     def put(self, request, pk):
#         collection = get_object_or_404(
#             Collection.objects.annotate(product_count=Count("product")), id=pk
#         )
#         serializer = CollectionSerializer(collection, data=request.data)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)

#     def delete(self, delete, pk):
#         collection = get_object_or_404(
#             Collection.objects.annotate(product_count=Count("product")), id=pk
#         )
#         if collection.product_set.count() > 0:
#             return Response(
#                 {"error": "collection cannot be deleted"},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )
#         collection.delete()
#         return Response(
#             {"error": "Collection Deleted"}, status=status.HTTP_204_NO_CONTENT
#         )


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


class CustomerViewSet(ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAdminUser]

    @action(
        detail=False,
        methods=["GET", "PUT", "PATCH"],
        permission_classes=[IsAuthenticated],
    )
    def me(self, request):
        (customer, created) = Customer.objects.get_or_create(user_id=request.user.id)
        if request.method == "GET":
            serializer = CustomerSerializer(customer)
            return Response(serializer.data)
        elif request.method == "PUT":
            serializer = CustomerSerializer(customer, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        elif request.method == "PATCH":
            serializer = CustomerSerializer(customer, data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)


class OrderViewSet(ModelViewSet):
    http_methods_names = ["get", "patch", "delete", "head", "options"]

    def get_permissions(self):
        if self.request.method in ["PATCH", "DELETE"]:
            return [IsAdminUser()]
        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        serializer = CreateOrderSerializer(
            data=request.data, context={"user_id": self.request.user.id}
        )
        serializer.is_valid(raise_exception=True)
        # order is retured from custom save method in CreateOrderSerializer
        order = serializer.save()
        serializer = OrderSerializer(order)
        return Response(serializer.data)

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CreateOrderSerializer
        return OrderSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Order.objects.all()
        (customer_id, created) = Customer.objects.only("id").get_or_create(
            user_id=user.id
        )
        return Order.objects.filter(customer_id=customer_id)
