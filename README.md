# HiMath - Ứng dụng Học Toán cho Trẻ Em

Ứng dụng web học toán tương tác dành cho trẻ em, với các game và bài tập thú vị.

## 🚀 Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: MySQL/TiDB
- **Authentication**: JWT
- **Deployment**: Render.com

## 📁 Cấu trúc Project

```
himath-version3/
├── backEnd/          # Backend API
│   ├── src/
│   │   ├── config/   # Database config
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── server.js
│   └── package.json
├── frontEnd/         # Frontend Application
│   ├── assets/       # CSS, fonts, sounds
│   ├── panels/       # Game panels
│   └── index.html
├── database/         # Database schema
│   └── ktpmud.sql
└── .gitignore
```

## 🛠️ Setup Local Development

Xem file `QUICK_START.md` để biết cách chạy local.

## 📦 Deploy lên Production

Xem file `DEPLOY_RENDER.md` để biết cách deploy lên Render với TiDB.

## 🔐 Environment Variables

### Backend (.env)
```
NODE_ENV=production
PORT=3000
DB_HOST=your-tidb-host.tidbcloud.com
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=your-database-name
JWT_SECRET=your-super-secret-key
FRONTEND_URL=https://your-frontend-url.onrender.com
```

## 📝 License

ISC

## 👤 Author

Huy

