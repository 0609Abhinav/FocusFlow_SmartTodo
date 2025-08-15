import pytest
from django.urls import reverse
from rest_framework.test import APIClient

pytestmark = pytest.mark.django_db

def test_list_tasks(client: APIClient):
    url = reverse("task-list")
    resp = client.get(url)
    assert resp.status_code == 200

def test_ai_suggest(client: APIClient):
    url = reverse("ai-suggest")
    payload = {
        "task": {"title": "Finish report", "description": "Monthly report for client A"},
        "contexts": [{"content":"Reminder: deadline tomorrow", "source":"email"}],
        "current_load": 3
    }
    resp = client.post(url, payload, format="json")
    assert resp.status_code == 200
    data = resp.json()
    assert "priority_score" in data and "deadline_suggestion" in data
