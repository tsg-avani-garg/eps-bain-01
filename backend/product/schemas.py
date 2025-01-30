from pydantic import BaseModel,Field
from typing import List, Literal, Dict, Any
from datetime import datetime


class Product(BaseModel):
    name: str
    price: float
    description: str = None  # Optional field


class Register(BaseModel):
    username: str
    password: str
    role: Literal["employee"] = "employee"


class Login(BaseModel):
    username:str
    password:str

class TokenResponse(BaseModel):
    token: str
    username: str


class addDetails(BaseModel):
    firstname: str
    lastname: str
    department: str
    designation: str
    username: str
    phone: str
    startdate: str
    changed_by: str
    updated_at: datetime 


# class AuditLog(BaseModel):
#     record_id: str  # ID of the modified record
#     changed_by: str  # Username of the person who made the change
#     timestamp: datetime  # Timestamp of the change
#     changes: Dict[str, Dict[str, Any]]  #