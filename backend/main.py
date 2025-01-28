# from fastapi import FastAPI
#                     # class
# from pydantic import BaseModel

# from typing import Set,list
# class Profile(BaseModel):
#     name:str
#     age:int
#     address:str 

# class Image(BaseModel):
#     url:str
#     name:str

# class Product(BaseModel):
#     id:int
#     name:str
#     price:float
#     discount:float
#     discounted_price:float
#     tags:Set[str]=[]
#     # set accept the unique values
#     Image:list[Image]
#     # doing nesting of the class

    
# class offer(BaseModel):
#     code:str
#     discount:float
#     products:List[Product]
#     # deeply nested model


# # instance
# app=FastAPI()

# @app.get("/")
# def index():
#     return "hello world"


# @app.get("/property")
# def property():
#     return "this is a propert page"


# @app.get("/property/{property_id}")
# def property_id(property_id:float):
#     return {f"this is a propert page {property_id}"}
#     # whenever you pass a value in f string it become dynamic

# # these are called path parameters
# @app.get("/self/{self_id}")
# def self(self_id:str):
#     return {f"this is a self page {self_id}"}

 
# @app.get("/about")
# def about():
#     return {'movie list': ['movie1', 'movie2', 'movie3']}



# #order of the route
# # static route pehle and then dynamic 

# #query parameters
# @app.get("/products")
# # enter the default values
# def products(id:int=0,price:float=0):
#     return {f'product with an id:{id} and price:{price}'}


# @app.get("/product/{id}/comments")
# def comments(id:int,commentid):
#     return {f'comments for product with an id:{id} and comment:{commentid}'}


# @app.post("/adduser")
# def adduser(Profile:Profile):
#     return "user added successfully"


# @app.post("/addproduct")
# def addproduct(Product:Product):
#     Product.discounted_price=Product.price-(Product.discount*Product.price)/100
#     return Product


# @app.post("/purchase")
# def purchase(Product:Product,Profile:Profile):
#     return {f'purchase made for product with a product:{Product} and user:{Profile}'}
 