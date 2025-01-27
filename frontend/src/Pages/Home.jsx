import { Img, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from 'react';
import "../Style/Home.css";
import Slider from "./BestSeller_Slider";
import Slider2 from "./Boneless_Slider";
import { Box, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Show, Hide } from '@chakra-ui/react'
import { useDispatch } from 'react-redux';
import { getProfileData } from '../Redux/ProfileRedux/action';


const Home = () => {
  const dispatch = useDispatch();
  const backend_url=process.env.REACT_APP_MAIN_URL
  console.log(backend_url)
  const ADDTOCARTBUTTON = () => {
    const [check, setcheck] = useState(0)
    return (<>
      {(check < 1 && <Button onClick={() => setcheck(1)}
        style={{ backgroundColor: "#D11243", color: "white", fontSize: "13px", fontWeight: "600", height: "30px", width: "100px" }}>ADD TO CART</Button>)
        || (
          check >= 1 && <Box>
            <Button style={{
              backgroundColor: "white", fontSize: "30px",
              color: "#D11243"
            }} onClick={() => setcheck(check - 1)}>-</Button>
            <Button style={{
              backgroundColor: "white", fontSize: "20px",
            }}  >{check}</Button>
            <Button
              style={{
                backgroundColor: "white", fontSize: "30px",
                color: "#D11243"
              }} onClick={() => setcheck(check + 1)}>+</Button>
          </Box>
        )}</>)
  }
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    dispatch(getProfileData());
    const fetchCategories = async () => {
      try {
        const response = await fetch(backend_url+'/category/all/?format=json');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className='Divvv'>
      {/* Anil kapoor slider */}
      <div className="mainDiv">
        <Img margin={"auto"} borderRadius={"10px"} pt={"20px"}
          width={["100%", "80%", "75%"]}
          src="https://dao54xqhg9jfa.cloudfront.net/oms/c34eb824-4fdd-912c-b4e6-ab14fd512896/original/BANNERS-02_(4).jpeg"
          alt="anil kapoor img"
        />
      </div>
      {/* Anil kapoor slider */}

      {/* Shop category */}
      <div className="second-mainbox">
        <div className="firstDiv">
          <Text fontWeight='700' fontSize='2xl'>Shop by categories</Text>
          <p className="para">Freshest meats just for you</p>
          <div className="inner">
            {categories.map((category) => (
              <Link key={category.id} to={`/product/${category.product_id}`}>
                <div>
                  <img src={category.imgSrc} alt={category.name} />
                  <p>
                    <a>{category.name}</a>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        {/* Shop category */}



        {/* Best seller */}
        <div className="secondDiv" style={{ paddingTop: '20px' }}>
          <Text className="category1">Best Sellers</Text>
          <p style={{ paddingBottom: '10px' }} className="para">Most popular products near you!</p>
          <Slider2 />
        </div>
        {/* Best seller */}

      </div>
    </div>
  );
};

export default Home;
