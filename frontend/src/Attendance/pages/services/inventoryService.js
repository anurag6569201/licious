const inventoryService = {
    getInventory: () => JSON.parse(localStorage.getItem('inventory') || '[]'),
    saveInventory: (data) => localStorage.setItem('inventory', JSON.stringify(data)),
    getSuppliers: () => JSON.parse(localStorage.getItem('suppliers') || '[]'),
    saveSuppliers: (data) => localStorage.setItem('suppliers', JSON.stringify(data)),
  };
  
  export default inventoryService;
  