// utils.js
export const inventoryValidator = (item) => {
    const errors = [];
    if (item.quantity < 0) errors.push('Quantity cannot be negative');
    if (new Date(item.expirationDate) < new Date()) errors.push('Expiration date must be in future');
    return errors;
  };
  
  export const calculateProfitMargin = (item) => {
    return ((item.price - item.cost) / item.price * 100).toFixed(2);
  };