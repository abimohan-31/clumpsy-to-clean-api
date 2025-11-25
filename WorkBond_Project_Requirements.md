# WorkBond Project Requirements

**Author:** Abisha Mohanathas  
**Date:** 2025-10-20  
**Project ID:** UKI/V/CO3/03

---

## 1. Core Problem & Motivation

### Problem Statement
Many people struggle to find help for basic daily needs like plumbing, cleaning, or painting. Our goal is to create a platform that connects them with trusted service providers in their area, including homes and small businesses.

### Importance
The problem is critical now because rural areas still face difficulties finding reliable workers. A digital solution will save time, reduce inconvenience, and create stable income opportunities for workers.

### Success Metrics
- Users can find service providers quickly and efficiently.  
- Positive user feedback on ease-of-use and reliability.  
- Increased job completion and faster service access compared to traditional methods.

---

## 2. Proposed Solution

A digital platform connecting customers with local service providers. Users can search, book, and rate services. Providers can manage their profiles and receive job opportunities.

**Unique Value Proposition:**  
Simple, accessible, rural-focused platform that provides visibility and income to local service providers while saving time for customers.

---

## 3. MVP Scope

- User registration/login (Customer + Provider)  
- Service listing (plumbing, cleaning, painting, etc.)  
- Provider profile management  
- Job posts (created by customers)  
- Reviews for providers  
- Price-list (services with unit pricing)

**User Capabilities:**  
- Search and view services, categories, price-lists, and reviews.  

**Provider Capabilities:**  
- Register, manage profiles, apply for jobs, and login.

---

## 4. Main Functional Areas

| Module | Purpose |
|--------|---------|
| User Authentication | Secure login/register for customers & providers |
| Service Listing & Search | Browse, filter, and search for services |
| Price List Listing & Search | Browse, filter, and search for price lists |
| Notifications & Alerts | Confirmations, reminders, status updates |
| Reviews & Ratings | Customers rate and review providers |

---

## 5. User-Specific Functionalities

### Customer

| Feature | Description | Priority |
|---------|-------------|---------|
| Register/Login | Create account, manage profile | High |
| View and Search | Browse services and providers | High |
| Create Job | Post job requests | High |
| Approve Providers | Approve providers who apply | High |
| Provide Feedback | Rate/review providers | Medium |

### Provider

| Feature | Description | Priority |
|---------|-------------|---------|
| Register/Login | Create account, manage profile | High |
| Manage Profile | Update skills, contact info | High |
| Apply for Jobs | Respond to customer job posts | High |
| View Applications | Track job applications | Medium |
| Respond to Feedback | View and respond to reviews | Medium |

---

## 6. Entities & Database Design

**Entities:**
- `user` (base collection for authentication, linked to all roles)  
- `provider`  
- `customer`  
- `service`  
- `subscription`  
- `reviews`  
- `price-list`  
- `job-post`

**Relationships:**
- Users ↔ Providers / Customers  
- Customers ↔ Job-posts  
- Providers ↔ Job-posts / Reviews / Price-list  
- Services ↔ Price-list / Providers  

---

## 7. Technical Requirements

**Backend:** Express.js  
**Database:** MongoDB (Mongoose ORM)  
**Authentication:** JWT (Role-based: Customer, Provider, Admin)  
**Frontend:** React.js (optional if needed)  
**Deployment:** Vercel / Node hosting  

---

## 8. Non-Functional Requirements

- **Performance:** API responses < 500ms, 500 concurrent users  
- **Security:** HTTPS, password hashing, data privacy compliance  
- **Availability:** 99% uptime, automatic recovery  
- **Scalability:** Horizontal scaling for users, services, bookings  
- **Usability:** Simple interface for low-tech users  
- **Maintainability:** Clean code with documentation  
- **Compatibility:** Modern browsers and mobile devices  

---

## 9. Project File Structure (Express.js)

```
src/
├─ server.js
├─ routes/
│  ├─ auth.js
│  ├─ user.js
│  ├─ provider.js
│  ├─ customer.js
│  ├─ service.js
│  ├─ subscription.js
│  ├─ reviews.js
│  ├─ price-list.js
│  └─ job-post.js
├─ models/
│  ├─ user.js
│  ├─ provider.js
│  ├─ customer.js
│  ├─ service.js
│  ├─ subscription.js
│  ├─ reviews.js
│  ├─ price-list.js
│  └─ job-post.js
└─ middleware/
   ├─ auth.js
   └─ role.js
```
