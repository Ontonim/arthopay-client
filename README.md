# Creator Support Platform — MVP

A creator support platform where creators can build public profiles, receive financial support from fans via **SSLCommerz**, and request withdrawals of their earnings. Admins oversee creators, payments, and withdrawal requests through a dedicated dashboard.

---

## 📖 Overview

This platform connects creators with their audience through a simple support mechanism (similar to "Buy Me a Coffee"). Guests can browse creator profiles and send support payments, creators can manage their public presence and finances, and super admins have full oversight of the platform's operations.

---

## 👥 Roles & Permissions

### Guest User

- View creator public profiles (by username)
- Send support payments
- Download payment receipts

### Creator

- Register and verify account via email
- Manage public profile and support settings
- View payment history
- Request withdrawals

### Super Admin

- Manage all users and creators
- Manage payments and withdrawal requests
- Full platform oversight via admin dashboard

---

## 🔑 Authentication

- **Registration** — First Name, Last Name, Username, Email, Mobile, Password, Confirm Password
- **Email OTP Verification** — required after registration
- **Login** — via Email + Password
- **Forgot Password** — password recovery flow

---

## 🎨 Creator Features

### Profile Management

- Edit profile image, cover image, name, bio, address, and social links
- Email, Mobile, and Username are **read-only** (cannot be edited post-registration)
- Field-level visibility control: **Public** / **Only Me** for each profile field

### Support Settings

- Configure custom support amounts (e.g., Coffee / Tea tiers)

### Finance

- View complete payment history
- Request withdrawals, secured with **PIN + Email OTP** verification

---

## 🛠️ Admin Features

- Dashboard with platform-wide overview and key metrics
- Manage creator accounts
- View all payments and support messages
- Approve or reject withdrawal requests
- Automated email notifications and payment receipts

---

## 📄 Pages

### Public

- Home
- Creator Profile
- Payment Success / Failed / Cancel

### Authentication

- Register
- Verify Email
- Login
- Forgot Password

### Creator Dashboard

- Dashboard
- Profile
- Support Settings
- Payment History
- Withdraw
- Withdraw History

### Admin Dashboard

- Dashboard
- Creators
- Users
- Payments
- Withdraw Requests
- Reports

---

## 🔒 Security

| Mechanism                    | Purpose                                                   |
| ---------------------------- | --------------------------------------------------------- |
| **JWT**                      | Session authentication and authorization tokens           |
| **bcrypt**                   | Secure password hashing                                   |
| **Role-Based Authorization** | Restrict access by user role (Guest / Creator / Admin)    |
| **Email OTP**                | Verify identity during registration and sensitive actions |
| **Withdraw PIN**             | Additional layer of protection for withdrawal requests    |
| **SSLCommerz Validation**    | Secure verification of payment gateway transactions       |

---

## 💳 Payment Flow

1. Guest selects a support amount (e.g., Coffee / Tea) on a creator's profile
2. Payment is processed through **SSLCommerz**
3. Redirect to Success / Failed / Cancel page based on transaction outcome
4. Receipt generated and made available for download
5. Transaction recorded in the creator's payment history

---

## 💸 Withdrawal Flow

1. Creator initiates a withdrawal request from the Withdraw page
2. Request is verified using **PIN + Email OTP**
3. Request appears in Admin's Withdraw Requests queue
4. Admin approves or rejects the request
5. Creator is notified via email; status reflected in Withdraw History

---

## 📌 Project Status

This document describes the **MVP (Minimum Viable Product)** scope. Features and requirements are subject to change as the platform evolves.

---

## 📝 License

_To be determined._
