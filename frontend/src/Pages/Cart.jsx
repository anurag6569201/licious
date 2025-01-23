import React, { useEffect } from 'react'
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    Text,
    Box,
    HStack,
    Image,
    VStack,
    useDisclosure,
} from '@chakra-ui/react'
import Cart_prod_card from './Cart_prod_card'
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { getCartData } from '../Redux/ProfileRedux/action'

const Cart = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector((state) => state.ProfileReducer.cart) || [];

    useEffect(() => {
        dispatch(getCartData());
    }, [dispatch])

    let totalOfItems = 0;

    return (
        <>
            {localStorage.getItem("token") == undefined ?
                <Button ref={btnRef} variant="outline" onClick={onOpen} isDisabled>
                    <HStack fontSize={["13px", "15px", "18px"]} padding={["0px", "0px", "5px"]} justify={"center"} align={"center"} position={"relative"}>
                        <Image
                            width="20px"
                            src="https://www.licious.in/image/rebranding/svg/cart.svg"
                        />
                        <Text position={"absolute"} top={0} left={3.0} fontWeight={700} color={"#d11243"}>{cart?.length}</Text>
                        <Text color="gray">Cart</Text>
                    </HStack>
                </Button> :
                <Button ref={btnRef} variant="outline" onClick={onOpen}>
                    <HStack fontSize={["13px", "15px", "18px"]} padding={["0px", "0px", "5px"]} justify={"center"} align={"center"} position={"relative"}>
                        <Image
                            width="20px"
                            src="https://www.licious.in/image/rebranding/svg/cart.svg"
                        />
                        <Text position={"absolute"} top={0} left={3.0} fontWeight={700} color={"#d11243"}>{cart?.length}</Text>
                        <Text color="gray">Cart</Text>
                    </HStack>
                </Button>}

            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
                size={"sm"}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent >
                    <DrawerCloseButton />
                    <DrawerHeader>
                        <Text fontSize={'22px'}>Order Summary</Text>
                    </DrawerHeader>
                    <DrawerBody backgroundColor={"#f2f2f2"} overflowY={"scroll !important"} padding={"20px !important"}>
                        {cart.length <= 0 ? <Text>No Products In the cart</Text> :
                            <Box padding={"5px"} backgroundColor="white" borderRadius={"5px"} >
                                {cart.length > 0 && cart.map((item) => {
                                    totalOfItems += (Number(item.price) * Number(item.qty));
                                    return <Cart_prod_card key={item.id} id={item.id} name={item.name} net={item.net} price={item.price} qty={item.qty} />
                                })}
                            </Box>
                        }
                        <br />
                        <Box padding={"8px"} border={'1px dashed black'}>
                            <Text w="100%" fontSize={"l"} textAlign={'start'} fontWeight="500" >
                                Bill Details
                            </Text>
                            <VStack flexWrap={"wrap"} width={"100%"}>
                                <HStack width={"100%"} lineHeight={"14px"} justifyContent={"space-between"} alignItems={"center"}><Text>Sub Total</Text> <Text>{totalOfItems}</Text> </HStack>
                                <HStack width={"100%"} lineHeight={"14px"} justifyContent={"space-between"} alignItems={"center"}><Text>Discount</Text> <Text>0</Text> </HStack>
                                <HStack width={"100%"} lineHeight={"14px"} justifyContent={"space-between"} alignItems={"center"}><Text>Delivery Charge</Text> <Text>0</Text> </HStack>
                                <Box border={"0.1px solid black"} width={"100%"}></Box>
                                <HStack fontSize={"l"} width={"100%"}
                                    lineHeight={"14px"} justifyContent={"space-between"}
                                    alignItems={"center"}>
                                    <Text>Total</Text> <Text>{totalOfItems}</Text> </HStack>
                            </VStack>
                            <br />
                        </Box>
                    </DrawerBody>
                    <DrawerFooter>
                        <VStack width={"100%"}>
                            <HStack width={"100%"} padding={"5px"} justifyContent={"space-evenly"}>
                                <Text fontWeight={"600"} fontSize={"20px"}>Total : {totalOfItems}</Text>
                                {cart.length <= 0 ? <Button isDisabled colorScheme={"red"} onClick={() => {
                                    navigate("/checkout")
                                    onClose()
                                }}>Proceed To Checkout</Button> :
                                    <Button colorScheme={"red"} onClick={() => {
                                        navigate("/checkout")
                                        onClose()
                                    }}>Proceed To Checkout</Button>}
                            </HStack>
                        </VStack>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default Cart;
