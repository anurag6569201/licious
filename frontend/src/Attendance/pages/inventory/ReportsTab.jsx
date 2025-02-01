import { useState, useEffect, useContext, createContext } from 'react';
import { 
  Button, Table, Form, Alert, Card, Row, Col, 
  Nav, Modal, Spinner, Badge, Tab, Tabs 
} from 'react-bootstrap';
import { LineChart, BarChart, PieChart } from 'recharts';
import { QrReader } from 'react-qr-reader';
import axios from 'axios';
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
export default ReportsTab;  