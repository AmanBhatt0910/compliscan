# 🛡️ CompliScan  
### Security Audit & Compliance Analyzer for Web Applications

CompliScan is a modern web-based security scanning platform that helps organizations monitor the compliance and security posture of their web applications — simply by analyzing their URL.

The system evaluates HTTPS status, security headers, cookies, and content configuration, then generates a risk score with actionable findings.

---

## 🚀 Live Features

### ✔ Web Security Scanner
- TLS / HTTPS enforcement detection  
- Certificate validation  
- Security headers inspection (CSP, HSTS, XSS, etc.)  
- Vulnerable or missing cookie flags (Secure, HttpOnly, SameSite)  
- Mixed content checks (HTTPS violations)

### ✔ Complete App Monitoring
- Register multiple web applications
- Track historical scan results
- View detailed reports & scores

### ✔ Secure User Accounts
- JWT Authentication  
- HttpOnly cookies  
- Protected dashboard routes

### ✔ Compliance Dashboard
- Overview of security posture
- Score charts & high-risk alerts
- Recent scan notifications
- Activity timeline

### ✔ Mobile-Responsive UI
- Modern dark UI with glassmorphism & smooth transitions  
- Mobile slide-in sidebar & adaptive layouts  

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | **Next.js 16 (App Router + API Routes)** |
| UI Styling | **Tailwind CSS v4**, Framer Motion animations |
| Database | **MongoDB + Mongoose** |
| Auth | **JWT**, Secure Cookies, Middleware-based protection |
| Validation | **Zod** |
| Icons | **Lucide React** |

---

## 🧪 Architecture Overview

User → Auth → JWT Cookie → Protected Dashboard UI
↓
Apps Module → MongoDB → Scan Engine → Scan Reports → Activity Feed

---

## 📂 Folder Structure

compliscan/
├─ src/
│  ├─ app/
│  │  ├─ (auth)/login, register
│  │  ├─ (dashboard)/dashboard, apps, scans, activities
│  │  ├─ api/auth, api/apps, api/scans
│  ├─ components/layout, ui, charts, common
│  ├─ lib/db.ts, models, auth.ts, scan-engine
│  ├─ config/nav.ts, site.ts
│  ├─ middleware.ts
├─ public/compliscan-logo.png
└─ .env.local

---

## 👥 Team Contributors

| Name | Role | Responsibilities |
|------|------|----------------|
| **Aman Bhatt** | Frontend Lead | Dashboard, Layout components, responsive UI/UX |
| **Jeewan Kandpal** | Database & Models Lead | MongoDB schemas, DB integration |
| **Harshit Kashyap** | Backend API Lead | Auth, CRUD APIs, Middleware, security |
| **Sneha Manral** | Security Analysis Module Lead | Scan engine, findings & scoring |

---

## 🔐 Authentication Flow

- User login → JWT generated  
- Stored in **HttpOnly cookie** → prevents XSS token theft  
- Middleware protects `/dashboard/**` routes  
- Logout deletes cookie + session revoked  

---

## 🧩 Key Modules

### 🔍 Scan Engine (`src/lib/scan-engine/`)
- `tlsCheck.ts` → HTTPS & certificate validation  
- `headerCheck.ts` → Security header policies  
- `cookieCheck.ts` → Cookie vulnerability check  
- `contentCheck.ts` → Mixed content + fill risk  
- `scoring.ts` → Weighted risk calculation  

---

## ⚙️ Setup & Installation

### Clone repository
```bash
git clone https://github.com/AmanBhatt0910/compliscan.git
cd compliscan

Install dependencies

npm install

Configure environment

Create .env.local:

MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-super-secret-key

Start development

npm run dev

Server available at:
👉 http://localhost:3000

⸻

📌 Future Enhancements
	•	Scheduled automated compliance scans
	•	Export PDF Security Reports
	•	OWASP vulnerability scanning
	•	Authentication MFA
	•	Admin dashboard controls

⸻

🏁 Conclusion

CompliScan demonstrates essential skills in:

✔ Security audit automation
✔ Full-stack MERN & Next.js development
✔ Secure authentication methods
✔ UI/UX design for security tools
✔ Real-time monitoring & compliance reporting

Designed as part of the Security Audit & Compliance curriculum for college submission, and aligned with real-world cybersecurity practices.

⸻

⭐ If you like this project, support the repo with a star!

---