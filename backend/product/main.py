from fastapi import FastAPI,HTTPException,Depends,Query,Request
from typing import List
from . import schemas
from . import model
from .database import collection
from .database import add_collection
from .database import audit_collection
from passlib.context import CryptContext
import secrets
import jwt
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware

from bson import ObjectId  # Import ObjectId for handling MongoDB IDs

def transform_mongo_document(doc):
    """Convert MongoDB document _id to a string and return the cleaned document."""
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])  # Convert ObjectId to string
    return doc

SECRET_KEY = secrets.token_urlsafe(32)
ALGORITHM = "HS256"


def generate_jwt(username: str):
    expiration = datetime.utcnow() + timedelta(hours=1)
    payload = {"sub": username, "exp": expiration}
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Allow your frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# def get_ist_time():
#     utc_now = datetime.utcnow()
#     ist = pytz.timezone("Asia/Kolkata")
#     return utc_now.replace(tzinfo=pytz.utc).astimezone(ist)



@app.post('/product')
def add(request: schemas.Product):
    product_dict = request.dict()
    print(product_dict)
    collection.insert_one(product_dict)
    return {"id": "123"}


@app.post('/register')
def register(request: schemas.Register):
    if collection.find_one({"username": request.username}):
        return {"error": "User already exists"}
    
    hashed_psswd=pwd_context.hash(request.password)
    new_user={
        "username":request.username,
        "password":hashed_psswd,
        "role":request.role
    }

    print(request)

    collection.insert_one(new_user)
    return {"message":"User registered successfully"}


@app.post("/login", response_model=schemas.TokenResponse)
def login(request: schemas.Login):
    # Check if the username (or email) exists in the database
    user = collection.find_one({"username": request.username})
    if not user:
        raise HTTPException(status_code=404, detail="Username not registered")

    # Verify the password
    if not pwd_context.verify(request.password, user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect password")

    # Generate JWT token
    payload = {
        "username": user["username"],
        "role": user["role"],
        "exp": datetime.utcnow() + timedelta(hours=1),  # Token expiration (1 hour)
        "iat": datetime.utcnow(),  # Issued at time
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    print(payload)

    return {"token": token, "username": payload["username"]}
  


# @app.post("/add-details")
# async def add_details(details: schemas.addDetails):
#     if add_collection.find_one({"username": details.username}):
#         raise HTTPException(
#             status_code=400,
#             detail="Username already exists. Please use a different email."
#         )

#     # Add new record to the add_collection
#     add_collection.insert_one(details.dict())

#     return {"message": "Details added successfully."}



@app.get("/get-details")
async def get_all_details():
    # Fetch all records from the add_collection
    all_data = add_collection.find()

    # Transform MongoDB documents to make them JSON serializable
    transformed_data = [transform_mongo_document(doc) for doc in all_data]

    if not transformed_data:
        raise HTTPException(status_code=404, detail="No records found.")

    return {"data": transformed_data}

# @app.put("/update-details/{id}")
# async def update_details(id: str, details: dict):
#     # Validate the ObjectId
#     if not ObjectId.is_valid(id):
#         raise HTTPException(status_code=400, detail="Invalid ID format")

#     # Exclude _id from the details dictionary
#     if "_id" in details:
#         del details["_id"]  # Remove _id if it exists in the payload

#     # Find the document by ID and update it
#     updated_result = add_collection.update_one(
#         {"_id": ObjectId(id)}, {"$set": details}
#     )

#     # Check if any document was modified
#     if updated_result.matched_count == 0:
#         raise HTTPException(status_code=404, detail="Record not found")

#     return {"message": "Details updated successfully"}


@app.delete("/delete-details/{id}")
async  def delete_details(id: str):
    # Validate the ObjectId
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail="Invalid ID format")

    # Find the document by ID and delete it
    delete_result = add_collection.delete_one({"_id": ObjectId(id)})

    # Check if any document was deleted
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Record not found")

    return {"message": "Details deleted successfully"}




@app.get("/search-details")
async def search_details(query: str = Query(..., description="Search query for filtering records")):
    """
    Search details by name, designation, phone number, or date.
    """
    try:
        # Perform a case-insensitive search using MongoDB's regex query
        results = list(
            add_collection.find(
                {
                    "$or": [
                        # $regex allows partial matches, and the i flag makes the search case-insensitive.
                        {"firstname": {"$regex": query, "$options": "i"}},
                        {"lastname": {"$regex": query, "$options": "i"}},
                        {"designation": {"$regex": query, "$options": "i"}},
                        {"phone": {"$regex": query, "$options": "i"}},
                        {"startdate": {"$regex": query, "$options": "i"}},
                    ]
                }
            )
        )
        
        # Transform MongoDB ObjectIDs to strings for the frontend
        for result in results:
            result["_id"] = str(result["_id"])

        return {"data": results}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


# @app.post("/upsert-details")
# async def upsert_details(details: schemas.addDetails):
#     """
#     Upsert (Update if exists, Insert if not) details in add_collection.
#     If the username exists, update it. If not, insert a new record.
#     """
#     try:
#         # Convert Pydantic model to dictionary
#         details_dict = details.dict()

#         # Ensure _id is not present in the update dictionary
#         if "_id" in details_dict:
#             del details_dict["_id"]

#         # Perform upsert (Update if exists, Insert if not)
#         result = add_collection.update_one(
#             {"username": details.username},  # Condition: Search by username
#             {"$set": details_dict},  # Correct syntax for updating fields
#             upsert=True  # If no match is found, insert a new document
#         )

#         audit_collection.insert_one({
#             "record_id": details.username,  # Track by username
#             "changed_by": details.username,  # Username of person making change
#             "timestamp": datetime.utcnow(),
#             "changes": details_dict
#         })

#         if result.upserted_id:
#             return {"message": "New entry added successfully", "id": str(result.upserted_id)}
#         else:
#             return {"message": "Details updated successfully"}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")




@app.get("/get-audit-logs")
async def get_audit_logs():
    """
    Fetch all audit logs from the audit_collection.
    """
    try:
        logs = list(audit_collection.find().sort("timestamp", -1))  # Sort by most recent
        # Convert ObjectId and datetime to string format
        for log in logs:
            log["_id"] = str(log["_id"])
            log["timestamp"] = log["timestamp"].isoformat()  # Convert datetime to string
        return {"logs": logs}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@app.post("/upsert-details")
async def upsert_details(details: schemas.addDetails):
    """
    Upsert (Update if exists, Insert if not) details in add_collection.
    Logs changes in audit_collection.
    """
    try:
        details_dict = details.dict()
        details_dict["updated_at"] = datetime.utcnow()

        # Find existing record
        existing_record = add_collection.find_one({"username": details.username})

        # Track changes
        changes = {}
        if existing_record:
            for key, new_value in details_dict.items():
                old_value = existing_record.get(key)
                if old_value != new_value:
                    changes[key] = {"old": old_value, "new": new_value}

        # Perform upsert
        add_collection.update_one(
            {"username": details.username},
            {"$set": details_dict},
            upsert=True
        )

        # Log changes if modifications were made
        if changes:
            audit_collection.insert_one({
                "record_id": details.username,
                "changed_by": details.changed_by,
                "timestamp": datetime.utcnow(),
                "changes": changes
            })

        return {"message": "New entry added successfully" if not existing_record else "Details updated successfully"}

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")