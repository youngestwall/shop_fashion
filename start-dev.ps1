# Script khởi chạy dự án Fashion Shop
Write-Host "=== Khởi chạy Fashion Shop ===" -ForegroundColor Green

# Chạy backend
Write-Host "Khởi chạy Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-Command", "cd 'd:\Zalo Received Files\shop_fashion\backend'; npm run dev" -WindowStyle Normal

# Chờ 3 giây cho backend khởi động
Start-Sleep -Seconds 3

# Chạy frontend
Write-Host "Khởi chạy Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-Command", "cd 'd:\Zalo Received Files\shop_fashion\frontend'; npm start" -WindowStyle Normal

Write-Host "Dự án đang chạy:" -ForegroundColor Green
Write-Host "- Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "- Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Nhấn Enter để thoát..." -ForegroundColor White
Read-Host
