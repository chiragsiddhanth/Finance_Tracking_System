# Personal Finance Tracker

A modern, simple, and fully functional Personal Finance Tracker application built strictly for local use without any external cloud dependencies, user registrations, or logins.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Recharts, Axios, Lucide Icons
- **Backend**: Java 21, Spring Boot 3, Spring Data JPA, Hibernate, Maven, Flyway
- **Database**: PostgreSQL 16 (with persistent Docker volume)
- **Infrastructure**: Docker, Docker Compose, Nginx reverse proxy

---

## 🚀 Quick Start Instructions

Everything runs inside isolated Docker containers. No local installation of Java, Maven, Node.js, or PostgreSQL is required.

### 1. Start the Application

In the root project directory, run:

```bash
docker compose up --build
```

Docker will:
1. Initialize the PostgreSQL 16 database container with persistent storage.
2. Build and launch the Spring Boot Java 21 backend application and run Flyway database migrations.
3. Build and launch the React TypeScript frontend container served via Nginx.

### 2. Access the Application

Open your browser and navigate to:

👉 **[http://localhost:5173](http://localhost:5173)**

---

## 🛑 How to Stop the Application

To stop all running containers safely without losing your database information:

```bash
docker compose down
```

> **Data Persistence**: The PostgreSQL data volume (`postgres_data`) persists all recorded income, expense, and category records across container restarts and rebuilds.

---

## 🔄 How to Rebuild After Modifications

To rebuild all images from scratch:

```bash
docker compose up --build --force-recreate
```

---

## 📊 Application Features

### 1. Dashboard
- **Key Metrics**: Total Income, Total Expenses, Net Savings, Savings Percentage, and Average Daily Expenditure.
- **Interactive Visualizations**:
  - Daily Savings Trend (Area chart with cumulative tracking).
  - Income vs Expenses (Monthly comparative bar chart).
  - Expense Category Breakdown (Interactive donut chart).
  - Daily Expenditure Pattern (Spending bars by date).
- **Date Filters**: Last 7 Days, Last 30 Days, This Month, Last Month, and Custom Date Range.

### 2. Expense Management
- Complete CRUD operations (Add, Edit, Delete, View).
- Attributes: Title, Amount, Category, Payment Method, Date, and Description.
- Real-time search by keyword and filtering by category, payment method, and date range.
- Deletion confirmation dialogs.

### 3. Income Management
- Complete CRUD operations for income streams (Salary, Freelancing, Business, etc.).
- Attributes: Title, Amount, Category, Date, and Description.
- Search and filtering capabilities.

### 4. Unified Transaction History
- Single unified table combining both income and expense streams.
- Clearly distinguished visual badges (+ / - indicators and color schemes).
- Sorting by Date, Title, or Amount (ascending and descending).
- Filter by transaction type (`All`, `Income Only`, `Expenses Only`), category, and date.

### 5. Category Management
- Pre-populated default categories for both expenses (Food, Rent, Groceries, Shopping, Transportation, Entertainment, Utilities, Healthcare, Travel, Other) and income (Salary, Freelancing, Business, Investments, Other).
- Color-coded category creation and editing.
- Automatic Flyway migrations ensure seed data is loaded on the first run.

