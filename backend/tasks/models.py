from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    usage_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.name

class Task(models.Model):
    class Status(models.TextChoices):
        TODO = "todo", "Todo"
        IN_PROGRESS = "in_progress", "In Progress"
        DONE = "done", "Done"
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.ForeignKey(Category, null=True, blank=True, on_delete=models.SET_NULL, related_name="tasks")
    priority_score = models.FloatField(default=0.0)
    deadline = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.TODO)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    tags = models.JSONField(default=list, blank=True)
    def __str__(self):
        return self.title

class ContextEntry(models.Model):
    class Source(models.TextChoices):
        WHATSAPP = "whatsapp", "WhatsApp"
        EMAIL = "email", "Email"
        NOTES = "notes", "Notes"
    content = models.TextField()
    source = models.CharField(max_length=20, choices=Source.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    processed_insights = models.JSONField(default=dict, blank=True)
    def __str__(self):
        return f"{self.source}: {self.content[:30]}..."
