# 🚀 CP Progress Tracker

📈 Track your competitive programming journey across platforms — visualize, analyze, and grow!

## 🧩 Features

✅ **Cross-platform Tracking**
- Automatically fetch and display your submissions and ratings from **Codeforces, LeetCode, CodeChef, and GeeksforGeeks**

🔄 **One-click Sync**
- Refresh stats from all 4 platforms simultaneously with a single click — no manual updates needed

📊 **Insightful Visualizations**
- Charts showing problem-solving distribution, rating changes, and submission patterns using Chart.js

🎯 **Progress Monitoring**
- Track your growth over time by difficulty level and number of problems solved per platform

📜 **Recent Submissions**
- Stay updated with your latest submissions across all platforms in one clean dashboard

🔐 **Secure Authentication**
- JWT-based auth with Zod input validation and bcrypt password hashing

## ⚙️ Tech Stack

| Technology     | Purpose                              |
| -------------- | ------------------------------------- |
| **React**      | Frontend UI library                   |
| **Tailwind CSS** | Utility-first styling               |
| **Recoil**     | Frontend state management             |
| **Chart.js**   | Data visualization                    |
| **Node.js**    | Backend runtime                       |
| **Express.js** | Web framework (API + routing)         |
| **PostgreSQL** | Relational database                   |
| **Prisma**     | Type-safe ORM for PostgreSQL          |
| **JWT**        | Authentication tokens                 |
| **Zod**        | Schema validation                     |
| **bcrypt**     | Password hashing                      |
| **Axios**      | HTTP client for API calls             |

## 📸 Snapshots

![Dashboard](screenshots/dashboard.png)
![Sync Feature](screenshots/sync.png)
![Submissions](screenshots/submissions.png)

## 🌐 Platforms Supported

| Platform      | Status      |
| ------------- | ----------- |
| Codeforces    | ✅ Supported |
| LeetCode      | ✅ Supported |
| CodeChef      | ✅ Supported |
| GeeksforGeeks | ✅ Supported |

## 🗂️ Project Structure

```
cp-tracker/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma       # Database models
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js         # Signup/Login (JWT + Zod + bcrypt)
│   │   │   ├── profile.js      # User profile & handles
│   │   │   ├── sync.js         # Multi-platform sync logic
│   │   │   └── submissions.js  # Submission queries
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   ├── lib/
│   │   │   └── prisma.js
│   │   └── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── atoms/               # Recoil state (user, profile, submissions)
│   │   ├── components/          # Navbar, StatCard, SyncButton, etc.
│   │   ├── pages/                # Login, Signup, Dashboard
│   │   ├── hooks/
│   │   │   └── useSync.js
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## 🛠️ Setup Instructions

### 1. Clone and install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment variables

In `backend/.env` (copy from `.env.example`):

```env
DATABASE_URL="postgresql://username:password@localhost:5432/cp_tracker"
JWT_SECRET="your_super_secret_jwt_key_here"
PORT=3000
```

### 3. Setup the database

```bash
cd backend
npx prisma db push
npx prisma generate
```

### 4. Run the app

```bash
# Terminal 1 - backend
cd backend
npm run dev

# Terminal 2 - frontend
cd frontend
npm run dev
```

Visit `http://localhost:5173` 🎉

## 🔌 API Endpoints

| Method | Route                  | Description                          |
| ------ | ----------------------- | ------------------------------------ |
| POST   | `/api/auth/signup`      | Create new account                   |
| POST   | `/api/auth/login`       | Login and get JWT token              |
| GET    | `/api/profile/me`       | Get logged-in user's profile         |
| PUT    | `/api/profile/handles`  | Update platform handles              |
| POST   | `/api/sync/all`         | Sync stats from all 4 platforms      |
| GET    | `/api/submissions`      | Get paginated submissions            |
| GET    | `/api/submissions/stats`| Get aggregated stats for dashboard   |

## 🎯 Roadmap

- [x] Fetch Codeforces submissions
- [x] Integrate LeetCode API
- [x] Add support for CodeChef
- [x] Add support for GeeksforGeeks
- [x] JWT-based user authentication
- [x] One-click sync across all platforms
- [ ] Weekly coding streak analysis
- [ ] Problem tagging and topic breakdown
- [ ] Email reminders for daily practice

## 🤝 Contributing

Contributions are welcome! If you have ideas to improve the platform or want to add new features, feel free to open a Pull Request or Issue.

## 👩‍💻 Author

Made with 💻 & ❤️ by **Rachna Patel**
