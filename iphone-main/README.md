# 📱 iPhone 15 Pro Website

<div align="center">
  <br />
  <h3>Website giới thiệu iPhone 15 Pro với React, Three.js và GSAP</h3>
  <p>Một website clone của Apple iPhone 15 Pro với animations mượt mà, model 3D tương tác và video carousel</p>
  <br />

  <div>
    <img src="https://img.shields.io/badge/-React_JS-black?style=for-the-badge&logoColor=white&logo=react&color=61DAFB" alt="react.js" />
    <img src="https://img.shields.io/badge/-Three_JS-black?style=for-the-badge&logoColor=white&logo=threedotjs&color=000000" alt="three.js" />
    <img src="https://img.shields.io/badge/-GSAP-black?style=for-the-badge&logoColor=white&logo=greensock&color=88CE02" alt="greensock" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-Vite-black?style=for-the-badge&logoColor=white&logo=vite&color=646CFF" alt="vite" />
  </div>
</div>

---

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cài đặt và chạy dự án](#-cài-đặt-và-chạy-dự-án)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Các component chính](#-các-component-chính)
- [Scripts](#-scripts)
- [Tài nguyên](#-tài-nguyên)

---

## 🎯 Giới thiệu

Đây là một website clone của Apple iPhone 15 Pro được xây dựng bằng React.js và TailwindCSS. Dự án này tập trung vào việc tạo ra trải nghiệm người dùng tuyệt vời với:

- ✨ **Animations mượt mà** sử dụng GSAP (GreenSock Animation Platform)
- 🎨 **Model 3D tương tác** với Three.js và React Three Fiber
- 🎬 **Video carousel** tự động chuyển đổi
- 📱 **Responsive design** hoàn toàn tương thích với mọi thiết bị
- 🎭 **Hiệu ứng scroll** và transitions chuyên nghiệp

Dự án này phù hợp cho những ai muốn học:
- React.js và các hooks
- GSAP animations
- Three.js và 3D rendering
- TailwindCSS
- Responsive design
- Component architecture

---

## ✨ Tính năng

### 🎬 Animations với GSAP
- Smooth scroll animations
- Fade in/out effects
- Slide transitions
- Progress bar animations cho video
- Scroll-triggered animations

### 🎨 Model 3D iPhone
- Hiển thị model 3D của iPhone 15 Pro
- Xoay và xem model từ mọi góc độ
- Chọn màu: Natural Titanium, Blue Titanium, White Titanium, Black Titanium
- Chọn kích thước: 6.1" (Pro) hoặc 6.7" (Pro Max)
- Smooth transitions giữa các view

### 🎥 Video Carousel
- Carousel tự động chuyển video
- Progress bar hiển thị tiến độ phát
- Controls: Play, Pause, Replay
- Tự động chuyển video khi video hiện tại kết thúc
- Responsive cho mọi kích thước màn hình

### 📱 Responsive Design
- Tối ưu cho Desktop, Tablet và Mobile
- Video tự động chuyển đổi giữa version lớn và nhỏ
- Layout linh hoạt với TailwindCSS
- Touch-friendly trên mobile

### 🎯 Các phần chính
- **Navbar**: Thanh điều hướng với logo và menu
- **Hero Section**: Banner chính với video hero
- **Highlights**: Phần highlights với video carousel
- **Model Section**: Hiển thị model 3D với controls
- **Features**: Giới thiệu tính năng với scroll animations
- **How It Works**: Giải thích về chip A17 Pro
- **Footer**: Thông tin liên hệ và links

---

## 🛠️ Công nghệ sử dụng

### Core Technologies
- **[React.js](https://reactjs.org/)** (v18.2.0) - UI library
- **[Vite](https://vitejs.dev/)** (v5.1.4) - Build tool và dev server
- **[TailwindCSS](https://tailwindcss.com/)** (v3.4.1) - CSS framework

### 3D & Graphics
- **[Three.js](https://threejs.org/)** (v0.162.0) - 3D graphics library
- **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)** (v8.15.19) - React renderer cho Three.js
- **[React Three Drei](https://github.com/pmndrs/drei)** (v9.101.0) - Helpers cho React Three Fiber

### Animations
- **[GSAP](https://greensock.com/gsap/)** (v3.12.5) - Animation library
- **[@gsap/react](https://greensock.com/docs/v3/React/)** (v2.1.0) - GSAP hooks cho React

### Monitoring
- **[Sentry](https://sentry.io/)** (v7.106.0) - Error tracking và performance monitoring

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[PostCSS](https://postcss.org/)** - CSS processing
- **[Autoprefixer](https://github.com/postcss/autoprefixer)** - CSS vendor prefixes

---

##  Cài đặt và chạy dự án

### Yêu cầu hệ thống

Đảm bảo bạn đã cài đặt:
- [Node.js](https://nodejs.org/) (v16 trở lên)
- [npm](https://www.npmjs.com/) hoặc [yarn](https://yarnpkg.com/)

### Các bước cài đặt

1. **Clone repository**
   ```bash
   git clone https://github.com/JavaScript-Mastery-Pro/iphone-doc.git
   cd iphone-doc
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   ```

3. **Chạy development server**
   ```bash
   npm run dev
   ```

4. **Mở trình duyệt**
   - Truy cập: `http://localhost:5173`
   - Vite sẽ tự động mở trình duyệt

### Build cho production

```bash
npm run build
```

Build files sẽ được tạo trong thư mục `dist/`

### Preview production build

```bash
npm run preview
```

### Lint code

```bash
npm run lint
```

---

## 📁 Cấu trúc dự án

```
iphone-main/
├── public/
│   ├── assets/
│   │   ├── images/          # Hình ảnh (logo, icons, màu iPhone)
│   │   └── videos/          # Video (hero, highlights, explore)
│   └── models/              # Model 3D (scene.glb)
├── src/
│   ├── components/          # React components
│   │   ├── Navbar.jsx       # Thanh điều hướng
│   │   ├── Hero.jsx         # Banner chính
│   │   ├── Highlights.jsx  # Phần highlights
│   │   ├── Model.jsx       # Model 3D section
│   │   ├── ModelView.jsx   # View 3D component
│   │   ├── Features.jsx    # Phần tính năng
│   │   ├── HowItWorks.jsx  # Phần giải thích
│   │   ├── VideoCarousel.jsx # Video carousel
│   │   ├── Footer.jsx       # Footer
│   │   ├── IPhone.jsx      # Component model iPhone 3D
│   │   ├── Lights.jsx      # Lighting cho 3D scene
│   │   └── Loader.jsx      # Loading component
│   ├── constants/
│   │   └── index.js        # Dữ liệu tĩnh (models, sizes, links)
│   ├── utils/
│   │   ├── index.js        # Export assets (images, videos)
│   │   └── animations.js   # Helper functions cho GSAP animations
│   ├── App.jsx             # Component chính
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles và TailwindCSS
├── index.html              # HTML template
├── package.json            # Dependencies và scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # TailwindCSS configuration
└── postcss.config.js       # PostCSS configuration
```

---

## 🧩 Các component chính

### App.jsx
Component gốc chứa tất cả các sections của website:
- Navbar
- Hero
- Highlights
- Model
- Features
- HowItWorks
- Footer

### Navbar.jsx
Thanh điều hướng với:
- Logo Apple
- Menu items (Store, Mac, iPhone, Support)
- Icons tìm kiếm và giỏ hàng
- Responsive: ẩn menu trên mobile

### Hero.jsx
Banner chính với:
- Video hero tự động phát
- Tiêu đề "iPhone 15 Pro"
- Nút "Buy" và thông tin giá
- GSAP animations khi load
- Tự động chuyển video dựa trên kích thước màn hình

### Highlights.jsx
Phần highlights với:
- Tiêu đề "Get the highlights"
- Links "Watch the film" và "Watch the event"
- VideoCarousel component
- GSAP animations

### Model.jsx
Section hiển thị model 3D với:
- Model 3D iPhone có thể xoay
- Chọn màu (4 màu Titanium)
- Chọn kích thước (6.1" hoặc 6.7")
- Animation chuyển đổi giữa các view
- Sử dụng React Three Fiber

### VideoCarousel.jsx
Carousel video với:
- 4 video highlights tự động chuyển
- Progress bar cho mỗi video
- Controls: Play, Pause, Replay
- GSAP animations cho slider
- Scroll-triggered animations

### Features.jsx
Phần tính năng với:
- Video explore về titanium
- Hình ảnh và text mô tả
- Scroll-triggered animations
- GSAP ScrollTrigger

### HowItWorks.jsx
Phần giải thích với:
- Hình ảnh chip A17 Pro
- Video game demo
- Text mô tả về GPU
- GSAP animations

### Footer.jsx
Footer với:
- Thông tin mua hàng
- Số điện thoại
- Copyright
- Footer links

---

## 📝 Scripts

### Development
```bash
npm run dev
```
Chạy development server tại `http://localhost:5173`

### Build
```bash
npm run build
```
Build production files vào thư mục `dist/`

### Preview
```bash
npm run preview
```
Preview production build locally

### Lint
```bash
npm run lint
```
Chạy ESLint để kiểm tra code quality

---

## 🎨 Styling

Dự án sử dụng **TailwindCSS** với các custom utilities được định nghĩa trong `src/index.css`:

- `.flex-center` - Flexbox center
- `.nav-height` - Chiều cao navbar
- `.btn` - Button styles
- `.section-heading` - Heading styles
- `.hero-title` - Hero title styles
- `.feature-text` - Feature text styles
- Và nhiều utilities khác...

### Custom Colors
```javascript
colors: {
  blue: "#2997FF",
  gray: {
    DEFAULT: "#86868b",
    100: "#94928d",
    200: "#afafaf",
    300: "#42424570",
  },
  zinc: "#101010",
}
```

---

## 🎯 Các khái niệm chính

### React Hooks
- `useState` - Quản lý state
- `useEffect` - Side effects
- `useRef` - References đến DOM elements
- `useGSAP` - GSAP animations với React

### GSAP Animations
- `gsap.to()` - Animate to values
- `gsap.from()` - Animate from values
- `gsap.timeline()` - Animation sequences
- `ScrollTrigger` - Scroll-based animations

### Three.js
- `THREE.Group` - Group 3D objects
- `OrbitControls` - Camera controls
- `PerspectiveCamera` - 3D camera
- `Environment` - Scene environment
- `Lights` - Lighting setup

---

## 📚 Tài nguyên học tập

### Documentation
- [React Documentation](https://react.dev/)
- [GSAP Documentation](https://greensock.com/docs/)
- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

### Tutorials
- [JavaScript Mastery YouTube](https://www.youtube.com/@javascriptmastery/videos)

---

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Nếu bạn muốn đóng góp:

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

---

## 📄 License

Dự án này được tạo cho mục đích học tập. Tất cả assets (hình ảnh, video) thuộc về Apple Inc.

---

## 👨‍💻 Tác giả

Dự án được tạo bởi [JavaScript Mastery](https://www.youtube.com/@javascriptmastery)

---

## ⭐ Star History

Nếu bạn thấy dự án này hữu ích, hãy cho một ⭐!

---

<div align="center">
  <p>Made with ❤️ by JavaScript Mastery</p>
  <p>Happy Coding! </p>
</div>
