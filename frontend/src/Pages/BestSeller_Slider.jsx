import React, { useEffect, useState } from "react";
import "../Style/BestSeller_Slider.css";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import axios from "axios";
import { Button, Flex, Image, Skeleton, Text, useToast } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getCartData, postCartData } from "../Redux/ProfileRedux/action";

const Slider = ({ props }) => {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(true);
  const [addedItems, setAddedItems] = useState({});
  const toast = useToast();
  const dispatch = useDispatch();
  const backend_url=process.env.REACT_APP_MAIN_URL



  useEffect(() => {
    setLoad(true)
    axios.get(backend_url+"/fooditems/get?format=json").then((res) => {
      let newdata = res.data.data
      newdata = newdata.reverse()
      setData(newdata)
      setLoad(false)
    })

    // Load cart from localStorage
    let savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartMap = {};
    savedCart.forEach((item) => {
      cartMap[item.name] = true; // Mark items as added
      dispatch(postCartData(item));
    });
    setAddedItems(cartMap);
  }, []);




  console.log("bonelesscuts", data);


  const slideLeft = () => {
    var slider = document.getElementById("slider");
    slider.scrollLeft = slider.scrollLeft - 358;
  };

  const slideRight = () => {
    var slider = document.getElementById("slider");
    slider.scrollLeft = slider.scrollLeft + 358;
  };


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
    <div className="main_slider_container">
      <MdKeyboardArrowLeft
        size={40}
        className="slider_icon_left"
        onClick={slideLeft}
      />
      <div id="slider" >
        <Skeleton isLoaded={!load}>
          {data.map((slide) => {
            return (
              <div key={slide.food_id} className="slider_card">
                <Link to={`/productdetails/${slide.food_id}`} >  <div id="image">
                  <img src={slide.imgUrl} alt="image" />
                </div></Link>
                <div id="heading" style={{ overflow: "hidden" }}>
                  <p>{slide.name}</p>
                </div>
                <div id="para" style={{ overflowX: "hidden" }}>
                  <p>{slide.desc}</p>
                </div>
                <div id="wt">
                  <p>{slide.net}</p>
                </div>
                <div id="blook">
                  <p style={{ color: "#e1003e", fontWeight: "700" }}>
                    MRP: ₹{slide.price}
                  </p>
                  <p style={{ color: "gray", textAlign: "left" }}>
                    MRP: <s>₹{slide.price + Math.floor(slide.price * 0.13)}</s>
                  </p>
                  <Button
                    onClick={() => addToCart(slide, slide.name)}
                    style={{
                      backgroundColor: addedItems[slide.name] ? "gray" : "#D11243",
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
                    disabled={addedItems[slide.name]}
                  >
                    {addedItems[slide.name] ? "Added" : "Add to Cart"}
                  </Button>
                </div>
                <Flex style={{ textAlign: "center", alignItems: "center", marginTop: "1%" }}>
                  <div style={{ display: "flex", margin: "auto", }}>
                    <Image width="30px" src="https://www.licious.in/image/rebranding/png/Scooter_express.png" />
                    <Text fontSize="sm" color='gray'>&nbsp;&nbsp;Today in 12PM-2PM&nbsp;</Text>

                  </div>
                </Flex>
              </div>
            );
          })}
        </Skeleton>
      </div>
      <MdKeyboardArrowRight
        size={40}
        className="slider_icon_right"
        onClick={slideRight}
      />
    </div>
  );
};

export default Slider;
