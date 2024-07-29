# Laptop Lens API

## Overview
The API is used to provide the data for the mobile apps that includes :
- Handle register, login and logout for user
- Handle user to update the incoming and outgoing stock data
- Handle the prediction sales 


## API Endpoints

### 1. Login
Login account
```http
GET /login 
```

Request Body
```json
{
  "username": "gabrielmdy08@gmail.com",
  "password": "*********"
}
```

Response Body
```json
{
  "status": "Success",
  "message": "Login successful",
  "refreshToken": "string token",
}
```
### 2. Register
Register new account
```http
POST /signup
```

Request Body
```json
{
  "firstName": "Gabriel",
  "lastName": "Waworundeng",
  "username": "gabrielmdy08@gmail.com",
  "password": "*********",
  "confirmPassword": "*********"
}
```

Response Body
```json
{
  "status": "Success",
  "message": "User created successfully"
}
```

### 3. Get user data
Get user profile data using token
```http
Authorization: Bearer <token>
GET /user
```

Response Body
```json
{
  "status": "Success",
  "data": {
    "firstName": "Asep",
    "lastName": "Supratman",
    "email": "asep@gmail.com"
  }
}
```

### 4. Logout
Logout account
```http
POST /logout
```

Response Body
```json
{
  "status": "Success",
  "message": "Logout successful"
}
```

### 5. Get Stocks Data
Give user all the data stocks
```http
Authorization: Bearer <token>
GET /stocks?name
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `name` | `string` | **Optional**. Return stock data by name |

Response Body
```json
{
  "status": "string",
  "data": [
    {
      "id": "string",
      "name": "string",
      "category": "string",
      "price": 0,
      "total_stocks": 0
    }
  ]
}
```

### 6. Get Stock Data by ID
Give user the data stocks by ID
```http
Authorization: Bearer <token>
GET /stocks/{id}
```

Response Body
```json
{
  "status": "string",
  "data": {
      "id": "string",
      "name": "string",
      "category": "string",
      "price": 0,
      "total_stocks": 0
    }
}
```

### 7. Insert incoming stock transaction
Update incoming stock data
```http
Authorization: Bearer <token>
POST /stocks/incoming
```

Request Body
```json
{
  "name": "string",
  "vendor_name": "string",
  "price": 0,
  "date": "string",
  "quantity": 0
}
```

Response Body
```json
{
  "status": "string",
  "data": {
    "id": 0,
    "name": "string",
    "price": 0,
    "date": "string",
    "quantity": 0
  }
}
```

### 8. Insert outgoing stock transaction
Update outgoing stock data
```http
Authorization: Bearer <token>
POST /stocks/outgoing
```

Request Body
```json
{
  "name": "string",
  "price": 0,
  "date": "string",
  "quantity": 0
}
```

Response Body
```json
{
  "status": "string",
  "data": {
    "id": 0,
    "name": "string",
    "price": 0,
    "date": "string",
    "sales": 0
  }
}
```

### 9. Export data to csv
Export csv file from outgoing stocks data
```http
Authorization: Bearer <token>
POST /stocks/export?month
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `month` | `string` | **Required**. range month to exported |

Response Body
```csv
name,price,date,sales
ACER ASPIRE 3 A315 RYZEN 5 3500 4GB 1TB ATI VEGA 8 DOS BLACK,6690000,2017-12-01,28
ACER ASPIRE 5 A514-52G-58PW -I5-10210U-8GB-512GB-MX250-WIN10-,10000000,2017-12-01,67
ACER ASPIRE 3 A314 49WC 4644 4816 - A4 9120E 4GB 1TB SHARE W10,3499000,2017-12-01,19
"ACER PREDATOR NITRO 5 AN515-55 - I5-10300H - 8GB - 512SSD - GTX1650TI 4GB - 15.6""144HZ -W10 - OFFICE",12599000,2017-12-01,33
ACER PREDATOR NITRO AN515-44 - RYZEN 7-4800H 8GB 512GB GTX1650TI 4GB,15499000,2017-12-01,83... (105 KB left)
```

### 10. Predict the data
Predict sales 
```http
Authorization: Bearer <token>
Content-Type: multipart/form-data
POST /predict
```

Request Body
```json
{
  "file": "filename.csv"
}
```

Response Body
```json
{
  "status": "string",
  "data": {
    "low": [
      {
        "date": "string",
        "sales": 1234
      }
    ],
    "midd": [
      {
        "date": "string",
        "sales": 1234
      }
    ],
    "high": [
      {
        "date": "string",
        "sales": 1234
      }
    ]
  }
}
```

### 11. Get last prediction history
Give user the history from the last prediction
```http
Authorization: Bearer <token>
GET /last-prediction
```

Response Body
```json
{
  "status": "string",
  "data": {
    "low": [
      {
        "date": "string",
        "sales": 1234
      }
    ],
    "midd": [
      {
        "date": "string",
        "sales": 1234
      }
    ],
    "high": [
      {
        "date": "string",
        "sales": 1234
      }
    ]
  }
}
```

## Cloud Architecture
![alt Cloud Architecture](https://github.com/C4AnN/Laptop_Lens/blob/main/CC/Cloud%20Architecture.png)

- Artifact registry   - Store docker image
- Cloud Run           - Serverless service to deploy the API apps using image from artifact registry
- Cloud Storage - Store model file in json format
- Cloud SQL - Store transactions data and product stocks
- Firestore - Store User data and prediction histories

