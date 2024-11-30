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
  - offerPrice: number
  - description: string
  - images: array of strings
- Response:
  - message: string
  - status: boolean

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
