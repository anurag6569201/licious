import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';

function HistoryConsumption() {
    const [history, setHistory] = useState([]);
    const backend_url = process.env.REACT_APP_MAIN_URL;

    useEffect(() => {
        if (!backend_url) {
            console.error("Backend URL is not defined.");
            return;
        }

        axios.get(`${backend_url}/inventory/consumption-history`)
            .then(response => setHistory(response.data))
            .catch(error => console.error('Error fetching consumption history:', error));
    }, [backend_url]);

    return (
        <>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantity Consumed</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.item_name}</td>
                            <td>{entry.quantity_consumed}kg / {entry.unit}</td>
                            <td>{new Date(entry.date).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
}

export default HistoryConsumption;
