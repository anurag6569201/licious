import { useState, useContext, useEffect } from 'react';
import { Button, Table, Form, Badge, Modal } from 'react-bootstrap';
import AuthContext from './AuthContext';
import inventoryService from './inventoryService';
import axios from 'axios';

const InventoryTab = () => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const [consumption, setConsumption] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    quantity: 0,
    unit: 'kg',
    min_stock: 0,
    expiration_date: '',
    price: 0,
    cost: 0
  });

  const user = useContext(AuthContext);
  const [inventory, setInventory] = useState([]);

  const handleConsumption = async (id) => {
    const amount = parseFloat(consumption[id] || 0);
    if (amount > 0) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.put(
          `${backend_url}/inventory/update`,
          { id, quantity: amount }, // Send updated quantity to backend
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
  
        if (response.status === 200) {
          // Update the local state with the new quantity from response
          setInventory(inventory.map(item =>
            item.id === id ? { ...item, quantity: item.quantity - amount } : item
          ));
          inventoryService.saveInventory(inventory);
        }
      } catch (error) {
        console.error('Error updating inventory item:', error);
      }
    }
  };
  
  const backend_url = process.env.REACT_APP_MAIN_URL;
  useEffect(() => {
    axios.get(`${backend_url}/inventory/get`)
      .then(response => setInventory(response.data.inventory))
      .catch(error => console.error('Error fetching inventory:', error));
  }, []);

  const handleDeleteItem = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${backend_url}/inventory/delete`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          data: { id },
        }
      );

      if (response.status === 200) {
        setInventory(inventory.filter(item => item.id !== id));
        inventoryService.saveInventory(inventory);
      }
    } catch (error) {
      console.error('Error deleting inventory item:', error);
    }
  };

  const handleAddItem = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      const response = await axios.post(
        `${backend_url}/inventory/add`,
        newItem,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 201) {
        setInventory([...inventory, response.data]);
        inventoryService.saveInventory([...inventory, response.data]);
        setShowModal(false);
        setNewItem({
          name: '',
          category: '',
          quantity: 0,
          unit: 'kg',
          min_stock: 0,
          expiration_date: '',
          price: 0,
          cost: 0
        });
      }
    } catch (error) {
      console.error('Error adding inventory item:', error);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between mb-4">
      <Button style={{background:'#d21243'}} variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
        Add Item Manually
      </Button>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Unit</Form.Label>
              <Form.Control
                type="text"
                value={newItem.unit}
                onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Min Stock</Form.Label>
              <Form.Control
                type="number"
                value={newItem.min_stock}
                onChange={(e) => setNewItem({ ...newItem, min_stock: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Expiration Date</Form.Label>
              <Form.Control
                type="date"
                value={newItem.expiration_date}
                onChange={(e) => setNewItem({ ...newItem, expiration_date: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Cost</Form.Label>
              <Form.Control
                type="number"
                value={newItem.cost}
                onChange={(e) => setNewItem({ ...newItem, cost: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddItem}>Add Item</Button>
        </Modal.Footer>
      </Modal>

      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Item</th>
            <th>Category</th>
            <th>QTY/Stock</th>
            <th>Min Stock</th>
            <th>Expiration</th>
            <th>Price/Cost</th>
            {isAdmin === true && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item.id} className={getRowClass(item)}>
              <td>
                {item.name}
                {isExpired(item.expiration_date) && <Badge bg="danger" className="ms-2">EXPIRED</Badge>}
              </td>
              <td>{item.category}</td>
              <td>{item.quantity}kg / {item.unit}</td>
              <td>{item.min_stock}</td>
              <td>{formatDate(item.expiration_date)}</td>
              <td>
                ₹{item.price}/kg <br />
                <small className="text-muted">Cost: ₹{item.cost}/kg</small>
              </td>
              {isAdmin === true && (
                <td>
                  <Form.Group className="d-flex">
                  <Form.Control
                      type="number"
                      style={{ width: 80 }}
                      value={consumption[item.id] || ''}
                      onChange={(e) => setConsumption({ ...consumption, [item.id]: e.target.value })}
                      placeholder="Qty"
                    />
                    <Button style={{marginLeft:'10px',marginRight:'10px'}} variant="outline-dark" onClick={() => handleConsumption(item.id)}>
                      Consume
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteItem(item.id)}>Delete</Button>
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

const getRowClass = (item) => {
  if (isExpired(item.expiration_date)) return 'table-danger';
  if (item.quantity < item.min_stock) return 'table-warning';
  return '';
};

const isExpired = (date) => new Date(date) < new Date();
const formatDate = (dateString) => (!dateString ? 'N/A' : new Date(dateString).toLocaleDateString());

export default InventoryTab;
