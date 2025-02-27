import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Text,
  Spinner,
  VStack,
  Heading,
  Divider,
  Image,
  SimpleGrid,
  useToast,
  Flex,
  HStack,
  IconButton,
  Badge,
  Alert,
  AlertIcon,
  Tooltip,
  SlideFade,
  Skeleton,
  useColorModeValue
} from "@chakra-ui/react";
import { FiRefreshCcw, FiPackage } from "react-icons/fi";
import '../Style/delivery.css'

const backend_url=process.env.REACT_APP_MAIN_URL
const OrderDetailsDelivery = () => {
  const [otp, setOtp] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
 // For confirm order button loading
  const toast = useToast();
  const cardBg = useColorModeValue("white", "gray.750");
  const accentColor = useColorModeValue("blue.500", "blue.300");

  const fetchOrderDetails = async () => {
    const trimmedOtp = otp.trim();
    if (!trimmedOtp) {
      setError("Please enter OTP");
      return;
    }

    if (loading) return;

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const response = await axios.get(backend_url+"/delivery/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { otp: trimmedOtp },
      });
      if (response.data) {
        setOrder(response.data);
      } else {
        setError("No order found for this OTP");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch order details");
      toast({
        title: "Error",
        description: "Failed to fetch order details.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setLoading(false);
  };



  return (
    <Box maxW="75%" className="delivery_box" mx="auto">
      <br />
      <Box bg={cardBg} borderRadius="2xl" p={6}>
        <VStack spacing={6} align="stretch">
          <HStack spacing={3}>
            <Box p={3} bg={`${accentColor}`} borderRadius="lg">
              <FiPackage size={24} color="white" />
            </Box>
            <VStack align="start" spacing={1}>
              <Heading size="lg" fontWeight="extrabold">
                Track Order Delivery
              </Heading>
              <Text color="gray.500">Enter OTP </Text>
            </VStack>
          </HStack>

          <FormControl>
            <VStack spacing={4}>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                size="lg"
                fontSize="lg"
                fontWeight="medium"
                focusBorderColor={accentColor}
                borderWidth="2px"
                _placeholder={{ color: "gray.400" }}
                onKeyPress={(e) => e.key === 'Enter' && fetchOrderDetails()}
              />
              {error && (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  {error}
                </Alert>
              )}
              <Button
                onClick={fetchOrderDetails}
                colorScheme="blue"
                size="lg"
                width="full"
                isLoading={loading}
                loadingText="Searching..."
                isDisabled={!otp.trim()}
                rightIcon={<FiRefreshCcw />}
              >
                Track Order
              </Button>
            </VStack>
          </FormControl>

          {order && (
            <SlideFade in={!!order} offsetY="20px">
              <VStack spacing={6} align="stretch" mt={8}>
                <Divider borderWidth="1px" borderColor={accentColor} />
                
                <Heading size="md" fontWeight="bold">
                  Order Summary
                </Heading>
                
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} className="simplegrid_delivery">
                  <DetailItem label="Order ID" value={order.id} />
                  <DetailItem label="Payment ID" value={order.payment_id} />
                  <DetailItem label="Username" value={order.address['name']} />
                  <DetailItem label="Email" value={order.address['email']} />
                  <DetailItem label="Address" value={order.address['bldgno'] + ' ' + order.address['locality'] + ' ' + order.address['landmark']+ ' ' + order.address['city']} />
                  <DetailItem 
                    label="Status" 
                    value={
                      <Badge 
                        colorScheme={order.is_delivered ? "green" : "orange"} 
                        fontSize="md"
                        px={3}
                        py={1}
                        borderRadius="full"
                      >
                        {order.is_delivered ? "Delivered" : "In Transit"}
                      </Badge>
                    }
                  />
                  <DetailItem 
                    label="Order Date" 
                    value={new Date(order.created_at).toLocaleString()} 
                  />
                </SimpleGrid>

                <Divider borderWidth="1px" borderColor={accentColor} />

                <Heading size="md" fontWeight="bold">
                  Products ({order.products.length})
                </Heading>

                <SimpleGrid columns={{ base: 1, sm: 1 }} spacing={4}>
                  {order.products.map((product) => (
                    <Box
                      key={product.id}
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                      boxShadow="sm"
                      _hover={{ shadow: "md", transform: "scale(1.02)" }}
                      transition="all 0.2s ease-in-out"
                      bg="white"
                    >
                      <Flex className="delivery_flex_service" align="center" direction={{ base: "column", sm: "row" }} gap={4}>
                        <Image
                          src={product.imgUrl}
                          alt={product.name}
                          objectFit="cover"
                          w="120px"
                          h="120px"
                          borderRadius="md"
                        />
                        <VStack align="start" spacing={2} flex="1">
                          <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
                            {product.name}
                          </Text>
                          <Text fontSize="sm" color="gray.500" noOfLines={1}>
                            {product.net}
                          </Text>
                          <Flex justify="space-between" align="center" width="full">
                            <Text fontSize="md" fontWeight="semibold">
                              ₹{product.price} × {product.qty}
                            </Text>
                            <Badge
                              colorScheme="blue"
                              fontSize="sm"
                              py={1}
                              px={3}
                              borderRadius="full"
                            >
                              In Stock
                            </Badge>
                          </Flex>
                        </VStack>
                      </Flex>
                    </Box>
                  ))}
                </SimpleGrid>


              </VStack>
            </SlideFade>
          )}
        </VStack>
      </Box>

      <Tooltip label="Reset form" placement="left">
        <IconButton
          icon={<FiRefreshCcw />}
          aria-label="Reset"
          onClick={() => {
            setOrder(null);
            setOtp("");
          }}
          position="fixed"
          bottom="40px"
          right="40px"
          size="lg"
          isRound
          colorScheme="blue"
          boxShadow="xl"
        />
      </Tooltip>
    </Box>
  );
};

const DetailItem = ({ label, value }) => (
  <HStack spacing={3} bg="gray.50" p={3} borderRadius="md">
    <Text fontWeight="semibold" minW="100px" color="gray.600">
      {label}:
    </Text>
    <Text>{value}</Text>
  </HStack>
);

export default OrderDetailsDelivery;
