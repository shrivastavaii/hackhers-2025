from datetime import datetime
from bson import ObjectId

class User:
    def __init__(self, username, email, password, img_url = "", trust_score=0):
        self.username = username
        self.email = email
        self.password = password
        self.img_url = img_url 
        self.trust_score = trust_score
        self.created_at = datetime.now()
        self.updated_at = datetime.now()

    def to_dict(self):
        return {
            "username": self.username,
            "email": self.email,
            "password": self.password,
            "img": self.img_url,
            "trust_score": self.trust_score,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
