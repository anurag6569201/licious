import { useState, useEffect, useContext, createContext } from 'react';
import { 
  Button, Table, Form, Alert, Card, Row, Col, 
  Nav, Modal, Spinner, Badge, Tab, Tabs 
} from 'react-bootstrap';
import { LineChart, BarChart, PieChart } from 'recharts';
import { QrReader } from 'react-qr-reader';
import axios from 'axios';
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

  
  export default SupplierTab;