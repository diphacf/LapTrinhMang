/**
 * App.jsx - Component chính của ứng dụng
 */

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Highlights from './components/Highlights';
import Model from './components/Model';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import ProductList from './components/ProductList'; // Component demo kết nối server

const App = () => {
  return (
    <main className="bg-black">
      <Navbar />
      <Hero />
      <Highlights />
      <Model />
      <Features />
      <HowItWorks />

      {/* Phần demo hiển thị dữ liệu từ Server */}
      <ProductList />

      <Footer />
    </main>
  )
}

export default App;

