/**
 * Model.jsx - Component hiển thị model 3D của iPhone
 * 
 * Component này hiển thị:
 * - Model 3D của iPhone với khả năng xoay và zoom
 * - Chọn màu iPhone (Natural, Blue, White, Black Titanium)
 * - Chọn kích thước (6.1" hoặc 6.7")
 * - Animation chuyển đổi giữa các view khi thay đổi size
 * - Sử dụng Three.js và React Three Fiber để render 3D
 */

// Import GSAP và useGSAP hook
import { useGSAP } from "@gsap/react"
import gsap from "gsap";
// Import component ModelView để hiển thị model 3D
import ModelView from "./ModelView";
// Import React hooks
import { useEffect, useRef, useState } from "react";
// Import hình ảnh mặc định
import { yellowImg } from "../utils";

// Import Three.js - thư viện 3D graphics
import * as THREE from 'three';
// Import React Three Fiber - React renderer cho Three.js
import { Canvas } from "@react-three/fiber";
// Import View từ drei - để tạo multiple views
import { View } from "@react-three/drei";
// Import dữ liệu models và sizes từ constants
import { models, sizes } from "../constants";
// Import helper function để tạo animation với timeline
import { animateWithGsapTimeline } from "../utils/animations";

/**
 * Component Model - Hiển thị model 3D iPhone
 * 
 * @returns {JSX.Element} - Trả về section với model 3D và controls
 */
const Model = () => {
  /**
   * useState - Quản lý state cho kích thước iPhone
   * 'small' = 6.1", 'large' = 6.7"
   */
  const [size, setSize] = useState('small');
  
  /**
   * useState - Quản lý state cho model iPhone được chọn
   * Bao gồm: title, color array, và hình ảnh
   */
  const [model, setModel] = useState({
    title: 'iPhone 15 Pro in Natural Titanium',
    color: ['#8F8A81', '#FFE7B9', '#6F6C64'],
    img: yellowImg,
  })

  /**
   * useRef - References đến camera controls
   * cameraControlSmall: điều khiển camera cho model nhỏ (6.1")
   * cameraControlLarge: điều khiển camera cho model lớn (6.7")
   */
  const cameraControlSmall = useRef();
  const cameraControlLarge = useRef();

  /**
   * useRef - References đến 3D groups
   * THREE.Group(): tạo một group trong Three.js để chứa các objects
   * small: group cho model 6.1"
   * large: group cho model 6.7"
   */
  const small = useRef(new THREE.Group());
  const large = useRef(new THREE.Group());

  /**
   * useState - Quản lý góc xoay của models
   * smallRotation: góc xoay của model nhỏ
   * largeRotation: góc xoay của model lớn
   */
  const [smallRotation, setSmallRotation] = useState(0);
  const [largeRotation, setLargeRotation] = useState(0);

  /**
   * GSAP Timeline - để tạo animation sequence
   * Timeline cho phép tạo nhiều animation chạy tuần tự hoặc song song
   */
  const tl = gsap.timeline();

  /**
   * useEffect - Xử lý animation khi thay đổi size
   * 
   * Khi người dùng chọn size khác:
   * - Nếu chọn 'large': animate view nhỏ ra ngoài, view lớn vào trong
   * - Nếu chọn 'small': animate view lớn ra ngoài, view nhỏ vào trong
   */
  useEffect(() => {
    if(size === 'large') {
      // Chuyển từ small sang large
      // translateX(-100%): dịch chuyển view nhỏ ra ngoài bên trái
      animateWithGsapTimeline(tl, small, smallRotation, '#view1', '#view2', {
        transform: 'translateX(-100%)',
        duration: 2
      })
    }

    if(size ==='small') {
      // Chuyển từ large sang small
      // translateX(0): dịch chuyển view lớn về vị trí ban đầu
      animateWithGsapTimeline(tl, large, largeRotation, '#view2', '#view1', {
        transform: 'translateX(0)',
        duration: 2
      })
    }
  }, [size]) // Chạy lại khi size thay đổi

  /**
   * useGSAP - Animation cho tiêu đề khi component mount
   */
  useGSAP(() => {
    gsap.to('#heading', { y: 0, opacity: 1 })
  }, []);

  return (
    <section className="common-padding">
      <div className="screen-max-width">
        {/* Tiêu đề */}
        <h1 id="heading" className="section-heading">
          Take a closer look.
        </h1>

        <div className="flex flex-col items-center mt-5">
          {/* Container chứa model 3D */}
          <div className="w-full h-[75vh] md:h-[90vh] overflow-hidden relative">
            {/* ModelView cho size nhỏ (6.1") */}
            {/* 
              index={1}: index của view
              groupRef={small}: reference đến 3D group
              gsapType="view1": id để GSAP có thể animate
              controlRef={cameraControlSmall}: reference đến camera control
              setRotationState={setSmallRotation}: function để cập nhật góc xoay
              item={model}: model data (màu, title, img)
              size={size}: kích thước hiện tại
            */}
            <ModelView 
              index={1}
              groupRef={small}
              gsapType="view1"
              controlRef={cameraControlSmall}
              setRotationState={setSmallRotation}
              item={model}
              size={size}
            />  

            {/* ModelView cho size lớn (6.7") */}
            <ModelView 
              index={2}
              groupRef={large}
              gsapType="view2"
              controlRef={cameraControlLarge}
              setRotationState={setLargeRotation}
              item={model}
              size={size}
            />

            {/* Canvas của Three.js để render 3D scene */}
            <Canvas
              className="w-full h-full"
              style={{
                position: 'fixed',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                overflow: 'hidden'
              }}
              eventSource={document.getElementById('root')}
            >
              {/* View.Port: port để hiển thị các views */}
              <View.Port />
            </Canvas>
          </div>

          {/* Container chứa controls (màu và size) */}
          <div className="mx-auto w-full">
            {/* Hiển thị title của model được chọn */}
            <p className="text-sm font-light text-center mb-5">{model.title}</p>

            <div className="flex-center">
              {/* Container các nút chọn màu */}
              <ul className="color-container">
                {/* 
                  .map() để render danh sách các màu
                  item.color[0]: màu đầu tiên trong array color
                  onClick={() => setModel(item)}: khi click, cập nhật model state
                */}
                {models.map((item, i) => (
                  <li 
                    key={i} 
                    className="w-6 h-6 rounded-full mx-2 cursor-pointer" 
                    style={{ backgroundColor: item.color[0] }} 
                    onClick={() => setModel(item)} 
                  />
                ))}
              </ul>

              {/* Container các nút chọn size */}
              <button className="size-btn-container">
                {/* 
                  .map() để render các nút size
                  size === value: kiểm tra size hiện tại
                  Nếu đúng: background trắng, text đen
                  Nếu sai: background trong suốt, text trắng
                */}
                {sizes.map(({ label, value }) => (
                  <span 
                    key={label} 
                    className="size-btn" 
                    style={{ 
                      backgroundColor: size === value ? 'white' : 'transparent', 
                      color: size === value ? 'black' : 'white'
                    }} 
                    onClick={() => setSize(value)}
                  >
                    {label}
                  </span>
                ))}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Model