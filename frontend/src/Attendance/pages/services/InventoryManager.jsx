import { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import AuthContext from './AuthContext';
import InventoryTab from './InventoryTab';
import SupplierTab from './SupplierTab';
import HistoryConsuption from './InventoryHistory';
import '../../styles/inventory.css'

const InventoryManager = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [user] = useState({ role: 'manager' });

  return (
    <AuthContext.Provider value={user}>
      <div className="container-fluid mt-4 inventory_container">
        <h2 className="mb-4" style={{fontSize:'2rem',textAlign:'left'}}>🥩 Advanced Non-Veg Inventory System</h2>

        <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
            <Tab eventKey="inventory" title={<span style={{ color: "#d21243" }}>Inventory</span>}>
                <InventoryTab />
            </Tab>
            <Tab eventKey="suppliers" title={<span style={{ color: "#d21243" }}>Suppliers</span>}>
                <SupplierTab />
            </Tab>
            <Tab eventKey="history" title={<span style={{ color: "#d21243" }}>Consumption History</span>}>
                <HistoryConsuption />
            </Tab>
        </Tabs>
      </div>
    </AuthContext.Provider>
  );
};

export default InventoryManager;
