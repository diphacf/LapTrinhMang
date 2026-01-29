
import React, { useEffect, useState } from 'react';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Gọi API lấy danh sách sản phẩm từ Server
        // Vì đã cấu hình proxy trong vite.config.js nên chỉ cần gọi /api/products
        fetch('/api/products')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Không thể kết nối đến Server');
                }
                return response.json();
            })
            .then((data) => {
                // Log để kiểm tra dữ liệu
                console.log("Dữ liệu từ Server:", data);
                setProducts(data.data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Lỗi:", err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return (
        <section className="common-padding bg-zinc text-white">
            <div className="screen-max-width">
                <h2 className="text-2xl font-bold mb-5 text-center text-gray-100">
                    Demo: Kết nối Client - Server 
                </h2>

                {loading && <p className="text-center">Đang tải dữ liệu...</p>}
                {error && <p className="text-center text-red-500">Lỗi: {error}</p>}

                {!loading && !error && products.length === 0 && (
                    <p className="text-center">Chưa có sản phẩm nào trong Database.</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
                    {products.map((product) => (
                        <div key={product._id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold mb-2 text-yellow-500">{product.name}</h3>
                            <p className="text-gray-400 mb-2">{product.description}</p>
                            <p className="text-white font-bold text-lg">
                                Giá: {product.price.toLocaleString()} VNĐ
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductList;
