"""
URL configuration for storefront project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import HttpResponse
from django.urls import include, path, re_path
from django.views.generic import TemplateView
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
import os

admin.site.site_header = "Storefront Admin"
admin.site.site_title = "Admin"
admin.site.index_title = "Admin Portal"


# Serve index.html for all frontend routes
def serve_spa(request):
    return HttpResponse(
        open(os.path.join(settings.STATICFILES_DIRS[0], "index.html")).read(),
        content_type="text/html",
    )


schema_view = get_schema_view(
    openapi.Info(
        title="SnapBuy API",
        default_version="v1",
        description="This the collections of API for an ecommerce website.",
        contact=openapi.Contact(email="md@desvutech.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
    authentication_classes=[],
)

urlpatterns = [
    # API endpoints
    path("api/", include("core.urls")),
    path("api/playground/", include("playground.urls")),
    path("api/admin/", admin.site.urls),
    path("api/auth/", include("djoser.urls")),
    path("api/auth/", include("djoser.urls.jwt")),
    path("api/store/", include("store.urls")),
    # API documentation
    path(
        "api/swagger<format>/",
        schema_view.without_ui(cache_timeout=0),
        name="schema-json",
    ),
    path(
        "api/swagger/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    path(
        "api/redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"
    ),
    # Serve frontend for all other routes except excluded prefixes
    re_path(r"^(?!api/|assets/|static/|media/|__debug__/).*$", TemplateView.as_view(template_name="index.html")),
]

if settings.DEBUG:
    import debug_toolbar

    urlpatterns += [
        path("__debug__/", include(debug_toolbar.urls)),
        path("silk/", include("silk.urls", namespace="silk")),
    ]
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
