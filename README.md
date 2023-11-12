# MICRO SERVICE NESTJS MONGO RABBITMQ

## Install

```bash
git clone https://github.com/danangkonang/nest-micro.git
cd nest-micro
docker-compose up --build -d

# Seed Data
docker exec -i order /bin/bash -c "npm run seed"
```
## Endpoint

- Auth
```http
### Register Please Use Active Email Address For Recive Email Notification
POST http://localhost:3000/auth/register HTTP/1.1
Content-Type: application/json

{
  "email": "danangkonang21@gmail.com",
  "password": "12345"
}

### Login
POST http://localhost:3000/auth/login HTTP/1.1
Content-Type: application/json

{
  "email": "danangkonang21@gmail.com",
  "password": "12345"
}
```

- Menu
```http
@token = Bearer eyJhbGc...
### Find All Menu
GET http://localhost:3000/order/menu HTTP/1.1
Authorization: {{token}}

### Create menu
POST http://localhost:3000/order/menu HTTP/1.1
Content-Type: application/json
Authorization: {{token}}

{
  "name": "Mie",
  "price": 5000
}
###
```
- Order
```http
### Create Order
POST http://localhost:3000/order HTTP/1.1
Content-Type: application/json
Authorization: {{token}}

{
  "menu": [
    {
      "menu_id": "6550b9a9f6c039dcefa0f31a",
      "qty": 7
    },
    {
      "menu_id": "6550b9bdf6c039dcefa0f31d",
      "qty": 5
    }
  ]
}

### Find All Order
GET http://localhost:3000/order HTTP/1.1
Authorization: {{token}}

### Find Order By ID
GET http://localhost:3000/order/6550b9ccf6c039dcefa0f321 HTTP/1.1
Authorization: {{token}}
```