import requests
import json

# 测试API接口
url = "http://localhost:5001/api/recommendations"
response = requests.get(url)

print("状态码:", response.status_code)
print("\n响应头:", dict(response.headers))
print("\n--- 响应内容 ---")
data = response.json()
print(json.dumps(data, ensure_ascii=False, indent=2))
