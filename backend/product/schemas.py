from pydantic import BaseModel,Field
from typing import List, Literal

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


class addDetails(BaseModel):
    firstname:str
    lastname:str
    department:str
    designation:str
    email:str
    phone:str
    startdate:str
