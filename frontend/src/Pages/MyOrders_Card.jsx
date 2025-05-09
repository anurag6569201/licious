import { Box, Flex, HStack, Image, Text, VStack, Grid, GridItem, Button } from "@chakra-ui/react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const MyOrders_Card = ({ data, time, otp, is_delivered }) => {
    let startTime = new Date(`${time}`).toLocaleString();
    let totalPrice = data.reduce((accumulator, currentValue) => accumulator + +currentValue.price, 0);

    return (
        <Box
            padding={3}
            borderRadius="8px"
            boxShadow="0 2px 4px rgba(0, 0, 0, 0.08)"
            mb={3}
            border="1px solid #e2e8f0"
            bg={is_delivered ? "#d3febc" : "white"}
        >
            {/* Order Header */}
            <HStack justifyContent="space-between" mb={2}>
                <Text fontSize="12px" color="gray.700" isTruncated>
                    <b style={{ color: "#d11243" }}>{data?.length} Products</b> ordered on {startTime} <span style={{fontWeight:'bold'}}>{is_delivered ? "Delivered" : "Dilivery Yet"}</span> <Link to='/delivery' style={{background:'#ccc',color:'#d11243',padding:'0 10px',borderRadius:'10px',marginLeft:'10px'}}>Track It</Link>
                </Text>
                <Text fontSize="12px" fontWeight="bold" color="#d11243">
                    <span style={{marginRight:'10px'}}>OTP: {otp} ||</span> ₹{totalPrice}
                </Text>
            </HStack>

            {/* Products List */}
            <Grid templateColumns={["1fr", "repeat(2, 1fr)", "repeat(4, 1fr)"]} gap={2}>
                {data.map((item) => (
                    <GridItem
                        key={item.id}
                        bg="gray.50"
                        borderRadius="6px"
                        overflow="hidden"
                        boxShadow="0 1px 2px rgba(0, 0, 0, 0.05)"
                    >
                        <Flex direction="column" padding={2} align="center">
                            {/* Product Image */}
                            <Image
                                src={item.imgUrl}
                                alt="productImg"
                                borderRadius="4px"
                                objectFit="cover"
                                maxHeight="80px"
                                mb={2}
                                width="100%"
                            />
                            {/* Product Info */}
                            <VStack spacing={1} width="100%">
                                <Text fontSize="12px" fontWeight="500" isTruncated>
                                    {item.name}
                                </Text>
                                <HStack justifyContent="space-between" width="100%" fontSize="10px" color="gray.600">
                                    <Text>
                                        <b>Net:</b> {item.net}
                                    </Text>
                                    <Text>
                                        <b>Qty:</b> {item.qty}
                                    </Text>
                                </HStack>
                                <HStack justifyContent="space-between" width="100%" fontSize="10px" color="gray.600">
                                    <Text color="#d11243">
                                        <b>₹{item.price}</b>
                                    </Text>
                                    <Text textDecoration="line-through" color="gray.400">
                                        ₹{+item.price + 50}
                                    </Text>
                                </HStack>
                            </VStack>
                        </Flex>
                    </GridItem>
                ))}
            </Grid>
        </Box>
    );
};

export default MyOrders_Card;
