/**
 * ModelView.jsx - Component hiển thị view 3D của iPhone model
 * 
 * Component này:
 * - Tạo một view 3D sử dụng React Three Fiber
 * - Hiển thị model iPhone 3D với lighting và camera controls
 * - Cho phép người dùng xoay model bằng OrbitControls
 * - Sử dụng Suspense để hiển thị loader khi model đang load
 */

// Import các components từ @react-three/drei
// - View: container cho 3D view
// - OrbitControls: điều khiển camera (xoay, zoom, pan)
// - PerspectiveCamera: camera phối cảnh
// - Html: để render HTML trong 3D scene
import { Html, OrbitControls, PerspectiveCamera, View } from "@react-three/drei"

// Import Three.js
import * as THREE from 'three'
// Import các components con
import Lights from './Lights'; // Component ánh sáng
import Loader from './Loader'; // Component loader khi model đang load
import IPhone from './IPhone'; // Component model iPhone 3D
// Import Suspense từ React để xử lý async loading
import { Suspense } from "react";

/**
 * Component ModelView - View 3D của iPhone model
 * 
 * @param {number} index - Index của view (1 hoặc 2)
 * @param {object} groupRef - Reference đến 3D group
 * @param {string} gsapType - ID để GSAP có thể animate (ví dụ: "view1", "view2")
 * @param {object} controlRef - Reference đến OrbitControls
 * @param {function} setRotationState - Function để cập nhật góc xoay
 * @param {string} size - Kích thước iPhone ("small" hoặc "large")
 * @param {object} item - Dữ liệu model (màu, title, img)
 * 
 * @returns {JSX.Element} - Trả về 3D view với model iPhone
 */
const ModelView = ({ index, groupRef, gsapType, controlRef, setRotationState, size, item }) => {
  return (
    /**
     * View - Container cho 3D view
     * 
     * - index: index của view (1 hoặc 2)
     * - id: để GSAP có thể tìm và animate
     * - className: 
     *   - index === 2: dịch chuyển view thứ 2 ra ngoài bên phải ban đầu
     *   - Sau đó GSAP sẽ animate để hiển thị view tương ứng
     */
    <View
      index={index}
      id={gsapType}
      className={`w-full h-full absolute ${index === 2 ? 'right-[-100%]' : ''}`}
    >
      {/* 
        Ambient Light - Ánh sáng môi trường
        intensity={0.3}: độ sáng 30% - tạo ánh sáng tổng thể cho scene
      */}
      <ambientLight intensity={0.3} />

      {/* 
        PerspectiveCamera - Camera phối cảnh
        makeDefault: đặt làm camera mặc định
        position={[0, 0, 4]}: vị trí camera (x, y, z) - cách gốc tọa độ 4 đơn vị về phía trước
      */}
      <PerspectiveCamera makeDefault position={[0, 0, 4]} />

      {/* Component Lights - Các nguồn sáng bổ sung */}
      <Lights />

      {/* 
        OrbitControls - Điều khiển camera
        - makeDefault: đặt làm controls mặc định
        - ref: reference để có thể điều khiển programmatically
        - enableZoom={false}: tắt zoom
        - enablePan={false}: tắt pan (di chuyển)
        - rotateSpeed={0.4}: tốc độ xoay (40% tốc độ mặc định)
        - target: điểm camera nhìn vào (gốc tọa độ)
        - onEnd: callback khi người dùng ngừng xoay - lưu góc xoay vào state
      */}
      <OrbitControls 
        makeDefault
        ref={controlRef}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.4}
        target={new THREE.Vector3(0, 0 ,0)}
        onEnd={() => setRotationState(controlRef.current.getAzimuthalAngle())}
      /> 

      {/* 
        Group - Nhóm các 3D objects
        - ref: reference đến group để có thể animate
        - name: tên của group (để debug)
        - position: vị trí của group trong scene
      */}
      <group ref={groupRef} name={`${index === 1} ? 'small' : 'large`} position={[0, 0 ,0]}>
        {/* 
          Suspense - Xử lý async loading
          - fallback: hiển thị Loader khi model đang load
          - IPhone component có thể mất thời gian để load model 3D
        */}
        <Suspense fallback={<Loader />}>
          {/* 
            Component IPhone - Model 3D của iPhone
            - scale: tỷ lệ phóng to
              * index === 1 (small): scale [15, 15, 15]
              * index === 2 (large): scale [17, 17, 17]
            - item: dữ liệu model (màu, title, img)
            - size: kích thước iPhone
          */}
          <IPhone 
            scale={index === 1 ? [15, 15, 15] : [17, 17, 17]}
            item={item}
            size={size}
          />
        </Suspense>
      </group>
    </View>
  )
}

export default ModelView