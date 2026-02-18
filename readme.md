# Clootrack Assessment

## 📌 Overview

This project is a full-stack Support Ticket Management System built as part of the Clootrack Backend Assessment.

It includes:

- Django + Django REST Framework backend
- PostgreSQL database
- Gemini LLM-based classification
- Dockerized backend environment
- React (Vite) frontend
- RESTful API architecture
- Status and priority update functionality
- Aggregation-based statistics endpoint

The system supports full ticket lifecycle management with AI-powered categorization.

---

# 🏗️ Architecture

```
Frontend (React - Vite)
⬇
Backend (Django REST Framework)
⬇
PostgreSQL (Docker container)
```

All backend services are containerized using Docker Compose.

---

# 🔧 Backend Implementation

## 1️⃣ Ticket Model

The `Ticket` model includes:

- `title`
- `description`
- `category` (TextChoices)
- `priority` (TextChoices)
- `status` (TextChoices)
- `created_at` (auto timestamp)

### Enums Used

```python
class Category(models.TextChoices):
    BILLING = "billing", "Billing"
    TECHNICAL = "technical", "Technical"
    ACCOUNT = "account", "Account"
    GENERAL = "general", "General"

class Priority(models.TextChoices):
    LOW = "low", "Low"
    MEDIUM = "medium", "Medium"
    HIGH = "high", "High"
    CRITICAL = "critical", "Critical"

class Status(models.TextChoices):
    OPEN = "open", "Open"
    IN_PROGRESS = "in_progress", "In Progress"
    RESOLVED = "resolved", "Resolved"
    CLOSED = "closed", "Closed"
```

---

## 🌐 API Routes

### 🔹 Core CRUD Routes (Auto-generated via ModelViewSet)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tickets/` | List all tickets |
| POST | `/api/tickets/` | Create ticket |
| GET | `/api/tickets/<id>/` | Retrieve ticket |
| PATCH | `/api/tickets/<id>/` | Update ticket |
| PUT | `/api/tickets/<id>/` | Full update |
| DELETE | `/api/tickets/<id>/` | Delete ticket |

### 🔹 PATCH Route (Assignment Requirement)

`PATCH /api/tickets/<id>/`

Used for:

- Updating status
- Overriding category
- Overriding priority

Example:

```json
{
  "status": "closed",
  "priority": "high"
}
```

This updates the ticket in PostgreSQL.

### 🔹 Filtering Support

```
GET /api/tickets/?status=open
GET /api/tickets/?priority=high
GET /api/tickets/?category=billing
GET /api/tickets/?search=payment
```

Filtering implemented using `get_queryset()` with query parameters.

### 🔹 Statistics Route

`GET /api/tickets/stats/`

Returns:

- Total tickets
- Count by status
- Count by category
- Count by priority
- Average tickets per day

Uses database-level aggregation.

### 🔹 LLM Classification Route

`POST /api/tickets/classify/`

Input:

```json
{
  "description": "Customer was charged twice"
}
```

Output:

```json
{
  "suggested_category": "billing",
  "suggested_priority": "medium"
}
```

- Uses Gemini API.
- Graceful fallback implemented if API fails.

---

# 🐳 Docker Setup

### Services

- `db` → PostgreSQL container
- `backend` → Django container (Gunicorn)

### Features

- Environment-based DB configuration
- DB readiness check using netcat
- Automatic migrations on startup
- Gunicorn production server

---

# 🎨 Frontend Implementation

Built with:

- React (Vite)
- Axios
- TailwindCSS (UI styling)

## Implemented Features

### 1️⃣ Ticket Creation

- Form submission
- LLM suggestion auto-fill
- Manual override allowed

### 2️⃣ Ticket Listing

Fetches all tickets and displays:

- Title
- Description
- Category
- Priority
- Status

### 3️⃣ Ticket Update (Modal)

When clicking a ticket:

- Modal opens
- Allows updating Status and Priority
- Calls: `PATCH /api/tickets/<id>/`
- Database updates persist after refresh

### 4️⃣ CORS Configuration

Enabled using:

```python
corsheaders.middleware.CorsMiddleware
```

Configured:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173"
]
```

---

# ⚠️ Problems Faced & Solutions

### 1️⃣ Django Not Found Error

**Issue:** `ModuleNotFoundError: No module named 'django'`

**Solution:** Virtual environment was not activated.

### 2️⃣ PATCH Not Updating

**Issue:** Used GET with query parameters instead of PATCH.

**Solution:** Properly used `PATCH /api/tickets/<id>/`

### 3️⃣ Docker DB Connection Refused

**Issue:** Backend tried connecting before DB was ready.

**Solution:** Added wait-for-db logic using netcat in Dockerfile.

### 4️⃣ Gunicorn Not Found

**Issue:** Gunicorn missing inside container.

**Solution:** Added `gunicorn==21.2.0` to `requirements.txt`.

### 5️⃣ CORS Blocked by Browser

**Issue:** Frontend couldn't access backend.

**Root Cause:** CORS middleware order incorrect.

**Solution:** Placed `corsheaders.middleware.CorsMiddleware` at the top of `MIDDLEWARE`.

### 6️⃣ Hostname "db" Not Found (Local Run)

**Issue:** Running Django locally while DB was Docker-only.

**Solution:** Used environment-based DB host configuration.

### 7️⃣ TextChoices Enum Error

**Issue:** Incorrect enum definition caused `TypeError: decoding str is not supported`

**Solution:** Corrected enum syntax.

---

# ✅ Assignment Requirements Covered

- RESTful API design
- CRUD operations
- PATCH update route
- Filtering & search
- Aggregation stats endpoint
- LLM integration
- Dockerized backend
- PostgreSQL persistence
- Frontend integration
- Real database updates (not frontend-only state)
- Production-ready Gunicorn setup

---

# 🚀 Final System Capabilities

- ✔ Create ticket
- ✔ Auto classify using Gemini
- ✔ List tickets
- ✔ Filter tickets
- ✔ Update ticket (status & priority)
- ✔ Delete ticket
- ✔ View statistics
- ✔ Docker-based deployment
- ✔ Persistent PostgreSQL storage

---

# 📦 How To Run

**Backend (Docker):**

```bash
docker-compose up --build
```

**Frontend:**

```bash
cd frontend
npm run dev
```

**Backend URL:** `http://localhost:8000`

**Frontend URL:** `http://localhost:5173`

---

# 📌 Conclusion

This implementation delivers a production-ready, containerized support ticket system with AI-based classification and full RESTful lifecycle management, aligned with Clootrack assessment requirements.