from pymongo import MongoClient
from flask_cors import CORS
from flask import Flask
MONGO_URI = "mongodb+srv://maitrasheehan:hto4IlPo8jAG0Wru@users.bqf7x.mongodb.net/?retryWrites=true&w=majority&appName=users"
client = MongoClient(MONGO_URI)
db = client['Shop']

app = Flask(__name__)
CORS(app)