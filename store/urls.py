from django.urls import include, path
from . import views
from rest_framework_nested import routers

router = routers.DefaultRouter()
router.register("products", views.ProductViewSet)
router.register("collections", views.CollectionViewSet)
router.register("carts", views.CartViewSet)
router.register("customers", views.CustomerViewSet)
router.register("orders", views.OrderViewSet, basename="orders")

product_routers = routers.NestedDefaultRouter(router, "products", lookup="product")
product_routers.register("reviews", views.ReviewViewSet, basename="product-reviews")

cart_routers = routers.NestedDefaultRouter(router, "carts", lookup="cart")
cart_routers.register("items", views.CartItemViewSet, basename="cart-items")

# urlpatterns= router.urls + product_routers.urls
urlpatterns = [
    path(r"", include(router.urls)),
    path(r"", include(product_routers.urls)),
    path(r"", include(cart_routers.urls)),
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
