@echo off
chcp 65001 >nul
echo.
echo 🚀 ياسمين الشام - رفع سريع
echo 🚀 Yasmin Alsham - Quick Deploy
echo.

:: التحقق من Git
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git غير مثبت
    pause
    exit /b 1
)

:: عرض التغييرات
echo 📋 التغييرات الحالية:
git status --short

:: رسالة تلقائية مع التاريخ والوقت
for /f "tokens=2-4 delims=/ " %%a in ('date /t') do (
    for /f "tokens=1-2 delims=: " %%d in ('time /t') do (
        set commit_message=Quick update: %%c-%%a-%%b %%d:%%e
    )
)

echo.
echo 📝 رسالة التحديث: %commit_message%
echo.

:: رفع سريع
echo ➕ إضافة الملفات...
git add .

echo 💾 إنشاء commit...
git commit -m "%commit_message%"

echo 📤 رفع إلى GitHub...
git push

if errorlevel 1 (
    echo ❌ فشل في الرفع
    pause
    exit /b 1
)

echo.
echo ✅ تم الرفع بنجاح!
echo.
timeout /t 3 >nul
