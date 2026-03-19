# API Documentation

> Back to [README](../README.md)

## Swagger UI

Once the backend is running, interactive API documentation is available at:

```
http://localhost:8080/api/swagger-ui.html
```

The API is documented using **SpringDoc OpenAPI** annotations on controllers.

---

## Base URL

| Profile                | Base URL                                      |
|------------------------|-----------------------------------------------|
| Local (Docker Compose) | `http://localhost:8080/api`                   |
| Local Kubernetes       | `http://mini-aliexpress.local/api`            |
| Azure AKS              | `https://<aks-ingress>/api`                   |
| Azure PaaS             | `https://<app-service>.azurewebsites.net/api` |

---

## Authentication

All endpoints (except public product browsing) require a valid JWT token from Keycloak.

```
Authorization: Bearer <access_token>
```

See [Security](security.md) for Keycloak configuration and test user credentials.

---

## Planned Endpoints

### Products

| Method   | Endpoint               | Auth          | Description                                     |
|----------|------------------------|---------------|-------------------------------------------------|
| `GET`    | `/api/products`        | Public        | List products (paginated, filterable, sortable) |
| `GET`    | `/api/products/{id}`   | Public        | Get product by ID                               |
| `GET`    | `/api/products/search` | Public        | Full-text search                                |
| `POST`   | `/api/products`        | `ROLE_SELLER` | Create product                                  |
| `PUT`    | `/api/products/{id}`   | `ROLE_SELLER` | Update product                                  |
| `DELETE` | `/api/products/{id}`   | `ROLE_SELLER` | Delete product                                  |

### Categories

| Method | Endpoint               | Auth   | Description            |
|--------|------------------------|--------|------------------------|
| `GET`  | `/api/categories`      | Public | List all categories    |
| `GET`  | `/api/categories/tree` | Public | Get category hierarchy |

### Cart

| Method   | Endpoint                      | Auth        | Description             |
|----------|-------------------------------|-------------|-------------------------|
| `GET`    | `/api/cart`                   | `ROLE_USER` | Get current user's cart |
| `POST`   | `/api/cart/items`             | `ROLE_USER` | Add item to cart        |
| `PUT`    | `/api/cart/items/{productId}` | `ROLE_USER` | Update item quantity    |
| `DELETE` | `/api/cart/items/{productId}` | `ROLE_USER` | Remove item from cart   |

### Orders

| Method  | Endpoint                  | Auth          | Description                                    |
|---------|---------------------------|---------------|------------------------------------------------|
| `POST`  | `/api/orders`             | `ROLE_USER`   | Place order (checkout)                         |
| `GET`   | `/api/orders/{id}`        | `ROLE_USER`   | Get order by ID                                |
| `GET`   | `/api/orders`             | `ROLE_USER`   | List user's orders (filterable by status/date) |
| `PATCH` | `/api/orders/{id}/status` | `ROLE_SELLER` | Update order status                            |

### Images

| Method | Endpoint      | Auth          | Description          |
|--------|---------------|---------------|----------------------|
| `POST` | `/api/images` | `ROLE_SELLER` | Upload product image |

### Seller

| Method | Endpoint                | Auth          | Description                   |
|--------|-------------------------|---------------|-------------------------------|
| `GET`  | `/api/seller/products`  | `ROLE_SELLER` | List seller's products        |
| `GET`  | `/api/seller/orders`    | `ROLE_SELLER` | List incoming orders          |
| `GET`  | `/api/seller/inventory` | `ROLE_SELLER` | View inventory / stock levels |

---

## Response Format

### Paginated Response

```json
{
  "content": [
    ...
  ],
  "page": 0,
  "size": 20,
  "totalElements": 150,
  "totalPages": 8
}
```

### Error Response

```json
{
  "timestamp": "2025-01-01T12:00:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Product not found with id: 42",
  "path": "/api/products/42"
}
```
