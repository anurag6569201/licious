import React from 'react';
import "../Style/ProductCard.css";
import { Button, Flex, Image, Text, useToast } from '@chakra-ui/react'
import { useDispatch } from 'react-redux';
import { getCartData, postCartData } from '../Redux/ProfileRedux/action';
import { Link } from "react-router-dom";
import { MdDeliveryDining } from 'react-icons/md';

const ProductCard = ({ item }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const addToCart = (item, name) => {
    if (localStorage.getItem("token") == undefined) {
      toast({
        position: 'top',
        title: `Not Logged in.`,
        description: `Login first to add item into cart`,
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
    } else {
      dispatch(postCartData(item))
      dispatch(getCartData());
      toast({
        position: 'top',
        title: `${name} added Successfully.`,
        description: `Check your cart`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    }
  };

  return (
    <>
      <div key={item._id} className="slider_carddd">
        <div id="image" style={{ position: 'relative' }}>
        <Link to={`/productdetails/${item._id}`} >
          <img style={{ height: '200px',width:'100%',borderRadius:'10px' }} src={item.imgUrl} alt="image" />
        </Link>
          <Button onClick={() => addToCart(item, item.name)}
            style={{
              backgroundColor: "#D11243",
              color: "white",
              fontSize: "13px",
              fontWeight: "600",
              height: "30px",
              width: "100px",
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              zIndex:100,
            }}
          >
            ADD TO CART
          </Button>
        </div>
        <div id="heading" style={{ overflow: "hidden", marginTop: '10px' }}>
                          <h2 style={{ fontWeight: '600' }}>{item.name}</h2>
                        </div>
                        <div id="para" style={{ overflowX: "hidden" }}>
                          <p>{item.desc.length > 50 ? `${item.desc.substring(0, 50)}...` : item.desc}</p>
                        </div>
                        <div id="wt">
                          <p>{item.net}</p>
                        </div>
                        <div id="blook">
                          <p style={{ color: "#e1003e", fontWeight: "700" }}>
                            MRP: ₹{item.price}
                          </p>
                          <p style={{ color: "gray", textAlign: "left" }}>
                            MRP: <s>₹{item.price + Math.floor(item.price * 0.13)}</s>
                          </p>
                        </div>
        
                        <Flex style={{ textAlign: "center", alignItems: "center", marginTop: "1%" }}>
                          <div style={{ display: "flex", justifyContent: 'left', alignItems: 'center' }}>
                            <Image width="30px" src="https://www.licious.in/image/rebranding/png/Scooter_express.png" />
                            <Text fontSize="sm" color='gray'>&nbsp;&nbsp;Today in 12PM-2PM&nbsp;</Text>
                          </div>
                        </Flex>
      </div>
    </>
  )
}

export default ProductCard