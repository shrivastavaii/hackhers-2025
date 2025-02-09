from flask import Blueprint, request, jsonify
from models import User
from api import db
from flask_cors import CORS, cross_origin
auth = Blueprint('auth', __name__)
CORS(auth)


@cross_origin
@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    users = db['users']
    user = users.find_one({"email": data['email']})
    if user:
        if user['password'] == data['password']:
            return jsonify({"message": "Login successful"}), 200
        else:
            return jsonify({"message": "Incorrect password"}), 400


@cross_origin
@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    user = User(data['username'], data['email'], data['password'])
    user_dict = user.to_dict()
    users = db['users']
    if (users.find_one({"email": user_dict['email']})):
        return jsonify({"message": "User already exists"}), 400
    else:
        users.insert_one(user_dict)
        return jsonify({"message": "User created"}), 201
