import { useState, useEffect, useContext, createContext } from 'react';
import { 
  Button, Table, Form, Alert, Card, Row, Col, 
  Nav, Modal, Spinner, Badge, Tab, Tabs 
} from 'react-bootstrap';
import { LineChart, BarChart, PieChart } from 'recharts';
import { QrReader } from 'react-qr-reader';
import axios from 'axios';

// Mock backend service
const inventoryService = {
  getInventory: () => JSON.parse(localStorage.getItem('inventory') || '[]'),
  saveInventory: (data) => localStorage.setItem('inventory', JSON.stringify(data)),
  getSuppliers: () => JSON.parse(localStorage.getItem('suppliers') || '[]'),
  saveSuppliers: (data) => localStorage.setItem('suppliers', JSON.stringify(data)),
};

const AuthContext = createContext();

const InventoryManager = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [user] = useState({ role: 'manager' }); // Simulated auth

  return (
    <AuthContext.Provider value={user}>
      <div className="container-fluid mt-4">
        <h2 className="mb-4">🥩 Advanced Non-Veg Inventory System</h2>
        
        <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
          <Tab eventKey="inventory" title="Inventory">
            <InventoryTab />
          </Tab>
          <Tab eventKey="suppliers" title="Suppliers">
            <SupplierTab />
          </Tab>
          <Tab eventKey="orders" title="Purchase Orders">
            <OrdersTab />
          </Tab>
          <Tab eventKey="reports" title="Reports">
            <ReportsTab />
          </Tab>
        </Tabs>
      </div>
    </AuthContext.Provider>
  );
};

const InventoryTab = () => {
  const [inventory, setInventory] = useState(inventoryService.getInventory());
  const [showScanner, setShowScanner] = useState(false);
  const [consumption, setConsumption] = useState({});
  const user = useContext(AuthContext);

  const handleConsumption = (id) => {
    const amount = parseFloat(consumption[id] || 0);
    if (amount > 0) {
      const updated = inventory.map(item => 
        item.id === id ? { ...item, quantity: item.quantity - amount } : item
      );
      setInventory(updated);
      inventoryService.saveInventory(updated);
    }
  };

  return (
    <>
      <div className="mb-4">
        <Button variant="success" className="me-2" onClick={() => setShowScanner(!showScanner)}>
          {showScanner ? 'Close Scanner' : 'Scan Barcode'}
        </Button>
        <AddInventoryModal />
      </div>

      {showScanner && (
        <div className="mb-4" style={{ maxWidth: 500 }}>
          <QrReader
            onResult={(result) => {
              if (result) {
                // Handle barcode scan
                console.log(result.text);
                setShowScanner(false);
              }
            }}
            constraints={{ facingMode: 'environment' }}
          />
        </div>
      )}

      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Item</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Min Stock</th>
            <th>Expiration</th>
            <th>Price/Cost</th>
            {user.role === 'manager' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item.id} className={getRowClass(item)}>
              <td>
                {item.name}
                {isExpired(item.expirationDate) && <Badge bg="danger" className="ms-2">EXPIRED</Badge>}
              </td>
              <td>{item.category}</td>
              <td>{item.quantity} {item.unit}</td>
              <td>{item.minStock}</td>
              <td>{formatDate(item.expirationDate)}</td>
              <td>
                <div>₹{item.price}/kg</div>
                <small className="text-muted">Cost: ₹{item.cost}/kg</small>
              </td>
              {user.role === 'manager' && (
                <td>
                  <Form.Group className="d-flex">
                    <Form.Control
                      type="number"
                      style={{ width: 80 }}
                      value={consumption[item.id] || ''}
                      onChange={(e) => setConsumption({ 
                        ...consumption, 
                        [item.id]: e.target.value 
                      })}
                      placeholder="Qty"
                    />
                    <Button 
                      variant="outline-dark" 
                      onClick={() => handleConsumption(item.id)}
                    >
                      Consume
                    </Button>
                  </Form.Group>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

const SupplierTab = () => {
  const [suppliers, setSuppliers] = useState(inventoryService.getSuppliers());
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (supplier) => {
    const updated = [...suppliers, { ...supplier, id: Date.now() }];
    setSuppliers(updated);
    inventoryService.saveSuppliers(updated);
    setShowModal(false);
  };

  return (
    <>
      <Button className="mb-3" onClick={() => setShowModal(true)}>Add Supplier</Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>Specialty</th>
            <th>Rating</th>
            <th>Last Delivery</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map(supplier => (
            <tr key={supplier.id}>
              <td>{supplier.name}</td>
              <td>{supplier.contact}</td>
              <td>{supplier.specialty}</td>
              <td>{'★'.repeat(supplier.rating)}</td>
              <td>{formatDate(supplier.lastDelivery)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <SupplierModal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        onSubmit={handleSubmit}
      />
    </>
  );
};

const ReportsTab = () => {
  const inventory = inventoryService.getInventory();
  
  const stockData = inventory.map(item => ({
    name: item.name,
    stock: item.quantity,
    minStock: item.minStock
  }));

  const categoryData = Object.groupBy(inventory, item => item.category);
  const expirationData = inventory.filter(item => item.expirationDate);

  return (
    <Row>
      <Col md={6}>
        <Card className="mb-4">
          <Card.Header>Stock Levels</Card.Header>
          <Card.Body>
            <BarChart data={stockData}>
              <Bar dataKey="stock" fill="#8884d8" />
              <Bar dataKey="minStock" fill="#82ca9d" />
            </BarChart>
          </Card.Body>
        </Card>
      </Col>

      <Col md={6}>
        <Card className="mb-4">
          <Card.Header>Category Distribution</Card.Header>
          <Card.Body>
            <PieChart>
              <Pie 
                data={Object.entries(categoryData).map(([name, items]) => ({
                  name,
                  value: items.length
                }))} 
                dataKey="value" 
                nameKey="name" 
              />
            </PieChart>
          </Card.Body>
        </Card>
      </Col>

      <Col md={12}>
        <Card>
          <Card.Header>Expiration Timeline</Card.Header>
          <Card.Body>
            <LineChart data={expirationData}>
              <Line type="monotone" dataKey="quantity" stroke="#ff7300" />
            </LineChart>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

// Helper functions
const getRowClass = (item) => {
  if (isExpired(item.expirationDate)) return 'table-danger';
  if (item.quantity < item.minStock) return 'table-warning';
  return '';
};

const isExpired = (date) => {
  return new Date(date) < new Date();
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};

export default InventoryManager;