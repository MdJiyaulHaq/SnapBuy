from django.contrib import admin

from .models import Tag


# Register your models here.
@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ["label"]
    search_fields = ["label"]
