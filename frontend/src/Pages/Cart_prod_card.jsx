import { HStack, Text, useToast, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { MdClose, MdRemove, MdAdd } from 'react-icons/md'
import { useDispatch } from 'react-redux'
import { deleteCartData, getCartData, updateCartQuantity } from '../Redux/ProfileRedux/action'

const Cart_prod_card = ({ name, id, net, price, qty }) => {
    const [count, setCount] = useState(qty); // Initialize with qty
    const toast = useToast();
    const dispatch = useDispatch();

    const deleteFromCart = (id, name) => {
        dispatch(deleteCartData(id));
        dispatch(getCartData());
        toast({
            position: 'top',
            title: 'Removed Successfully.',
            description: `${name} has been removed from the cart`,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };

    const handleDecrease = () => {
        if (count > 1) {
            const newQty = count - 1;
            setCount(newQty);
            dispatch(updateCartQuantity(id, newQty)); // Update Redux
        }
    };

    const handleIncrease = () => {
        const newQty = count + 1;
        setCount(newQty);
        dispatch(updateCartQuantity(id, newQty)); // Update Redux
    };

    useEffect(() => {
        let qty_data = { qty: count }; // Ensure updated cart data is reflected
        dispatch(getCartData(qty_data));
    }, [count]);

    return (
        <VStack padding={"10px"} borderBottom={"1px solid #a4a4a6"}>
            <HStack justifyContent={"space-between"} width={"100%"} gap={"3"}>
                <Text alignSelf={"start"} fontWeight={"700"} fontSize={"16px"}>{name}</Text>
                <MdClose cursor={"pointer"} color='black' size={"20px"} onClick={() => deleteFromCart(id, name)} />
            </HStack>
            <HStack width={"100%"} gap={"2"} justifyContent={"space-between"}>
                <HStack width={'50%'} justifyContent={"flex-start"}>
                    <Text fontSize={"14px"} padding={"5px"} border={"1px solid #a4a4a6"} color={"#a4a4a6"} borderRadius={"5px"}>{net}</Text>
                    <Text fontSize={"14px"} fontWeight={"600"} color={"#d11243"} >₹ {price}</Text>
                    <Text fontSize={"13px"} textDecoration={"line-through"} >₹ {+price + 50}</Text>
                </HStack>
                <HStack>
                    <MdRemove cursor={"pointer"} color='#d11243' size={"18px"} onClick={handleDecrease} />
                    <Text fontWeight={600} bg={"#f2f2f2"} padding={"5px 12px"} fontSize='14px'>{count}</Text>
                    <MdAdd cursor={"pointer"} color='#d11243' size={"18px"} onClick={handleIncrease} />
                </HStack>
            </HStack>
        </VStack>
    )
}

export default Cart_prod_card;
