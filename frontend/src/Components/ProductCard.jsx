import React, { useEffect, useState } from "react";
import "../Style/ProductCard.css";
import { Button, Flex, Image, Text, useToast } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux';
import { getCartData, postCartData } from '../Redux/ProfileRedux/action';
import { Link } from "react-router-dom";
import { MdDeliveryDining } from 'react-icons/md';

const ProductCard = ({ item }) => {
  const [addedItems, setAddedItems] = useState({});
  const toast = useToast();
  const Profile = useSelector((state) => state.ProfileReducer.profile) || null;
  const dispatch = useDispatch();
  useEffect(() => {
    // Load cart from localStorage
    let savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartMap = {};
    savedCart.forEach((item) => {
      cartMap[item.name] = true; // Mark items as added
      dispatch(postCartData(item));
    });
    setAddedItems(cartMap);
  }, []);
  const addToCart = (item, name) => {
      if (!localStorage.getItem("token")) {
        toast({
          position: "top",
          title: "Not Logged in.",
          description: "Login first to add item into cart",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
  
      let cart_data = {
        user: "",
        name: item.name,
        imgUrl: item.imgUrl,
        short_desc: item.short_desc,
        net: item.net,
        price: item.price,
        discount: item.discount,
        qty: item.qty,
      };
  
      let existingCart = JSON.parse(localStorage.getItem("cart")) || [];
  
      if (!existingCart.some(cartItem => cartItem.name === item.name)) {
        existingCart.push(cart_data);
        localStorage.setItem("cart", JSON.stringify(existingCart));
        setAddedItems(prev => ({ ...prev, [item.name]: true })); // Update state
        dispatch(postCartData(cart_data));
        dispatch(getCartData());
  
        toast({
          position: "top",
          title: `${name} added Successfully.`,
          description: "Check your cart",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    };

  return (
    <>
      <div key={item.food_id} className="slider_carddd">
        <div id="image" style={{ position: 'relative' }}>
        <Link to={`/productdetails/${item.food_id}`} >
          <img style={{ height: '200px',width:'100%',borderRadius:'10px' }} src={item.imgUrl} alt="image" />
        </Link>
          <Button
                            onClick={() => addToCart(item, item.name)}
                            style={{
                              backgroundColor: addedItems[item.name] ? "gray" : "#D11243",
                              color: "white",
                              fontSize: "13px",
                              fontWeight: "600",
                              height: "30px",
                              width: "100px",
                              position: "absolute",
                              bottom: "10px",
                              right: "10px",
                              zIndex: 100,
                            }}
                            disabled={addedItems[item.name]}
                          >
                            {addedItems[item.name] ? "Added" : "Add to Cart"}
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