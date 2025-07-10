# 📁 File Uploader

A stripped down file storage API inspired by Google Drive. Built with **Node.js**, **Express**, and **Prisma**. Users can register, log in, create folders, and upload files securely.

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (via Prisma ORM)
- **Authentication:** JWT (stored in HTTP-only cookies)
- **Validation:** express-validator
- **File Uploads:** multer (memory storage only)
- **Security:** bcrypt (password hashing), cookie based auth
- **Error Handling:** Custom error class + middleware

---

## 🚀 Features

- ✅ Register & login with email/password
- ✅ JWT stored securely in HTTP only cookies
- ✅ Input validation (email & password) via middleware
- ✅ Create, read, update, delete (CRUD) folders
- ✅ Upload files to folders
- ✅ Block disallowed file types (e.g., .zip, .pdf)

---

## 🔐 Authentication

- Users are authenticated using **JWTs** stored in **HTTP-only cookies**.
- Tokens are issued on login and automatically sent with requests.

---
