# EduLib Spring Boot Backend

Spring Boot backend for the existing React + Vite frontend. API field names and payload keys follow the frontend contracts exactly (`email`, `password`, `role`, `joinedAt`, `status`, `tags`, `reviews`, `id`, `timestamp`, etc.).

## Tech Stack
- Java 17
- Spring Boot (Web, Data JPA, Security, Validation)
- JWT Authentication
- MySQL

## Project Structure
- `controller/`
- `service/`
- `repository/`
- `model/`
- `dto/`
- `config/`

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Users
- `GET /api/users`
- `GET /api/users/{id}`
- `PATCH /api/users/{id}/status`
- `PATCH /api/users/{id}/password`

### Resources + Reviews
- `GET /api/resources`
- `GET /api/resources/{id}`
- `POST /api/resources`
- `PATCH /api/resources/{id}`
- `DELETE /api/resources/{id}`
- `GET /api/resources/{id}/reviews`
- `POST /api/resources/{id}/reviews`
- `PATCH /api/resources/{resourceId}/reviews/{reviewId}`
- `DELETE /api/resources/{resourceId}/reviews/{reviewId}`

### Bookmarks
- `GET /api/users/{userId}/bookmarks`
- `POST /api/users/{userId}/bookmarks/{resourceId}`
- `DELETE /api/users/{userId}/bookmarks/{resourceId}`

### History
- `GET /api/users/{userId}/history`
- `POST /api/users/{userId}/history`
- `DELETE /api/users/{userId}/history?resourceId={resourceId}`

### Analytics (Admin)
- `GET /api/analytics/downloads?period=daily|monthly`
- `GET /api/analytics/users`
- `GET /api/analytics/summary`

## Run Steps
1. Update MySQL credentials in `src/main/resources/application.properties`.
2. Create database user permissions as needed.
3. Run:
   ```bash
   mvn spring-boot:run
   ```
4. API will be available at `http://localhost:8080`.

## Default Seed Accounts
- Admin: `admin@edulib.com` / `admin123`
- User: `student@test.com` / `student123`
- Suspended User: `jane.doe@example.com` / `jane123`

## JWT Usage
Send token as:

`Authorization: Bearer <token>`

Token is returned by both `/api/auth/login` and `/api/auth/register` inside `token` field.
