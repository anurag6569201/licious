import { useState, useEffect } from 'react';
import { Button, Table, Form, Modal, Pagination, Badge, InputGroup } from 'react-bootstrap';
import { format } from 'date-fns';
import inventoryService from './inventoryService';
import axios from 'axios';

const StarRating = ({ rating }) => {
    return <>{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</>;
};
const backend_url = process.env.REACT_APP_MAIN_URL;
const SupplierFormModal = ({ show, handleClose, initialData, onSubmit }) => {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setFormData(initialData || {
            name: '',
            contact: '',
            specialty: '',
            rating: 3,
            last_delivery: new Date().toISOString()
        });
    }, [initialData]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name?.trim()) newErrors.name = 'Name is required';
        if (!formData.contact?.trim()) newErrors.contact = 'Contact is required';
        if (!formData.specialty?.trim()) newErrors.specialty = 'Specialty is required';
        if (formData.rating < 1 || formData.rating > 5) newErrors.rating = 'Rating must be between 1-5';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token'); 
            const response = await axios.post(
                `${backend_url}/supplier/add`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            handleClose()
        } catch (error) {
            console.error('Error adding supplier item:', error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{initialData ? 'Edit Supplier' : 'Add New Supplier'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Name *</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Contact *</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.contact || ''}
                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                            isInvalid={!!errors.contact}
                        />
                        <Form.Control.Feedback type="invalid">{errors.contact}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Specialty *</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.specialty || ''}
                            onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                            isInvalid={!!errors.specialty}
                        />
                        <Form.Control.Feedback type="invalid">{errors.specialty}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Rating</Form.Label>
                        <div>
                            {[1, 2, 3, 4, 5].map((num) => (
                                <Button
                                    key={num}
                                    variant={formData.rating >= num ? 'warning' : 'outline-secondary'}
                                    className="me-2"
                                    onClick={() => setFormData({ ...formData, rating: num })}
                                >
                                    {num}
                                </Button>
                            ))}
                        </div>
                        {errors.rating && <div className="text-danger">{errors.rating}</div>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Last Delivery</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.last_delivery ? format(new Date(formData.last_delivery), 'yyyy-MM-dd') : ''}
                            onChange={(e) => setFormData({ ...formData, last_delivery: e.target.value })}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button variant="primary" onClick={handleSubmit}>Save Supplier</Button>
            </Modal.Footer>
        </Modal>
    );
};

const SupplierTab = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedSupplierId, setSelectedSupplierId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        setSuppliers(inventoryService.getSuppliers());
    }, []);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleSaveSupplier = (supplierData) => {
        if (supplierData.id) {
            inventoryService.updateSupplier(supplierData);
        } else {
            inventoryService.addSupplier({ ...supplierData, id: Date.now() });
        }
        setSuppliers(inventoryService.getSuppliers());
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(
              `${backend_url}/supplier/delete`,
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                data: { id },
              }
            );
      
            if (response.status === 200) {
              setSupplier(supplier.filter(item => item.id !== id));
              setShowDeleteModal(false);
            }
          } catch (error) {
            console.error('Error deleting supplier item:', error);
          }
    };

    const sortedSuppliers = [...suppliers].sort((a, b) => {
        if (!sortConfig.key) return 0;
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const filteredSuppliers = sortedSuppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const [supplier, setSupplier] = useState([]);
    useEffect(() => {
        axios.get(`${backend_url}/supplier/get`)
          .then(response => setSupplier(response.data.supplier))
          .catch(error => console.error('Error fetching supplier:', error));
      }, []);

    const paginatedSuppliers = filteredSuppliers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between mb-4">
                <Button style={{background:'#d21243'}} variant="primary" onClick={() => setShowModal(true)}>
                    Add Supplier
                </Button>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        {['name', 'contact', 'specialty', 'rating', 'last_delivery'].map((key) => (
                            <th key={key} onClick={() => handleSort(key)} style={{ cursor: 'pointer' }}>
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                                {sortConfig.key === key && (
                                    <Badge bg="secondary" className="ms-2">
                                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                    </Badge>
                                )}
                            </th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {supplier.map(supplier => (
                        <tr key={supplier.id}>
                            <td>{supplier.name}</td>
                            <td>{supplier.contact}</td>
                            <td>{supplier.specialty}</td>
                            <td><StarRating rating={supplier.rating} /></td>
                            <td>{format(new Date(supplier.last_delivery), 'MMM dd, yyyy')}</td>
                            <td>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedSupplierId(supplier.id);
                                        setShowDeleteModal(true);
                                    }}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                    {supplier.length === 0 && (
                        <tr>
                            <td colSpan="6" className="text-center text-muted py-4">
                                No suppliers found
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {totalPages > 1 && (
                <div className="d-flex justify-content-center">
                    <Pagination>
                        <Pagination.Prev
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        />
                        {Array.from({ length: totalPages }, (_, i) => (
                            <Pagination.Item
                                key={i + 1}
                                active={i + 1 === currentPage}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        />
                    </Pagination>
                </div>
            )}

            <SupplierFormModal
                show={showModal}
                handleClose={() => {
                    setShowModal(false);
                    setEditingSupplier(null);
                }}
                initialData={editingSupplier}
                onSubmit={handleSaveSupplier}
            />

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this supplier? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(selectedSupplierId)}>
                        Delete Supplier
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default SupplierTab;  