import { useState, useEffect, useContext, createContext } from 'react';
import { 
  Button, Table, Form, Alert, Card, Row, Col, 
  Nav, Modal, Spinner, Badge, Tab, Tabs 
} from 'react-bootstrap';
import { LineChart, BarChart, PieChart } from 'recharts';
import { QrReader } from 'react-qr-reader';
import axios from 'axios';

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
  


  export default InventoryTab;