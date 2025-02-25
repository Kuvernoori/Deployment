# 🚀 CarTrading API
CarTrading is a Node.js-based API for a car trading platform, supporting user authentication, car listing management, and search functionalities.

## 🛠 Features
- User authentication (JWT-based)

-Car listing creation and management

-Search and filtering for car listings

-User profile management

-Review system

## ⚙️ Installation
-Prerequisites
-Node.js (>= 14.x)

-MongoDB

## 🎭 Setup
Clone the repository:

-`git clone https://github.com/Kuvernoori/Deployment`
-`cd Deployment`
## 🐙 Install dependencies:

## Start the server:

`node index.js`

# API Documentation

## **Create Ad**
**POST** `/`  
Creates a new car ad.  

**Headers:**  
- `Authorization: Bearer <token>`  

**Body:**  
```json
{
  "name": "Car Name",
  "year": 2022,
  "color": "Red",
  "description": "Car details",
  "seller": "Seller ID"
}
```

**Response:** `201 Created`  
```json
{
  "_id": "car_id",
  "name": "Car Name",
  "year": 2022,
  "color": "Red",
  "description": "Car details",
  "seller": "Seller ID",
  "image": "/uploads/car.jpg",
  "rating": 5
}
```

---

## **Get Ads**
**GET** `/api/ads`  
Fetch all ads or filter by seller.  

**Headers:**  
- `Authorization: Bearer <token>`  

**Query Params:**  
- `seller` _(optional)_ - Filter ads by seller  

**Response:** `200 OK`  
```json
[
  {
    "_id": "car_id",
    "name": "Car Name",
    "year": 2022,
    "color": "Red",
    "description": "Car details",
    "seller": "Seller ID",
    "image": "/uploads/car.jpg",
    "rating": 5
  }
]
```

---

## **Delete Ad**
**DELETE** `/:id`  
Deletes an ad by ID.  

**Headers:**  
- `Authorization: Bearer <token>`  

**Response:** `200 OK`  
```json
{ "message": "Ad deleted" }
```

---

## **Update Ad**
**PUT** `/:id`  
Updates ad details.  

**Headers:**  
- `Authorization: Bearer <token>`  

**Body:**  
```json
{
  "name": "Updated Car Name",
  "year": 2023,
  "color": "Blue",
  "description": "Updated details"
}
```

**Response:** `200 OK`  
```json
{
  "_id": "car_id",
  "name": "Updated Car Name",
  "year": 2023,
  "color": "Blue",
  "description": "Updated details",
  "seller": "Seller ID",
  "image": "/uploads/car.jpg",
  "rating": 5
}
```

---

## **Check Email (GET)**
**GET** `/check-email`  
Checks if an email is already registered.  

**Query Params:**  
- `email` _(required)_ - Email to check  

**Response:** `200 OK`  
```json
{ "exists": true, "message": "Email is already registered" }
```

---

## **Check Email (POST)**
**POST** `/check-email`  
Checks if a new email exists.  

**Headers:**  
- `Authorization: Bearer <token>`  

**Body:**  
```json
{ "newEmail": "user@example.com" }
```

**Response:** `200 OK`  
```json
{ "exists": false }
```

## **Check Username (GET)**
**GET** `/check-username`  
Checks if a username is already taken.  

**Query Params:**  
- `username` _(required)_ - Username to check  

**Response:** `200 OK`  
```json
{ "exists": true, "message": "Username is already taken" }
```
or  
```json
{ "exists": false, "message": "Username is available" }
```
or  
`400 Bad Request`  
```json
{ "exists": false, "message": "Username is required" }
```
or  
`500 Internal Server Error`  
```json
{ "exists": false, "message": "Server error" }
```

---

## **Check Username (POST)**
**POST** `/check-username`  
Checks if a new username is available.  

**Headers:**  
- `Authorization: Bearer <token>`  

**Body:**  
```json
{ "newUsername": "user123" }
```

**Response:** `200 OK`  
```json
{ "exists": true }
```
or  
```json
{ "exists": false }
```
or  
`500 Internal Server Error`  
```json
{ "error": "Internal server error" }
```

---

## **Get All Cars**
**GET** `/all`  
Fetches all available car ads.  

**Response:** `200 OK`  
```json
[
  {
    "_id": "car_id",
    "name": "Car Name",
    "year": 2022,
    "color": "Red",
    "description": "Car details",
    "seller": "Seller ID",
    "image": "/uploads/car.jpg",
    "rating": 5
  }
]
```
or  
`404 Not Found`  
```json
{ "message": "No cars found" }
```
or  
`500 Internal Server Error`  
```json
{ "message": "Server error", "error": "Error details" }
```

---

## **Get User**
**GET** `/user`  
Retrieves the username of the authenticated user.  

**Headers:**  
- `Authorization: Bearer <token>`  

**Response:** `200 OK`  
```json
{ "username": "user123" }
```
or  
`401 Unauthorized`  
```json
{ "error": "No token provided, access denied" }
```
or  
`404 Not Found`  
```json
{ "error": "User not found" }
```
or  
`500 Internal Server Error`  
```json
{ "error": "Server error" }
```

---

## **Login**
**POST** `/login`  
Authenticates a user and returns a token.  

**Body:**  
```json
{
  "username": "user123",
  "password": "password123"
}
```

**Response:** `200 OK`  
```json
{ "token": "jwt_token", "message": "Login successful" }
```
or  
`400 Bad Request`  
```json
{ "message": "Invalid username or password" }
```
or  
`500 Internal Server Error`  
```json
{ "message": "Server error" }
```

```markdown
# API Documentation

## Authentication

### **GET** `/me`
Retrieves the authenticated user's profile.

#### **Headers:**
- `Authorization`: Bearer Token

#### **Response:**
```json
{
  "userId": "string",
  "username": "string",
  "email": "string",
  "gender": "string",
  "age": "number"
}
```

---

### **PUT** `/update`
Updates the authenticated user's gender or age.

#### **Headers:**
- `Authorization`: Bearer Token

#### **Body:**
```json
{
  "gender": "string",
  "age": "number"
}
```

#### **Response:**
```json
{
  "message": "User information updated successfully!"
}
```

---

### **PUT** `/change-name`
Changes the authenticated user's username.

#### **Headers:**
- `Authorization`: Bearer Token

#### **Body:**
```json
{
  "newUsername": "string"
}
```

#### **Response:**
```json
{
  "message": "Name updated successfully!"
}
```

---

### **PUT** `/change-email`
Changes the authenticated user's email.

#### **Headers:**
- `Authorization`: Bearer Token

#### **Body:**
```json
{
  "newEmail": "string"
}
```

#### **Response:**
```json
{
  "message": "Email updated successfully!"
}
```

---

### **POST** `/check-current-password`
Verifies if the given password matches the current password.

#### **Headers:**
- `Authorization`: Bearer Token

#### **Body:**
```json
{
  "currentPassword": "string"
}
```

#### **Response:**
```json
{
  "message": "Password is correct"
}
```

---

### **PUT** `/change-password`
Changes the authenticated user's password.

#### **Headers:**
- `Authorization`: Bearer Token

#### **Body:**
```json
{
  "newPassword": "string"
}
```

#### **Response:**
```json
{
  "message": "Password updated successfully!"
}
```

---

## Reviews

### **GET** `/reviews`
Retrieves reviews for a user.

#### **Query Parameters:**
- `userId`: `string` (required)

#### **Response:**
```json
[
  {
    "_id": "string",
    "reviewerId": "string",
    "reviewerName": "string",
    "rating": "number",
    "text": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
]
```

---

### **POST** `/reviews`
Creates a new review.

#### **Headers:**
- `Authorization`: Bearer Token

#### **Body:**
```json
{
  "userId": "string",
  "reviewerId": "string",
  "reviewerName": "string",
  "text": "string",
  "rating": "number"
}
```

#### **Response:**
```json
{
  "_id": "string",
  "userId": "string",
  "reviewerId": "string",
  "reviewerName": "string",
  "text": "string",
  "rating": "number"
}
```

---

### **PUT** `/reviews/:id`
Updates an existing review.

#### **Headers:**
- `Authorization`: Bearer Token

#### **Body:**
```json
{
  "text": "string",
  "rating": "number"
}
```

#### **Response:**
```json
{
  "message": "Review updated successfully"
}
```

---

### **DELETE** `/reviews/:id`
Deletes a review.

#### **Headers:**
- `Authorization`: Bearer Token

#### **Response:**
```json
{
  "message": "Review deleted successfully"
}
```

---

## Search

### **GET** `/search`
Search for a car by name.

#### **Query Parameters:**
- `name`: `string` (required)

#### **Response:**
```json
[
  {
    "_id": "string",
    "name": "string",
    "model": "string",
    "year": "number"
  }
]
```

---

## User Registration

### **POST** `/signup`
Registers a new user.

#### **Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "password_confirm": "string"
}
```

#### **Response:**
```json
{
  "message": "User registered successfully!"
}
```
```

