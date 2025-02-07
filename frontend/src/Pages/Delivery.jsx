import React, { useState } from "react";
import axios from "axios";

const OrderDetailsDelivery = () => {
  const [otp, setOtp] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchOrderDetails = async () => {
    if (!otp) {
      setError("Please enter OTP");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://127.0.0.1:8000/delivery/", {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const orderData = response.data.find((order) => order.otp_token == otp);
      if (orderData) {
        setOrder(orderData);
      } else {
        setError("No order found for this OTP");
      }
    } catch (err) {
      setError("Failed to fetch order details");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Enter OTP to Fetch Order</h2>
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={fetchOrderDetails}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Fetch Order
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {order && (
        <div className="border p-4 rounded">
          <h3 className="text-lg font-bold">Order Details</h3>
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>User:</strong> {order.user}</p>
          <p><strong>Payment ID:</strong> {order.payment_id}</p>
          <p><strong>Delivery Status:</strong> {order.is_delivered ? "Delivered" : "Pending"}</p>
          <p><strong>Created At:</strong> {order.created_at}</p>
          <h4 className="font-bold mt-2">Products:</h4>
          <ul>
            {JSON.parse(order.products).map((product) => (
              <li key={product.id} className="flex items-center space-x-4 border-b py-2">
                <img src={product.imgUrl} alt={product.name} className="w-16 h-16 rounded" />
                <div>
                  <p className="font-bold">{product.name}</p>
                  <p>{product.net} - ₹{product.price} (Qty: {product.qty})</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsDelivery;
