import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  VStack,
  Text,
  Badge,
  Divider,
  Heading,
  SimpleGrid,
  Image,
  Flex,
  Button,
  Spinner,
  HStack
} from '@chakra-ui/react';

const Last24HoursOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the orders from the API
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token'); // Or wherever you store the token
        const response = await axios.get('http://127.0.0.1:8000/show-orders/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (err) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <VStack spacing={8} align="stretch" mt={8} maxW="75%" className="delivery_box" mx="auto">
        <br />
      <Heading size="lg" fontWeight="bold">Orders from Last 24 Hours</Heading>
      <Divider borderWidth="1px" borderColor="gray.300" />

      {orders.length > 0 ? (
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {orders.map((order) => (
            <Box
              key={order.id}
              p={5}
              borderWidth="1px"
              borderRadius="md"
              boxShadow="xl"
              bg="gray.50"
            >
              {/* Order Details */}
              <VStack align="start" spacing={2}>
                <HStack justify="space-between" w="full">
                  <Text fontWeight="bold" fontSize="xl">Order ID: {order.id}</Text>
                  <Badge colorScheme={order.is_delivered ? 'green' : 'orange'} fontSize="lg">
                    {order.is_delivered ? 'Delivered' : 'In Transit'}
                  </Badge>
                </HStack>

                <Text><strong>Payment ID:</strong> {order.payment_id}</Text>
                <Text><strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}</Text>

                {/* Address Section */}
                <Divider borderWidth="1px" borderColor="gray.300" />
                <Heading size="sm" fontWeight="semibold">Delivery Address</Heading>
                <Text>{order.address.name} || {order.address.email}</Text>
                <Text>{order.address.bldgno}, {order.address.locality}, {order.address.landmark} , {order.address.city}</Text>

                {/* Products Section */}
                <Divider borderWidth="1px" borderColor="gray.300" />
                <Heading size="sm" fontWeight="semibold">Products</Heading>
                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                  {order.products.map((product) => (
                    <Box
                      key={product.id}
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                      boxShadow="sm"
                      bg="white"
                    >
                      <Flex direction="row" gap={4} align="center">
                        <Image
                          src={product.imgUrl}
                          alt={product.name}
                          objectFit="cover"
                          w="80px"
                          h="80px"
                          borderRadius="md"
                        />
                        <VStack align="start" spacing={1} flex="1">
                          <Text fontWeight="bold" fontSize="md" noOfLines={1}>
                            {product.name}
                          </Text>
                          <Text fontSize="md" fontWeight="semibold">
                            ₹{product.price} × {product.qty}
                          </Text>
                          <Text fontSize="sm" color="gray.600">Net Weight: {product.net}</Text>
                        </VStack>
                      </Flex>
                    </Box>
                  ))}
                </SimpleGrid>
              </VStack>

            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Text>No orders found in the last 24 hours.</Text>
      )}
    </VStack>
  );
};

export default Last24HoursOrders;
