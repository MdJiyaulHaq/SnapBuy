from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.contenttypes.admin import GenericTabularInline
from django.utils.html import format_html

from store.models import Product
from .models import User
from store.admin import ProductAdmin, ProductImageInline
from tags.models import TaggedItem


class TagInline(GenericTabularInline):
    model = TaggedItem
    autocomplete_fields = ["tag"]
    extra = 1


class CustomProductAdmin(ProductAdmin):
    inlines = [TagInline, ProductImageInline]


admin.site.unregister(Product)
admin.site.register(Product, CustomProductAdmin)


# Register your models here.
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "username",
                    "password1",
                    "password2",
                    "email",
                    "first_name",
                    "last_name",
                ),
            },
        ),
    )
