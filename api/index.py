import json
from api.app import app

def handler(event, context):
    path = event.get("path", "/")
    method = event.get("method", "GET")
    headers = event.get("headers", {})
    
    if path == "/" or path.startswith("/assets") or path.startswith("/index"):
        return {
            "statusCode": 404,
            "headers": {"Content-Type": "text/plain"},
            "body": "Not found"
        }
    
    with app.test_client() as client:
        if method == "GET":
            response = client.get(path)
        elif method == "POST":
            body = event.get("body", "{}")
            if isinstance(body, str):
                body = json.loads(body)
            response = client.post(path, json=body, headers=headers)
        else:
            response = client.get(path)
        
        return {
            "statusCode": response.status_code,
            "headers": dict(response.headers),
            "body": response.get_data(as_text=True)
        }
