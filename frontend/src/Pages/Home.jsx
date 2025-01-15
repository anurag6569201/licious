import { Img, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import "../Style/Home.css";
import Slider from "./BestSeller_Slider";
import Slider2 from "./Boneless_Slider";
import { Box, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Show, Hide } from '@chakra-ui/react'

const Home = () => {



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
  const prodCatArr = [
    {
      id: "636d5d0d144878242abc33ed",
      imgSrc: "https://dao54xqhg9jfa.cloudfront.net/OMS-Category/d52759ea-ba5a-0f5b-3dc1-d28875335a3f/original/Todays_Deal_1.png",
      name: "Today's Deals"
    },
    {
      id: "636d5ca4144878242abc33eb",
      imgSrc: "https://dao54xqhg9jfa.cloudfront.net/OMS-Category/ad04872e-60af-387c-533c-efa7dc6eb565/original/Chicken_(1).png",
      name: "Chicken"
    },
    {
      id: "636d5d0d144878242abc33ed",
      imgSrc: "https://dao54xqhg9jfa.cloudfront.net/OMS-Category/eb162d28-5f88-a381-1d45-7f2f66d2c776/original/FIsh.png",
      name: "Fish And SeaFood"
    },
    {
      id: "636d5d16144878242abc33ef",
      imgSrc: "https://dao54xqhg9jfa.cloudfront.net/OMS-Category/7113e792-7025-9e6f-6057-7174edf30856/original/Mu.png",
      name: "Mutton"
    },
    {
      id: "63bc984b7a2a152161ac0217",
      imgSrc: "https://dao54xqhg9jfa.cloudfront.net/OMS-Category/43faaebc-f2ae-102a-ea01-af3e6c37a890/original/RTC.png",
      name: "Ready To Cook"
    },
    {
      id: "636fe63ffb4172486544289c",
      imgSrc: "https://dao54xqhg9jfa.cloudfront.net/OMS-Category/404e48e5-c887-1e12-7a3a-232e01fc9771/original/Prawn.png",
      name: "Prawns"
    },
    {
      id: "63bc98867a2a152161ac0219",
      imgSrc: "https://dao54xqhg9jfa.cloudfront.net/OMS-Category/5c7f1b3a-47b4-3ade-f170-f003cace2482/original/Coldcuts.png",
      name: "Cold Cuts"
    },
    {
      id: "63bc98a27a2a152161ac021b",
      imgSrc: "https://dao54xqhg9jfa.cloudfront.net/OMS-Category/88d8c760-ee1f-7696-7827-fcc9661925cc/original/Spread_Bottle1.png",
      name: "Spreads"
    },
    {
      id: "636d5d22144878242abc33f1",
      imgSrc: "https://dao54xqhg9jfa.cloudfront.net/OMS-Category/04d58840-f014-e613-24d4-1908db9a7e63/original/Eggs.png",
      name: "Eggs"
    },
    {
      id: "636d5d34144878242abc33f3",
      imgSrc: "https://dao54xqhg9jfa.cloudfront.net/OMS-Category/189690c6-c9d5-2441-938b-6c7e124972c7/original/Biryani.png",
      name: "Biryani & Kebab"
    }
  ]

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

      {/* Shop category */} <div className="second-mainbox">
        <div className="firstDiv">
          <Text fontWeight='700' fontSize='2xl'>Shop by categories</Text>
          <p className="para">Freshest meats just for you</p>
          <div className="inner">
            <Link to="/product/636d5d0d144878242abc33ed">
              <div>
                <img
                  src="https://dao54xqhg9jfa.cloudfront.net/OMS-Category/cb6e4eb8-6aec-7872-1638-0c2cf7970b71/original/Todays_Deals.png"
                />
                <p>
                  <a >Today's Deal</a>
                </p>
              </div>
            </Link>
            <Link to="/product/636d5ca4144878242abc33eb">
              <div>
                <img
                  src="https://dao54xqhg9jfa.cloudfront.net/OMS-Category/34466dbd-a515-edd1-3e99-05000f217cb6/original/Chicken_(2).png"
                />
                <p>
                  <a >Chicken</a>
                </p>
              </div>
            </Link>
            <Link to="/product/636d5d0d144878242abc33ed">
              <div>
                <img
                  src="https://dao54xqhg9jfa.cloudfront.net/OMS-Category/caac432f-545f-f03f-ce10-3b911916da70/original/FIsh_(1).png"
                />
                <p>
                  <a >Fish & Seafood</a>
                </p>
              </div>
            </Link>
            <Link to="/product/636d5d16144878242abc33ef">
              <div>
                <img
                  src="https://dao54xqhg9jfa.cloudfront.net/OMS-Category/3a3d173d-5537-dafc-0be4-dec0791dcd24/original/MUT.png"
                />
                <p>
                  <a >Mutton</a>
                </p>
              </div>
            </Link>
            <Link to="/product/63bc984b7a2a152161ac0217">
              <div>
                <img
                  src="https://dao54xqhg9jfa.cloudfront.net/OMS-Category/21653c3a-4d6d-da71-2432-6833b88e9629/original/RC.png"
                />
                <p>
                  <a >Ready to Cook</a>
                </p>
              </div>
            </Link>
            <Link to="/product/636fe63ffb4172486544289c">
              <div>
                <img
                  src="https://dao54xqhg9jfa.cloudfront.net/OMS-Category/f4053965-f199-80a0-2551-d85d712574e2/original/Prawn_(2).png"
                />
                <p>
                  <a >Prawns</a>
                </p>
              </div>
            </Link>
            <Link to="/product/63bc98867a2a152161ac0219">
              <div>
                <img
                  src="https://dao54xqhg9jfa.cloudfront.net/OMS-Category/49a8dd0c-7254-0b89-b348-b57281c76f5a/original/Coldcuts_(2).png"
                />
                <p>
                  <a >Cold Cuts</a>
                </p>
              </div>
            </Link>
            <Link to="/product/63bc98a27a2a152161ac021b">
              <div>
                <img
                  src="https://dao54xqhg9jfa.cloudfront.net/OMS-Category/d9a97969-ebd7-977c-e676-b343a18d7318/original/SPD.png"
                />
                <p>
                  <a >Spreads</a>
                </p>
              </div>
            </Link>
            <Link to="/product/636d5d22144878242abc33f1">
              <div>
                <img
                  src="https://dao54xqhg9jfa.cloudfront.net/OMS-Category/1bd08fae-c971-390a-ce8a-6f6502f5bd0d/original/Eggs_(1).png"
                />
                <p>
                  <a >Eggs</a>
                </p>
              </div>
            </Link>
            <Link to="/product/636d5d34144878242abc33f3">
              <div>
                <img
                  src="https://dao54xqhg9jfa.cloudfront.net/OMS-Category/0b7ccd0f-0811-c38b-5420-0317c8006bda/original/Biryani_(2).png"
                />
                <p>
                  <a >Biryani & Kebab</a>
                </p>
              </div>
            </Link>
            <Link to="/product/">
              <div>
                <img
                  src="https://dao54xqhg9jfa.cloudfront.net/OMS-Category/69b72338-4180-2631-b175-04265b1e5c7a/original/Combo_(2).png"
                />
                <p>
                  <a >Combos</a>
                </p>
              </div>
            </Link>
            <Link to="/product/">
              <div>
                <Img
                  src="https://dao54xqhg9jfa.cloudfront.net/OMS-Category/66e49926-d949-dfb3-2e79-8052d07f0a3b/original/PBM_6_(8).png"
                />
                <p>
                  <a >Plant-Based-Meat</a>
                </p>
              </div>
            </Link>
          </div>
        </div>
        {/* Shop category */}



        {/* Best seller */}
        <div className="secondDiv" style={{paddingTop:'20px'}}>
          <Text className="category1">Best Sellers</Text>
          <p style={{paddingBottom:'10px'}} className="para">Most popular products near you!</p>
          <Slider2 />
        </div>
        {/* Best seller */}

</div>
    </div>
  );
};

export default Home;
