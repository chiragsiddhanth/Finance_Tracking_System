Personal Finance Tracker — Project Development Prompt
1. Project Objective

Build a simple, modern, fully functional Personal Finance Tracker for personal use.

The application should allow me to track my income, expenses, savings, and visualize my financial activities through an interactive dashboard.

This is strictly a local application. No login, registration, authentication, or cloud services are required.

2. Technology Stack
Backend
Java 21
Spring Boot 3
Spring Data JPA
Hibernate
Maven
REST APIs
Frontend
React
TypeScript
Vite
Tailwind CSS
Recharts for graphs
Axios for API communication
Database
PostgreSQL
Persistent Docker volume
Infrastructure
Docker
Docker Compose
Nginx

All technologies must run inside Docker containers. I do not want to install Java, Maven, Node.js, npm, or PostgreSQL locally.

3. Docker Requirements

Create a complete Docker Compose configuration containing three services:

Frontend — React served through Nginx.
Backend — Java Spring Boot application.
Database — PostgreSQL.

Use multi-stage Docker builds for the frontend and backend.

Configure:

Database environment variables.
Internal Docker networking.
PostgreSQL health checks.
Backend health checks.
Persistent PostgreSQL volume.
Nginx reverse proxy for backend API requests.

The entire application must start using just:

bash
docker compose up --build


The application must be accessible at:

http://localhost

Running docker compose down must not delete database information.

4. Core Application Features

Implement only the following features.

A. Dashboard

Create a modern dashboard displaying:

Total income.
Total expenses.
Net savings.
Savings percentage.
Average daily expenditure.

Include the following interactive graphs:

Daily savings trend — shows whether savings are increasing or decreasing.
Income vs expenses — monthly comparison.
Expense category breakdown — pie/donut chart.
Monthly savings trend — shows savings over time.
Daily expenditure — shows spending patterns.

Provide date filters:

Last 7 days.
Last 30 days.
This month.
Last month.
Custom date range.

All dashboard values and charts must use actual database data, not hardcoded values.

B. Expense Management

Implement complete CRUD functionality.

Allow me to:

Add expenses.
Edit expenses.
Delete expenses.
View all expenses.
Search expenses.
Filter expenses by date and category.

Each expense should contain:

Title.
Amount.
Category.
Payment method.
Date.
Description (optional).

Default categories:

Food.
Groceries.
Rent.
Shopping.
Transportation.
Entertainment.
Utilities.
Healthcare.
Travel.
Other.

Payment methods:

UPI.
Cash.
Debit Card.
Credit Card.
Bank Transfer.
C. Income Management

Implement complete CRUD functionality.

Allow me to:

Add income.
Edit income.
Delete income.
View income history.
Filter income by date and category.

Each income record should contain:

Title.
Amount.
Income category.
Date.
Description.

Default income categories:

Salary.
Freelancing.
Business.
Investments.
Other.
D. Transaction History

Create one unified transaction page displaying both income and expenses.

Include:

Transaction date.
Title.
Category.
Transaction type.
Amount.

Provide search, filtering, and sorting.

Clearly distinguish income and expenses visually.

E. Category Management

Allow adding and managing custom income and expense categories.

Provide default categories on first startup.

5. Financial Calculations

All calculations must be implemented in the Java backend.

Use BigDecimal for monetary calculations. Never use double or float for currency.

Use the following formulas:

Net Savings

Income - Expenses

Savings Percentage

(Net Savings / Total Income) × 100

Daily Savings

Daily Income - Daily Expenses

Cumulative Savings

Previous Cumulative Savings + Current Day Income - Current Day Expenses

Average Daily Spending

Total Expenses / Number of Days in Selected Period

Handle zero income and empty date ranges safely.

Use INR (₹) as the default currency.

6. Frontend Design

Create a clean, premium-looking finance dashboard.

Use a modern dark theme by default, with an optional light theme.

The interface should include:

Sidebar navigation.
Dashboard.
Expenses.
Income.
Transactions.
Categories.

Design requirements:

Modern cards.
Interactive charts.
Clean typography.
Responsive layout.
Consistent icons.
Attractive transaction tables.
Smooth transitions.
Proper loading and error states.
Confirmation dialogs for deleting transactions.

Avoid overcrowding the dashboard.

The dashboard should be the first screen displayed when the application opens.

7. Backend Architecture

Use a clean layered Spring Boot architecture.

Suggested packages:

text
com.finance.tracker
├── controller
├── service
├── repository
├── entity
├── dto
├── exception
└── config


Implement REST APIs for:

Dashboard analytics.
Income CRUD.
Expense CRUD.
Transaction history.
Category management.

Use DTOs instead of exposing JPA entities directly.

Implement validation and global exception handling.

Use PostgreSQL for all financial data.

Use Flyway for database schema initialization and migrations.

8. Database

Create the following core tables:

income
expenses
categories
payment_methods

Use proper primary keys, foreign keys, constraints, and indexes.

Initialize default categories and payment methods automatically.

Do not insert fake income or expense transactions.

9. Integration Requirements

This is extremely important.

The React frontend and Spring Boot backend must be completely integrated.

Every form must connect to a real API.
Every transaction must be saved in PostgreSQL.
Dashboard graphs must fetch actual backend analytics.
Adding, editing, or deleting transactions must refresh the dashboard.
All filters must work.
Handle API errors properly.

Do not create static UI mockups or disconnected components.

10. Final Deliverables

Create a complete project containing:

text
finance-tracker/
├── docker-compose.yml
├── .env.example
├── README.md
│
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
│
└── backend/
    ├── Dockerfile
    ├── pom.xml
    └── src/


Provide proper documentation explaining how to start, stop, rebuild, and access the application.

11. Final Acceptance Criteria

The application is complete only when:

Docker builds all three services successfully.
PostgreSQL starts successfully.
Database migrations execute successfully.
Frontend opens at http://localhost.
No login screen is displayed.
Income CRUD works.
Expense CRUD works.
Transaction history works.
Categories work.
Dashboard displays real financial data.
All charts work correctly.
Financial calculations are accurate.
Database data persists after container recreation.
No local Java, Maven, Node.js, or PostgreSQL installation is required.
FINAL INSTRUCTION

Do not overengineer this application.

Do not add unnecessary features such as authentication, AI integration, loan management, net worth tracking, receipt uploads, recurring transactions, or complex financial planning.

Focus exclusively on building a clean, simple, reliable, fully integrated personal finance tracker.

Implement the complete application, build the Docker containers, test the frontend-backend integration, fix errors, and provide a working project.

The only command required to start everything should be:

bash
docker compose up --build


The application should then be available at:

http://localhost