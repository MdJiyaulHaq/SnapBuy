from django.urls import include, path
from rest_framework_nested import routers

from . import views

router = routers.DefaultRouter()
router.register("products", views.ProductViewSet)
router.register("collections", views.CollectionViewSet)
router.register("carts", views.CartViewSet)
router.register("customers", views.CustomerViewSet)
router.register("orders", views.OrderViewSet, basename="orders")

product_router = routers.NestedDefaultRouter(router, "products", lookup="product")
product_router.register("reviews", views.ReviewViewSet, basename="product-reviews")
product_router.register("images", views.ProductImageViewSet, basename="product-images")

cart_router = routers.NestedDefaultRouter(router, "carts", lookup="cart")
cart_router.register("items", views.CartItemViewSet, basename="cart-items")

urlpatterns = [
    path("", include(router.urls)),
    path("", include(product_router.urls)),
    path("", include(cart_router.urls)),
    # other paths
    # path("products/", views.ProductList.as_view()),
    # path("products/<int:pk>/", views.ProductDetail.as_view(), name="product_detail"),
    # path("collections/", views.CollectionList.as_view()),
    # path(
    #     "collections/<int:pk>/",
    #     views.CollectionDetail.as_view(),
    #     name="collection_detail",
    # ),
]
