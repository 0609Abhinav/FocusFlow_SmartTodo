from django.contrib import admin
from .models import Task, Category, ContextEntry

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id","name","usage_count","created_at")
    search_fields = ("name",)

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("id","title","category","priority_score","deadline","status","created_at")
    list_filter = ("status","category")
    search_fields = ("title","description")

@admin.register(ContextEntry)
class ContextEntryAdmin(admin.ModelAdmin):
    list_display = ("id","source","created_at")
    search_fields = ("content",)
    list_filter = ("source",)
