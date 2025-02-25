from django.urls import path

from . import views

urlpatterns = [path("hello/", views.SayHelloView.as_view())]
