# 🛍️ Shop Fashion - E-commerce Project

Dự án website bán thời trang hiện đại với React.js frontend và Node.js backend.

## 🌟 Tính năng chính

### 👤 Người dùng
- ✅ Đăng ký/Đăng nhập tài khoản
- ✅ Xem danh sách sản phẩm
- ✅ Tìm kiếm và lọc sản phẩm
- ✅ Thêm vào giỏ hàng
- ✅ Thanh toán đơn hàng
- ✅ Quản lý hồ sơ cá nhân
- ✅ Xem lịch sử đơn hàng

### ⚙️ Admin
- ✅ Dashboard quản lý tổng quan
- ✅ Quản lý sản phẩm (CRUD)
- ✅ Quản lý danh mục
- ✅ Quản lý đơn hàng
- ✅ Quản lý người dùng
- ✅ Đăng ký admin mới

## 🛠️ Công nghệ sử dụng

### Frontend
- **React.js** - Framework UI
- **Material-UI (MUI)** - Component library
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Multer** - File upload
- **bcryptjs** - Password hashing

## 🚀 Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js 16+
- MongoDB
- npm hoặc yarn

### 1. Clone repository
```bash
git clone https://github.com/youngestwall/shop_fashion.git
cd shop_fashion
```

### 2. Cài đặt dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend  
```bash
cd frontend
npm install
```

### 3. Cấu hình environment

Tạo file `.env` trong thư mục `backend`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shop_fashion
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

> **Lưu ý**: Đảm bảo MongoDB đang chạy trên máy của bạn trước khi khởi động backend.

### 4. Chạy ứng dụng

#### Cách 1: Chạy tự động (Khuyến nghị)
```powershell
# Chạy cả backend và frontend cùng lúc
.\start-dev.ps1
```

#### Cách 2: Chạy riêng từng phần

**Chạy Backend (Port 5000)**
```bash
cd backend
npm run dev
```

**Chạy Frontend (Port 3000)**
```bash
cd frontend
npm start
```

#### Cách 3: Chạy từng phần bằng script
```powershell
# Chỉ chạy backend
.\start-backend.ps1

# Chỉ chạy frontend  
.\start-frontend.ps1
```

### 5. Truy cập ứng dụng
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login
- **API**: http://localhost:5000

## 👤 Tài khoản mặc định

### Admin
- **Email**: admin@gmail.com
- **Password**: admin123

### Test User (có thể tạo mới)
- Đăng ký tài khoản mới tại: http://localhost:3000/register
- Hoặc sử dụng tài khoản admin để quản lý

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký user
- `POST /api/auth/login` - Đăng nhập user  
- `POST /api/auth/admin-login` - Đăng nhập admin
- `POST /api/auth/register-admin` - Đăng ký admin mới

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm mới (Admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (Admin)

### Categories
- `GET /api/categories` - Lấy danh sách danh mục
- `POST /api/categories` - Tạo danh mục mới (Admin)

### Orders
- `GET /api/orders` - Lấy danh sách đơn hàng
- `POST /api/orders` - Tạo đơn hàng mới
- `PUT /api/orders/:id` - Cập nhật trạng thái đơn hàng (Admin)

## 📁 Cấu trúc dự án

```
shop_fashion/
├── backend/                 # Node.js Backend
│   ├── controllers/         # Controllers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middlewares/        # Middlewares
│   ├── uploads/            # File uploads
│   └── server.js           # Entry point
├── frontend/               # React Frontend
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── features/       # Redux slices
│   │   ├── context/        # React context
│   │   └── utils/          # Utilities
│   └── package.json
├── .gitignore
└── README.md
```

## 🔧 Scripts hữu ích

### Backend
```bash
npm run dev          # Chạy development với nodemon
npm start           # Chạy production
```

### Frontend
```bash
npm start           # Chạy development server
npm run build       # Build cho production
npm test            # Chạy tests
npm run eject       # Eject from Create React App
```

### PowerShell Scripts (Windows)
```powershell
.\start-dev.ps1      # Chạy cả backend và frontend
.\start-backend.ps1  # Chỉ chạy backend
.\start-frontend.ps1 # Chỉ chạy frontend
```

## 🐛 Troubleshooting

### Backend không khởi động được
1. Kiểm tra MongoDB đã chạy chưa
2. Kiểm tra port 5000 có bị chiếm không
3. Kiểm tra file `.env` đã tạo chưa

### Frontend không compile được
1. Xóa `node_modules` và chạy `npm install` lại
2. Kiểm tra phiên bản Node.js (cần 16+)
3. Chạy `npm audit fix` để sửa lỗi dependencies

### Không đăng nhập được
1. Kiểm tra backend có chạy không
2. Kiểm tra MongoDB có dữ liệu admin không
3. Chạy script tạo admin: `node backend/utils/createAdmin.js`

## 🚀 Khởi động lại toàn bộ dự án

Nếu gặp vấn đề, hãy thực hiện các bước sau để khởi động lại hoàn toàn:

### **Bước 1: Dọn dẹp các tiến trình cũ**
```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### **Bước 2: Kiểm tra thư mục dự án**
Đảm bảo bạn đang ở đúng thư mục dự án `shop_fashion`

### **Bước 3: Khởi động Backend (Cổng 5000)**
```powershell
cd "your_project_path\shop_fashion\backend"
npm run dev
```
*Đợi một chút để backend khởi động...* ⏳

✅ **Backend đã khởi động thành công!**

### **Bước 4: Khởi động Frontend (Cổng 3000)**
```powershell
cd "your_project_path\shop_fashion\frontend"
npm start
```
*Đợi frontend compile...* ⏳

✅ **Frontend đã compile và sẵn sàng!**

### **Bước 5: Kiểm tra API Backend**
```powershell
Start-Sleep -Seconds 3
Invoke-WebRequest -Uri "http://localhost:5000/api/health-check" -Method GET
```
✅ **API Backend hoạt động tốt!**

### **Bước 6: Kiểm tra trạng thái Admin**
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/auth/check-first-admin" -Method GET
```

### **Bước 7: Test đăng nhập Admin**
```powershell
$body = @{email="admin@gmail.com"; password="admin123"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:5000/api/auth/admin-login" -Method POST -Body $body -ContentType "application/json"
```
✅ **Admin login hoạt động tốt!**

## 🎉 **DỰ ÁN ĐÃ CHẠY THÀNH CÔNG HOÀN TOÀN!**

### 📋 **Thông tin truy cập:**

| Dịch vụ | URL | Trạng thái |
|---------|-----|-----------|
| 🌐 **Frontend (Shop)** | http://localhost:3000 | ✅ Hoạt động |
| ⚙️ **Admin Panel** | http://localhost:3000/admin/login | ✅ Hoạt động |
| 🔧 **API Backend** | http://localhost:5000 | ✅ Hoạt động |
| 🏥 **Health Check** | http://localhost:5000/api/health-check | ✅ Hoạt động |
| 📊 **Network Access** | http://192.168.1.252:3000 | ✅ Có thể truy cập từ máy khác |

### 🛒 **Các trang chính:**
- **Trang chủ**: http://localhost:3000
- **Sản phẩm**: http://localhost:3000/products
- **Đăng nhập user**: http://localhost:3000/login
- **Dashboard admin**: http://localhost:3000/admin/dashboard
- **Đăng ký admin mới**: http://localhost:3000/admin/register-first-admin

### 👤 **Tài khoản test:**
- **Admin**: admin@gmail.com / admin123
- **User**: Có thể đăng ký mới tại /register

## 📱 Screenshots

### Trang chủ
![Homepage](https://via.placeholder.com/800x400?text=Homepage+Screenshot)

### Admin Dashboard  
![Admin Dashboard](https://via.placeholder.com/800x400?text=Admin+Dashboard+Screenshot)

### Quản lý sản phẩm
![Product Management](https://via.placeholder.com/800x400?text=Product+Management+Screenshot)

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📝 License

Dự án này được phân phối dưới MIT License. Xem `LICENSE` để biết thêm chi tiết.

## 📞 Liên hệ

- **📧 Email**: phainie03@gmail.com
- **💻 GitHub**: [@youngestwall](https://github.com/youngestwall)
- **🔗 Repository**: [shop_fashion](https://github.com/youngestwall/shop_fashion)
- **🌐 LinkedIn**: [Phai Nguyen](https://www.linkedin.com/in/ypn-phai-351079294/)
- **📱 Phone/Zalo**: *+84 xxx xxx xxx

### 💬 Hỗ trợ và phản hồi

- **🐛 Báo lỗi**: [Tạo Issue](https://github.com/youngestwall/shop_fashion/issues)
- **💡 Đề xuất tính năng**: [Feature Request](https://github.com/youngestwall/shop_fashion/issues/new)
- **❓ Hỏi đáp**: [Discussions](https://github.com/youngestwall/shop_fashion/discussions)
- **📧 Email support**: phainie03@gmail.com

### 🤝 Kết nối với tôi

Tôi luôn sẵn sàng kết nối với các developer khác và thảo luận về:
- ⚛️ React.js và Frontend Development
- 🟢 Node.js và Backend Development  
- 🛍️ E-commerce Solutions
- 💡 Tech Innovation và Startup Ideas

*Đừng ngần ngại liên hệ nếu bạn có câu hỏi hoặc muốn hợp tác!* 🚀

## 🔮 Tính năng sắp tới

- [ ] 💳 Thanh toán online (VNPay, Momo)
- [ ] ⭐ Đánh giá và nhận xét sản phẩm
- [ ] ❤️ Wishlist (danh sách yêu thích)
- [ ] 🎫 Khuyến mãi và coupon
- [ ] 📧 Email notifications
- [ ] 📱 Mobile app (React Native)
- [ ] 🌐 Multi-language support
- [ ] 🔍 Advanced search và filters
- [ ] 📊 Analytics và reports
- [ ] 🚚 Tracking đơn hàng

## 🏆 Acknowledgments

- [Material-UI](https://mui.com/) cho component library tuyệt vời
- [MongoDB](https://www.mongodb.com/) cho database linh hoạt
- [Node.js](https://nodejs.org/) community
- [React](https://reactjs.org/) development team

## 📄 Changelog

### Version 1.0.0 (2025-07-14)
- ✅ Initial release
- ✅ Basic e-commerce functionality
- ✅ Admin panel
- ✅ User authentication
- ✅ Product management
- ✅ Order system





## 👨‍💻 Đồng tác giả
**phuocdai2004** link github -> https://github.com/phuocdai2004

## 👨‍💻 Về tác giả 

**Youngestwall** - Passionate Full-Stack Developer

- 🎓 Chuyên về React.js, Node.js và MongoDB
- 💼 Kinh nghiệm phát triển ứng dụng web hiện đại
- 🌟 Đam mê tạo ra những sản phẩm có ý nghĩa
- 📚 Luôn học hỏi công nghệ mới

**Made with ❤️ by [@youngestwall](https://github.com/youngestwall)**

*"Code with passion, create with purpose"* ✨
