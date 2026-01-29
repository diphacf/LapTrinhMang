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
import ChatPage from './components/ChatPage';
import { useState } from 'react';

const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (isChatOpen) {
    return <ChatPage onBack={() => setIsChatOpen(false)} />;
  }

  return (
    <main className="bg-black">
      <Navbar toggleChat={() => setIsChatOpen(true)} />
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

