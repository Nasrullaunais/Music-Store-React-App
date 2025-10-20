# Music Store Application - University Viva Presentation Guide

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [System Architecture](#3-system-architecture)
4. [Key Features & Demonstrations](#4-key-features--demonstrations)
5. [Database Design](#5-database-design)
6. [Security Implementation](#6-security-implementation)
7. [API Architecture](#7-api-architecture)
8. [User Roles & Permissions](#8-user-roles--permissions)
9. [Advanced Features](#9-advanced-features)
10. [Demo Flow Sequence](#10-demo-flow-sequence)
11. [Challenges & Solutions](#11-challenges--solutions)
12. [Future Enhancements](#12-future-enhancements)
13. [Technical Questions Preparation](#13-technical-questions-preparation)

---

## 1. Project Overview

### What to Say:
*"I've developed a comprehensive full-stack Music Store E-commerce application that allows customers to browse, purchase, and manage digital music. The system supports multiple user roles including Customers, Artists, Staff, and Administrators, each with specific functionalities."*

### Key Points:
- **Type**: Full-stack E-commerce Web Application
- **Domain**: Digital Music Marketplace
- **Purpose**: Connect music artists with customers while providing comprehensive administrative controls
- **Scale**: Multi-user, role-based access control system with real-time features

### Business Value:
- Artists can upload and sell their music
- Customers can discover, purchase, and manage music libraries
- Admins have complete oversight with analytics and moderation tools
- Staff can handle customer support efficiently

---

## 2. Technology Stack

### Frontend Technologies
```
✓ React 18.3.1 - Modern UI library
✓ TypeScript - Type-safe development
✓ Vite 6.0.11 - Fast build tool
✓ HeroUI 2.8.4 - Component library
✓ Tailwind CSS 4.1.11 - Utility-first styling
✓ React Router DOM 6.23 - Client-side routing
✓ Axios 1.12.2 - HTTP client
✓ Framer Motion 11.18.2 - Animations
✓ React Icons 5.5.0 - Icon library
✓ React Toastify 11.0.5 - Notifications
```

### Backend Technologies (Inferred from API documentation)
```
✓ Java Spring Boot - Backend framework
✓ Spring Security - Authentication & Authorization
✓ JWT - Token-based authentication
✓ JPA/Hibernate - ORM
✓ MySQL/PostgreSQL - Database
✓ RESTful API Architecture
```

### Development Tools
```
✓ ESLint - Code quality
✓ Prettier - Code formatting
✓ TypeScript - Type checking
✓ Git - Version control
```

### What to Say:
*"I chose React with TypeScript for type safety and better developer experience. HeroUI provides modern, accessible components. The backend uses Spring Boot with JWT authentication for secure, scalable API development."*

---

## 3. System Architecture

### Architecture Diagram (Explain verbally or draw):
```
┌─────────────────────────────────────────────────┐
│           Frontend (React + TypeScript)          │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐ │
│  │  Pages   │  │Components│  │  Context/State│ │
│  └──────────┘  └──────────┘  └───────────────┘ │
│  ┌──────────────────────────────────────────┐  │
│  │      API Layer (Axios + Services)        │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────┘
                      │ HTTP/REST
                      │ JWT Authentication
┌─────────────────────▼───────────────────────────┐
│         Backend (Spring Boot + Java)             │
│  ┌──────────────┐  ┌──────────────────────────┐ │
│  │ Controllers  │  │   Security Filter        │ │
│  └──────────────┘  └──────────────────────────┘ │
│  ┌──────────────┐  ┌──────────────────────────┐ │
│  │   Services   │  │    Business Logic        │ │
│  └──────────────┘  └──────────────────────────┘ │
│  ┌──────────────┐  ┌──────────────────────────┐ │
│  │ Repositories │  │   JPA/Hibernate          │ │
│  └──────────────┘  └──────────────────────────┘ │
└─────────────────────┬───────────────────────────┘
                      │ JDBC
┌─────────────────────▼───────────────────────────┐
│              Database (MySQL)                    │
│  Users | Music | Orders | Reviews | Tickets     │
└─────────────────────────────────────────────────┘
```

### Key Architectural Patterns:
1. **MVC Pattern** - Separation of concerns
2. **Repository Pattern** - Data access abstraction
3. **Service Layer** - Business logic encapsulation
4. **Context API** - State management (Frontend)
5. **Role-Based Access Control (RBAC)** - Security

---

## 4. Key Features & Demonstrations

### 4.1 Customer Features ⭐

#### Music Browsing & Discovery
- **Search Functionality**: Real-time search by song name, artist, or genre
- **Music Catalog**: Paginated display with cover images, prices, ratings
- **Preview System**: Audio preview before purchase
- **Detailed View**: Song details, artist info, reviews, ratings

#### Shopping & Purchasing
- **Shopping Cart**: Add/remove items, view total
- **Cart Overlay**: Quick access without page navigation
- **Checkout Process**: Order placement with payment simulation
- **Order History**: View past purchases with order details

#### Music Library
- **My Music Page**: Access purchased music
- **Audio Player**: Built-in player with controls, progress bar, loop functionality
- **Playlists**: Create and manage custom playlists

#### Reviews & Ratings
- **Write Reviews**: Rate and review purchased music
- **Edit Reviews**: Update existing reviews
- **Delete Reviews**: Remove own reviews
- **View Reviews**: See community feedback with ratings

#### Support System
- **Create Tickets**: Submit support requests with subject/description
- **Chat Interface**: Real-time messaging with staff
- **Track Status**: Monitor ticket progress (OPEN, IN_PROGRESS, URGENT, CLOSED)
- **Message History**: View complete conversation

#### Refund System
- **Check Eligibility**: Verify if orders qualify for refunds
- **Submit Requests**: Request refunds with reasons
- **Track Status**: Monitor refund approval status

---

### 4.2 Artist Features 🎵

#### Music Management
- **Upload Music**: Add new tracks with metadata (title, genre, price, cover image, audio file)
- **Edit Tracks**: Update song information and pricing
- **Delete Music**: Remove tracks from catalog
- **View Analytics**: Track performance of each song

#### Analytics Dashboard
- **Revenue Tracking**: Total earnings, sales trends
- **Performance Metrics**: 
  - Total tracks uploaded
  - Total sales count
  - Average rating across all music
  - Total reviews received
- **Sales Analytics**: Daily/monthly revenue breakdown
- **Top Tracks**: Best-performing songs

#### Profile Management
- **Artist Profile**: Display name, bio, cover image
- **Portfolio**: Showcase of all uploaded music
- **Statistics**: Follower count, total plays

#### Review Management
- **View Reviews**: See all customer feedback
- **Response System**: Engage with reviewers
- **Rating Distribution**: Visual breakdown of ratings

---

### 4.3 Staff Features 👥

#### Ticket Management Dashboard
- **All Tickets View**: Complete ticket overview
- **Urgent Tickets**: High-priority issues
- **Unassigned Tickets**: New tickets needing assignment
- **Needs Attention**: Active conversations requiring response

#### Ticket Operations
- **Assign Tickets**: Take ownership of customer issues
- **Reply System**: Chat-based messaging with customers
- **Status Updates**: Change ticket status (OPEN → IN_PROGRESS → CLOSED)
- **Search Functionality**: Find tickets by customer name or ID

#### Statistics Dashboard
- **Total Tickets**: Overall ticket count
- **Urgent Count**: High-priority tickets
- **Unassigned Count**: Tickets awaiting assignment
- **Closed Count**: Resolved issues

---

### 4.4 Admin Features 🔐 (Most Comprehensive)

#### 1. **User Management**
- Create users with any role (Customer, Artist, Staff, Admin)
- View all users with pagination and role filtering
- Update user information (email, names, passwords)
- Enable/Disable user accounts
- Delete users
- View user statistics by role

#### 2. **Content Moderation**
- **Flagged Music Review**: Customers can flag inappropriate content
- **Admin Review**: View all flagged music with details
- **Actions**: 
  - Delete flagged content
  - Unflag (clear flags)
  - View flag reasons and reporter information
- **Pagination**: Handle large volumes of flagged content

#### 3. **Review Management**
- View all reviews across the platform
- Filter by music track or user
- Delete inappropriate reviews
- **Auto-Recalculation**: Music ratings automatically update when reviews are deleted
- Monitor review quality and authenticity

#### 4. **Order Management**
- View all orders with pagination
- Filter by status (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- View order details (items, customer, total, date)
- Update order status
- Track revenue and sales metrics

#### 5. **Refund Management**
- View all refund requests
- Filter by status (PENDING, APPROVED, REJECTED)
- Approve or reject refunds with admin notes
- Process refunds with reason tracking
- Monitor refund analytics

#### 6. **Ban Management System**
- **Temporary Bans**: Ban users for specified hours
- **Ban Customers**: Restrict customer access
- **Ban Artists**: Prevent artist uploads
- **Ban Info**: Track ban reason, duration, admin who banned
- **Unban**: Manually lift bans
- **Email Notifications**: Automatic emails to banned users
- **Auto-Expiry**: Bans automatically expire after duration

#### 7. **Ticket Management (Admin View)**
- View all support tickets system-wide
- Assign tickets to staff members
- Reply as "Administration" (username hidden for privacy)
- Update ticket status and priority
- Close resolved tickets
- **Chat Overlay**: Full conversation view with message history

#### 8. **Analytics Dashboard**
- **System Overview**:
  - Total users by role
  - Total music tracks
  - Total orders and revenue
  - Active tickets count
  - Flagged content count
- **Revenue Analytics**:
  - Today's revenue
  - Monthly revenue trends
  - Average order value
  - Revenue by genre/artist
- **User Analytics**:
  - User growth over time
  - Active users statistics
  - Registration trends
- **Music Analytics**:
  - Top-selling tracks
  - Most reviewed music
  - Genre distribution
  - Artist performance

#### 9. **Sales Report Management**
- **Monthly Reports**: Generate comprehensive sales reports
- **PDF Download**: Download formatted PDF reports
- **JSON Data**: Retrieve data for custom analysis
- **Metrics Included**:
  - Total sales and orders
  - Top 10 best-selling products
  - Daily sales breakdown
  - Customer statistics
  - Average order value

#### 10. **Audit Log Viewer** ⭐
- **Complete Activity Tracking**: All admin actions logged
- **Detailed Information**:
  - Timestamp (when action occurred)
  - Admin username (who performed action)
  - Action type (what was done)
  - Resource type and ID (what was affected)
  - Success/Failure status
  - Error messages (if failed)
  - IP address and User Agent
  - Session ID
  - Severity level (LOW, MEDIUM, HIGH, CRITICAL)
- **Filtering**: Filter logs by admin username
- **Pagination**: Handle large log volumes
- **Security & Compliance**: Maintain accountability and track system changes

#### 11. **System Management**
- **Server Control**: Graceful shutdown with delay
- **System Status**: Monitor server health
- **Backup Management**: Initiate system backups
- **Configuration**: System settings
- **Performance Metrics**: Memory usage, uptime, active users

---

## 5. Database Design

### Core Entities:

#### Users Table
```
- id (PK)
- username (UNIQUE)
- password (HASHED)
- email
- role (CUSTOMER, ARTIST, STAFF, ADMIN)
- firstName, lastName
- artistName (for artists)
- cover (profile image)
- enabled (account status)
- isBanned, banReason, bannedAt, bannedUntil, bannedBy
```

#### Music Table
```
- id (PK)
- name/title
- artist
- album, genre
- imageUrl/coverImage
- audioFilePath
- price
- description
- releaseYear, duration
- totalSales
- averageRating (calculated)
- totalReviews (calculated)
- isFlagged, flagReason
```

#### Orders Table
```
- id (PK)
- customerId (FK)
- totalAmount
- orderDate
- status
- paymentMethod
```

#### OrderItems Table
```
- id (PK)
- orderId (FK)
- musicId (FK)
- unitPrice
- subtotal
```

#### Reviews Table
```
- id (PK)
- musicId (FK)
- customerId (FK)
- rating (1-5)
- comment
- createdAt, updatedAt
```

#### Tickets Table
```
- id (PK)
- customerId (FK)
- staffId (FK, nullable)
- subject
- description
- status (OPEN, IN_PROGRESS, URGENT, CLOSED)
- priority
- createdAt, lastUpdated, closedAt
```

#### TicketMessages Table
```
- id (PK)
- ticketId (FK)
- content
- timestamp
- isFromStaff
- customerId/staffId (FK)
```

#### Cart & CartItems Tables
```
Cart: id, customerId, total
CartItems: id, cartId, musicId, unitPrice, totalPrice
```

#### RefundRequests Table
```
- id (PK)
- orderId (FK)
- customerId (FK)
- refundAmount
- reason
- status (PENDING, APPROVED, REJECTED)
- requestDate, processedDate
- processedBy, adminNotes
```

#### AuditLogs Table
```
- id (PK)
- adminUsername
- action
- resourceType, resourceId
- details
- success, errorMessage
- ipAddress, userAgent, sessionId
- severity
- timestamp
```

### Relationships:
- User (1) → (N) Orders
- User (1) → (N) Music (for artists)
- User (1) → (N) Reviews
- Music (1) → (N) Reviews
- Order (1) → (N) OrderItems
- Music (1) → (N) OrderItems
- Ticket (1) → (N) TicketMessages

---

## 6. Security Implementation

### Authentication
- **JWT (JSON Web Tokens)**: Stateless authentication
- **Password Hashing**: BCrypt encryption
- **Token Storage**: LocalStorage (Frontend)
- **Token Validation**: Every API request

### Authorization
- **Role-Based Access Control (RBAC)**
- **Route Protection**: ProtectedRoute component
- **API Endpoint Security**: @PreAuthorize annotations
- **Role Hierarchy**: Customer < Artist/Staff < Admin

### Security Features:
1. **Protected Routes**: Frontend route guards
2. **API Authorization Headers**: Bearer token in all requests
3. **Session Management**: Auto-logout on token expiry
4. **Role-based Redirects**: Users land on appropriate dashboards
5. **Audit Logging**: All admin actions tracked
6. **Ban System**: Temporary access restriction

### What to Demonstrate:
- Login process and token generation
- Protected route redirection
- Role-based feature access
- Auto-logout functionality

---

## 7. API Architecture

### API Organization:

#### Public Endpoints
```
POST /api/auth/login - User authentication
POST /api/auth/register - User registration
```

#### Customer Endpoints
```
GET  /api/music - Browse music catalog
GET  /api/music/{id} - Get music details
POST /api/cart/add - Add to cart
GET  /api/cart - View cart
POST /api/orders/checkout - Place order
GET  /api/orders - View order history
POST /api/reviews - Create review
POST /api/customer/support/ticket - Create ticket
```

#### Artist Endpoints
```
POST /api/artist/music - Upload music
PUT  /api/artist/music/{id} - Update music
DELETE /api/artist/music/{id} - Delete music
GET  /api/artist/analytics - View analytics
GET  /api/artist/reviews - View reviews
```

#### Staff Endpoints
```
GET  /api/staff/tickets - View all tickets
POST /api/staff/tickets/{id}/assign - Assign ticket
POST /api/staff/tickets/{id}/reply - Reply to ticket
PUT  /api/staff/tickets/{id}/status - Update status
```

#### Admin Endpoints (Extensive)
```
User Management:
POST /api/admin/users/create - Create user
GET  /api/admin/users - Get all users
PUT  /api/admin/users/{id} - Update user
DELETE /api/admin/users/{id} - Delete user

Content Moderation:
GET  /api/admin/music/flagged - View flagged music
POST /api/admin/music/{id}/unflag - Clear flag
DELETE /api/admin/music/{id} - Delete music

Analytics:
GET  /api/admin/analytics/overview - System overview
GET  /api/admin/analytics/sales - Sales analytics

Tickets:
GET  /api/admin/tickets - All tickets
POST /api/admin/tickets/{id}/reply - Reply to ticket

Refunds:
GET  /api/admin/refunds - View refund requests
POST /api/admin/refunds/{id}/approve - Approve refund
POST /api/admin/refunds/{id}/reject - Reject refund

Bans:
POST /api/admin/customers/{id}/ban - Ban customer
DELETE /api/admin/customers/{id}/ban - Unban customer
POST /api/admin/artists/{id}/ban - Ban artist

Reports:
GET  /api/admin/reports/sales/monthly - Download PDF report

Audit Logs:
GET  /api/admin/audit-logs - View audit logs
```

### API Best Practices Implemented:
- RESTful conventions
- Consistent error responses
- Pagination for large datasets
- Filtering and search parameters
- Proper HTTP status codes
- JSON request/response format

---

## 8. User Roles & Permissions

### Role Matrix:

| Feature | Customer | Artist | Staff | Admin |
|---------|----------|--------|-------|-------|
| Browse Music | ✓ | ✓ | ✓ | ✓ |
| Purchase Music | ✓ | ✓ | ✓ | ✓ |
| Write Reviews | ✓ | ✓ | ✓ | ✓ |
| Upload Music | ✗ | ✓ | ✗ | ✓ |
| View Analytics (Own) | ✗ | ✓ | ✗ | ✗ |
| Handle Tickets | ✗ | ✗ | ✓ | ✓ |
| Manage Users | ✗ | ✗ | ✗ | ✓ |
| Moderate Content | ✗ | ✗ | ✗ | ✓ |
| Process Refunds | ✗ | ✗ | ✗ | ✓ |
| Ban Users | ✗ | ✗ | ✗ | ✓ |
| View System Analytics | ✗ | ✗ | ✗ | ✓ |
| Generate Reports | ✗ | ✗ | ✗ | ✓ |
| Audit Logs | ✗ | ✗ | ✗ | ✓ |

---

## 9. Advanced Features

### 1. Real-time Search
- Client-side filtering for instant results
- Search by name, artist, genre
- No page reload required

### 2. Profanity Filtering
- Bad-words library integration
- Automatic content moderation
- Review sanitization

### 3. Audio Preview System
- Custom audio player component
- Progress bar with seek functionality
- Play/Pause controls
- Loop playback
- Volume control

### 4. Shopping Cart Overlay
- Non-intrusive cart access
- Real-time cart updates
- Smooth animations (Framer Motion)
- Cart total calculation

### 5. Pagination System
- Reusable pagination component
- First/Previous/Next/Last navigation
- Page number display
- Efficient data loading

### 6. Toast Notifications
- Success/Error/Info messages
- Non-blocking UI feedback
- Auto-dismiss with progress bar
- Customizable duration

### 7. Responsive Design
- Mobile-first approach
- Tailwind CSS responsive utilities
- Adaptive layouts
- Touch-friendly interfaces

### 8. Automatic Rating Recalculation
- When reviews deleted, music ratings update automatically
- Real-time average calculation
- Total review count tracking

### 9. Chat-based Support System
- Real-time messaging interface
- Message history preservation
- Sender identification (customer/staff/admin)
- Timestamp formatting (relative time)
- Privacy protection (admin shows as "Administration")

### 10. Ban System with Email Notifications
- Temporary ban duration
- Automatic expiration
- Email notifications on ban/unban
- Ban reason tracking

### 11. Comprehensive Audit Logging
- Every admin action logged
- Severity classification
- IP address and session tracking
- Searchable and filterable logs

---

## 10. Demo Flow Sequence

### Recommended Presentation Order:

#### Part 1: Introduction (2-3 minutes)
1. **Project Overview**: Explain the concept
2. **Show Homepage**: Music catalog display
3. **Technology Stack**: Briefly mention tools used

#### Part 2: Customer Journey (5-7 minutes)
1. **Registration/Login**: Create account or login
2. **Browse Music**: Show search and filtering
3. **Music Details**: View song info, preview audio
4. **Add to Cart**: Demonstrate cart functionality
5. **Checkout**: Complete purchase
6. **My Music**: Show purchased music library
7. **Play Music**: Demonstrate audio player
8. **Write Review**: Add rating and comment
9. **Create Ticket**: Submit support request
10. **View Ticket Messages**: Show chat interface

#### Part 3: Artist Features (4-5 minutes)
1. **Artist Dashboard**: Show analytics overview
2. **Upload Music**: Demonstrate music upload
3. **Edit Music**: Update track details
4. **View Analytics**: Revenue, sales, ratings
5. **Review Management**: See customer feedback

#### Part 4: Staff Features (3-4 minutes)
1. **Staff Dashboard**: Show ticket overview
2. **View Tickets**: All/Urgent/Unassigned sections
3. **Assign Ticket**: Take ownership
4. **Reply to Customer**: Use chat interface
5. **Update Status**: Change ticket status
6. **Close Ticket**: Mark as resolved

#### Part 5: Admin Features (8-10 minutes) ⭐ MOST IMPORTANT
1. **Admin Dashboard**: System overview with statistics
2. **User Management**:
   - Show user list
   - Create new user
   - Update user status
3. **Content Moderation**:
   - View flagged music
   - Delete inappropriate content
4. **Review Management**:
   - View all reviews
   - Delete inappropriate reviews
   - Show auto-recalculation
5. **Order Management**:
   - View all orders
   - Filter by status
6. **Refund Management**:
   - View refund requests
   - Approve/Reject refund
7. **Ban Management**:
   - Ban a user temporarily
   - Show ban details
   - Unban user
8. **Ticket Management**:
   - View all tickets
   - Reply as "Administration"
   - Assign to staff
9. **Analytics**:
   - Show revenue charts
   - User growth metrics
   - Top-selling music
10. **Sales Reports**:
    - Generate monthly report
    - Download PDF
11. **Audit Logs**: ⭐
    - Show admin action history
    - Filter by username
    - Explain severity levels
12. **System Management**:
    - Server status
    - Backup options

#### Part 6: Technical Highlights (2-3 minutes)
1. **Security**: JWT authentication, role-based access
2. **API Design**: RESTful architecture
3. **State Management**: Context API
4. **Error Handling**: Toast notifications
5. **Code Quality**: TypeScript, ESLint, Prettier

#### Part 7: Challenges & Solutions (2-3 minutes)
- Explain key challenges faced
- Solutions implemented

---

## 11. Challenges & Solutions

### Challenge 1: Circular Reference in JSON Serialization
**Problem**: Ticket and TicketMessage entities had bidirectional relationships causing infinite loops

**Solution**: 
- Added @JsonIgnore annotations
- Used transient fields
- Created separate DTOs for API responses

### Challenge 2: Role-Based Access Control
**Problem**: Different users need different features

**Solution**:
- Implemented ProtectedRoute component
- Backend @PreAuthorize annotations
- Role-based navigation and dashboards

### Challenge 3: Real-time Cart Updates
**Problem**: Cart needed to update across multiple components

**Solution**:
- Created CartContext with React Context API
- Centralized cart state management
- Cart overlay for quick access

### Challenge 4: Audio Preview Before Purchase
**Problem**: Users want to preview music before buying

**Solution**:
- Custom audio player component
- Audio file hosting
- Controlled preview duration

### Challenge 5: Admin Privacy in Tickets
**Problem**: Admin usernames shouldn't be visible to customers

**Solution**:
- Display admin replies as "Administration"
- Backend logic to mask admin identity
- Maintain audit trail separately

### Challenge 6: Automatic Rating Updates
**Problem**: When reviews deleted, ratings need recalculation

**Solution**:
- Service layer method for recalculation
- Triggered automatically on review deletion
- Efficient database aggregation

### Challenge 7: Pagination Performance
**Problem**: Loading large datasets slows down UI

**Solution**:
- Backend pagination with Spring Data
- Frontend pagination component
- Load only necessary data

---

## 12. Future Enhancements

### Planned Features:
1. **Payment Gateway Integration** (Stripe/PayPal)
2. **Music Streaming** (not just download)
3. **Social Features** (Follow artists, share playlists)
4. **Recommendation Engine** (ML-based suggestions)
5. **Mobile App** (React Native)
6. **Advanced Analytics** (Chart visualization)
7. **Email Verification** (Account activation)
8. **Two-Factor Authentication** (Enhanced security)
9. **Live Chat** (WebSocket integration)
10. **CDN Integration** (Faster media delivery)
11. **Advanced Search** (Filters by year, price range, etc.)
12. **Wishlist Feature** (Save for later)
13. **Artist Verification Badge** (Verified artists)
14. **Collaborative Playlists** (Share with friends)
15. **Music Charts** (Trending/Top 100)

---

## 13. Technical Questions Preparation

### Expected Questions & Answers:

#### Q1: Why did you choose React over Angular or Vue?
**Answer**: "React has a large ecosystem, excellent community support, and flexibility. The component-based architecture makes code reusable. TypeScript integration provides type safety, and React's virtual DOM ensures efficient rendering."

#### Q2: How does JWT authentication work in your application?
**Answer**: "When users login, the backend validates credentials and generates a JWT token containing user info. This token is stored in localStorage and sent with every API request in the Authorization header. The backend validates the token and extracts user roles for authorization."

#### Q3: Explain your state management approach.
**Answer**: "I used React Context API for global state like authentication (AuthContext) and shopping cart (CartContext). For local state, I used useState. Context prevents prop drilling and provides centralized state management."

#### Q4: How do you handle security?
**Answer**: "Multiple layers: Frontend route protection with ProtectedRoute component checks user roles. Backend uses Spring Security with @PreAuthorize annotations. All passwords are BCrypt hashed. JWT tokens expire and are validated on every request. Audit logs track all admin actions."

#### Q5: What database relationships did you implement?
**Answer**: "One-to-Many relationships: User to Orders, User to Reviews, Music to Reviews, Order to OrderItems. Many-to-One: Reviews to Music, Orders to Customer. One-to-One for Cart to Customer."

#### Q6: How do you prevent SQL injection?
**Answer**: "I use JPA/Hibernate ORM which uses parameterized queries. All user inputs are sanitized. Never concatenate SQL strings with user input."

#### Q7: Explain the audit logging system.
**Answer**: "Every admin action is logged with details: who performed it (admin username), what action (create/update/delete), when (timestamp), what resource (type and ID), success status, IP address, and severity level. This ensures accountability and helps track security incidents."

#### Q8: How does the ban system work?
**Answer**: "Admins specify ban duration in hours and reason. The user is disabled immediately. Ban expiry time is calculated and stored. System can auto-check for expired bans. Email notifications sent on ban and unban. Manual unban is also possible."

#### Q9: How do you handle errors?
**Answer**: "Frontend: try-catch blocks with toast notifications for user feedback. Backend: Exception handlers return standardized error responses with HTTP status codes. Audit logs record failed admin actions."

#### Q10: What is the purpose of TypeScript?
**Answer**: "TypeScript adds static typing to JavaScript, catching errors at compile-time rather than runtime. It provides better IDE support, autocomplete, and refactoring. Interfaces define data structures, making code more maintainable."

#### Q11: How does pagination improve performance?
**Answer**: "Instead of loading all records at once, pagination loads small chunks (e.g., 20 records per page). This reduces memory usage, network transfer, and rendering time. Backend returns page metadata (total pages, current page) for navigation."

#### Q12: Explain the shopping cart logic.
**Answer**: "Cart uses a context provider to manage state globally. When users add items, the cart makes API calls to backend. Cart items are persisted in database linked to user. Cart total is calculated by summing all item prices. On checkout, cart is converted to an order."

#### Q13: How do you ensure code quality?
**Answer**: "ESLint for code linting, Prettier for formatting, TypeScript for type checking. Consistent naming conventions, component-based architecture, separation of concerns (pages, components, services, context)."

#### Q14: What challenges did you face with file uploads?
**Answer**: "Handling audio files and images required multipart form data. Validation of file types and sizes. Storing file paths in database while actual files are in server directories. Ensuring secure access to uploaded files."

#### Q15: How does the review system work?
**Answer**: "Customers who purchased music can rate (1-5 stars) and comment. Reviews are linked to both music and user. When reviews are added/deleted, music's average rating and total review count are automatically recalculated using database aggregation."

---

## Additional Tips for Viva Success

### Do's:
✓ Practice your demo flow multiple times
✓ Have the application running before the viva
✓ Prepare sample data (users, music, orders, tickets)
✓ Keep a cheat sheet of technical terms
✓ Explain code logic clearly
✓ Show confidence in your work
✓ Mention challenges and how you solved them
✓ Highlight unique/advanced features
✓ Be ready to show code snippets
✓ Have a backup plan if demo fails

### Don'ts:
✗ Don't rush through the demo
✗ Don't memorize scripts (speak naturally)
✗ Don't claim features you didn't implement
✗ Don't ignore questions you can't answer (say "I'll research that")
✗ Don't criticize your own work excessively
✗ Don't spend too long on basic features
✗ Don't forget to test everything before the viva

### Key Selling Points:
1. **Comprehensive Role System** - 4 distinct user types with appropriate features
2. **Advanced Admin Panel** - Complete system oversight and control
3. **Audit Logging** - Professional-grade security and compliance
4. **Ban Management** - Sophisticated user moderation
5. **Chat-based Support** - Modern customer service approach
6. **Analytics Dashboard** - Data-driven insights
7. **Refund System** - Complete e-commerce workflow
8. **Security First** - JWT, RBAC, password hashing
9. **Modern Tech Stack** - React, TypeScript, Spring Boot
10. **Professional UI** - Clean, responsive, accessible design

---

## Quick Demo Script (5-Minute Version)

**Opening** (30 seconds):
"I've built a full-stack Music Store platform where customers buy music, artists upload tracks, staff handle support, and admins oversee everything."

**Customer Demo** (1.5 minutes):
Login → Browse music → Preview audio → Add to cart → Checkout → View purchased music → Create support ticket

**Artist Demo** (1 minute):
Show dashboard → Upload music → View analytics and revenue

**Staff Demo** (45 seconds):
View tickets → Assign ticket → Reply to customer → Close ticket

**Admin Demo** (2 minutes):
Dashboard overview → Create user → View flagged content → Process refund → Ban user → Show audit logs → Generate sales report

**Closing** (15 seconds):
"The system uses React, TypeScript, Spring Boot, JWT security, and includes advanced features like audit logging, ban management, and comprehensive analytics."

---

## Remember:
- **Confidence**: You built this, you know it best
- **Clarity**: Explain concepts simply
- **Completeness**: Show the breadth of features
- **Competence**: Demonstrate technical understanding

**Good luck with your viva! 🎓**

