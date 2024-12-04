# API Documentation

## User Routes

### POST /user/login

Login user and generate token

- Request Body:
  - email: string
  - password: string
- Response:
  - token: string
  - user: object
- Example:
  - Request Body:
    {
      "email": "user@example.com",
      "password": "123456"
    }
  - Response:
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MmU1NmM2ODI2YmUzZTcxMzI5IiwiaWF0IjoxNjM0NTI2MjAyfQ.rh1j5FgXaHJhNlR7Z5W4Jv4Z8hOaTbJ0ZqLlM",
      "user": {
        "_id": "62e56c6826be373129",
        "fullName": "John Doe",
        "email": "user@example.com",
        "number": "1234567890",
        "password": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
        "createdAt": "2022-08-29T12:47:26.546Z",
        "updatedAt": "2022-08-29T12:47:26.546Z",
        "__v": 0
      }
    }

### POST /user/register

Register new user

- Request Body:
  - fullName: string
  - email: string
  - number: string
  - password: string
- Response:
  - message: string
  - status: boolean
- Example:
  - Request Body:
    {
      "fullName": "John Doe",
      "email": "user@example.com",
      "number": "1234567890",
      "password": "123456"
    }
  - Response:
    {
      "message": "User created successfully",
      "status": true
    }

### GET /user/all-users

Get all users

- Response:
  - users: array of objects

### GET /user/:id

Get user by id

- Request Param:
  - id: string
- Response:
  - user: object

### DELETE /user/:id

Delete user by id

- Request Param:
  - id: string
- Response:
  - message: string
  - status: boolean

## Admin Routes

### POST /admin/login

Login admin and generate token

- Request Body:
  - email: string
  - password: string
- Response:
  - token: string
  - admin: object

### POST /admin/add-admin

Add new admin

- Request Body:
  - email: string
  - password: string
- Response:
  - message: string
  - status: boolean

### GET /admin/all-admins

Get all admins

- Response:
  - admins: array of objects

### GET /admin/:id

Get admin by id

- Request Param:
  - id: string
- Response:
  - admin: object

### DELETE /admin/:id

Delete admin by id

- Request Param:
  - id: string
- Response:
  - message: string
  - status: boolean

## Product Routes

### POST /product/add-product

Add new product

- Request Body:
  - title: string
  - price: number
  - quantity: number
  - description: string
  - images: array of strings
- Response:
  - message: string
  - status: boolean
- Example:
  - Request Body:
    {
      "title": "Iphone 13",
      "price": 1000,
      "quantity": 10,
      "description": "This is a new Iphone 13",
      "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
    }
  - Response:
    {
      "message": "Product created successfully",
      "status": true
    }

### GET /product/all-products

Get all products

- Response:
  - products: array of objects

### GET /product/:id

Get product by id

- Request Param:
  - id: string
- Response:
  - product: object

### DELETE /product/:id
Delete product by id

- Request Param:
  - id: string
- Response:
  - message: string
  - status: boolean

## Order Routes

### POST /order/add-order

Add new order

- Request Body:
  - userId: string
  - products: array of objects
  - totalAmount: number
- Response:
  - message: string
  - status: boolean
- Example:
  - Request Body:
    {
      "userId": "62e56c6826be373129",
      "products": [
        {
          "productId": "62e56c6826be373129",
          "quantity": 2
        },
        {
          "productId": "62e56c6826be373130",
          "quantity": 3
        }
      ],
      "totalAmount": 3500
    }
  - Response:
    {
      "message": "Order created successfully",
      "status": true
    }

### GET /order/all-orders

Get all orders

- Response:
  - orders: array of objects

### GET /order/:id

Get order by id

- Request Param:
  - id: string
- Response:
  - order: object

### DELETE /order/:id

Delete order by id

- Request Param:
  - id: string
- Response:
  - message: string
  - status: boolean


