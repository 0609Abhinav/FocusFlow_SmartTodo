import requests

url = "http://localhost:8000/api/tasks/"

data = {
    "title": "Prepare presentation",
    "description": "Finish slides for Monday meeting",
    "priority": 3,
    "deadline": "2025-08-18",
    "category": 1,  # Make sure this category exists
    "tags": ["work", "slides", "meeting"]
}

response = requests.post(url, json=data)

print("Status Code:", response.status_code)
print("Response JSON:", response.json())
