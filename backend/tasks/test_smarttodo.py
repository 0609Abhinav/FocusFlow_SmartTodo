import requests

# Backend API URL
BASE_URL = "http://localhost:8000/api"

# Predefined tasks to create
TASKS_TO_CREATE = [
    {
        "title": "Buy groceries",
        "description": "fish, egg, milk, paneer",
        "priority": 5,
        "deadline": "2025-08-18",
        "tags": ["bug", "fix", "share", "update", "demo", "submit", "send", "tomorrow"]
    },
    {
        "title": "Finish report",
        "description": "Complete the weekly project report",
        "priority": 4,
        "deadline": "2025-08-16",
        "tags": ["report", "review", "submit"]
    },
    {
        "title": "Update charts",
        "description": "Update all dashboard charts with new data",
        "priority": 3,
        "deadline": "2025-08-17",
        "tags": ["charts", "update", "review"]
    },
    {
        "title": "Prepare references",
        "description": "Collect all references for presentation",
        "priority": 2,
        "deadline": "2025-08-19",
        "tags": ["references", "share", "demo"]
    }
]

# 1️⃣ Get all categories
def get_categories():
    url = f"{BASE_URL}/categories/"
    response = requests.get(url)
    if response.status_code == 200:
        categories = response.json()
        print("Categories:")
        for cat in categories:
            print(f"- {cat['id']}: {cat['name']}")
        return categories
    else:
        print("Failed to fetch categories:", response.status_code)
        return []

# 2️⃣ Get all tasks
def get_tasks():
    url = f"{BASE_URL}/tasks/"
    response = requests.get(url)
    if response.status_code == 200:
        tasks = response.json()
        print("\nExisting Tasks:")
        for task in tasks:
            print(f"- {task['id']}: {task['title']}")
        return tasks
    else:
        print("Failed to fetch tasks:", response.status_code)
        return []


# 3️⃣ Create multiple tasks
def create_tasks():
    categories = get_categories()
    if not categories:
        print("No categories found. Create categories first.")
        return

    category_id = categories[0]['id']  # Use the first category for all tasks

    for task_data in TASKS_TO_CREATE:
        task_data['category'] = category_id
        url = f"{BASE_URL}/tasks/"
        response = requests.post(url, json = task_data)
        if response.status_code in (200, 201):
            task = response.json()
            print("\nTask Created Successfully!")
            print("Title:", task.get('title'))
            print("Description:", task.get('description'))
            print("Priority:", task.get('priority'))
            print("Deadline:", task.get('deadline'))
            category = task.get('category')
            # If category is nested dict
            if isinstance(category, dict):
                category = category.get('id') or category.get('name')
            print("Category:", category)
            print("Tags:", task.get('tags'))
            print("Context Insights:", task.get('context_insights', 'No insights available'))
        else:
            print("Failed to create task:", response.status_code, response.text)


if __name__ == "__main__":
    get_tasks()
    create_tasks()
    get_tasks()
