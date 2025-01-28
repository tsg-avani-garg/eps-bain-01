from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from urllib.parse import quote_plus


uri = "mongodb://localhost:27017"
client = MongoClient(uri)

print(client)

# Access database and collection
db = client.todo_db
collection = db["todo_data"]
add_collection=db["add_user_data"]
