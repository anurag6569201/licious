import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  VStack,
  Text,
  Badge,
  Divider,
  Heading,
  SimpleGrid,
  useToast,
  Image,
  Flex,
  Button,
  Spinner,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";

const backend_url=process.env.REACT_APP_MAIN_URL

const Last24HoursOrders = () => {
  const [orders, setOrders] = useState([]);
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(backend_url+"/show-orders/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (err) {
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const openOtpModal = (order) => {
    setSelectedOrder(order);
    setOtp("");
    onOpen();
  };

  const confirmOrder = async () => {
    if (confirmLoading || !selectedOrder || !otp) return;

    setConfirmLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        backend_url+"/confirm_order/",
        { order_id: selectedOrder.id, otp_token: otp },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast({
          title: "Order Confirmed",
          description: "The order has been confirmed successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === selectedOrder.id ? { ...order, is_delivered: true } : order
          )
        );
        onClose();
      } else {
        setError("Failed to confirm the order.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to confirm order");
      toast({
        title: "Error",
        description: "Failed to confirm the order.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setConfirmLoading(false);
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <VStack spacing={8} align="stretch" mt={8} maxW="75%" mx="auto">
      <Heading size="lg" marginTop='40px' fontWeight="bold">Orders from Last 24 Hours</Heading>
      <Divider borderWidth="1px" borderColor="gray.300" />

      {/* Pending Orders */}
      <Heading size="md" align='left' color="orange.500">Pending Orders</Heading>
      {orders.filter(order => !order.is_delivered).length > 0 ? (
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {orders.filter(order => !order.is_delivered).map((order) => (
            <OrderCard key={order.id} order={order} openOtpModal={openOtpModal} />
          ))}
        </SimpleGrid>
      ) : (
        <Text>No pending orders in the last 24 hours.</Text>
      )}

      {/* Delivered Orders */}
      <Heading size="md" mt={6} align='left' color="green.500">Delivered Orders</Heading>
      {orders.filter(order => order.is_delivered).length > 0 ? (
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {orders.filter(order => order.is_delivered).map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </SimpleGrid>
      ) : (
        <Text>No delivered orders in the last 24 hours.</Text>
      )}

      {/* OTP Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent padding='20px'>
          <ModalHeader align='left' margin='0' padding='0'>Enter OTP to Confirm Order</ModalHeader><br />
          <ModalCloseButton />
          <ModalBody>
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={confirmOrder} isLoading={confirmLoading} loadingText="Confirming...">
              Confirm
            </Button>
            <Button variant="ghost" onClick={onClose} ml={3}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

const OrderCard = ({ order, openOtpModal }) => {
  const [showProducts, setShowProducts] = useState(false);
  return (
    <Box key={order.id} p={5} borderWidth="1px" borderRadius="md" boxShadow="xl" bg="gray.50">
      <VStack align="start" spacing={2}>
        <HStack justify="space-between" w="full">
          <Text fontWeight="bold" fontSize="xl">Order ID: {order.id}</Text>
          <Badge colorScheme={order.is_delivered ? "green" : "orange"} fontSize="lg">
            {order.is_delivered ? "Delivered" : "In Transit"}
          </Badge>
        </HStack>

        <Text><strong>Payment ID:</strong> {order.payment_id}</Text>
        <Text><strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}</Text>

        <Divider borderWidth="1px" borderColor="gray.300" />
        <Heading size="sm" fontWeight="semibold">Delivery Address</Heading>
        <Text>{order.address.name} || {order.address.email}</Text>
        <Text>{order.address.bldgno}, {order.address.locality}, {order.address.landmark}, {order.address.city}</Text>

        <Divider borderWidth="1px" borderColor="gray.300" />
        <div className="d-flex" style={{gap:'10px'}}>
        <Button
          size="sm"
          colorScheme="blue"
          onClick={() => setShowProducts(!showProducts)}
        >
          {showProducts ? "Hide Products" : "Show Products"}
        </Button>
        {!order.is_delivered && (
          <Button onClick={() => openOtpModal(order)} colorScheme="green" size="sm">
            Confirm Order
          </Button>
        )}
        </div>
        
        {showProducts && (
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} w="full">
            {order.products.map((product) => (
              <Box key={product.id} p={4} borderWidth="1px" borderRadius="md" boxShadow="sm" bg="white">
                <Flex direction="row" gap={4} align="left">
                  <Image src={product.imgUrl} alt={product.name} objectFit="cover" w="80px" h="80px" borderRadius="md" />
                  <VStack align="start" spacing={1} flex="1">
                    <Text fontWeight="bold" fontSize="md" noOfLines={1}>{product.name}</Text>
                    <Text fontSize="md" fontWeight="semibold">₹{product.price} × {product.qty}</Text>
                    <Text fontSize="sm" color="gray.600">Net Weight: {product.net}</Text>
                  </VStack>
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </Box>
  );
};

export default Last24HoursOrders;
