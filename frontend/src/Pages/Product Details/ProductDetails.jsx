import React, { useEffect, useState } from "react";
import "./ProductDetails.css";
import { Box, Image, Text, Divider, Button, Flex, Spacer, useToast } from "@chakra-ui/react";
import liciousImg from './Images/licious.PNG'
import yes from './Images/yes.png'
import { Slide } from "react-slideshow-image";
import YoutubeVideoPlayer from "./YoutubePlayes";
import no from './Images/no.png';
import './slider.css';
import 'slick-carousel/slick/slick.css';
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCartData, postCartData } from "../../Redux/ProfileRedux/action";
import axios from "axios";
import CarousalProductDetails from "./CarousalProductDetails";
import Slider2 from "../Boneless_Slider";

const zoomOutProperties = {
  duration: 1500,
  transitionDuration: 1000,
  infinite: true,
  indicators: true,
  scale: 0.4,
  arrows: true,
};

const Slideshow = ({ img1, img2 }) => {
  // const images = [
  //   "https://dao54xqhg9jfa.cloudfront.net/OMS-ProductMerchantdising/a9115623-36e0-7a11-4c65-0f7a097c2d27/original/WhatsApp_Image_2022-06-10_at_12.37.50_PM_(1).jpeg?format=webp",
  //   "https://dao54xqhg9jfa.cloudfront.net/OMS-ProductMerchantdising/d49aac35-6784-73e1-93ff-ac738c240f15/original/Chicken-Breast-Boneless-(3-4-Pieces)-Hero-Shot_(1).jpg?format=webp",
  // ];
  const images = [img1, img2];
  return (
    <div className="slide-container">
      <Slide className=".slide-img" {...zoomOutProperties}>
        {images.map((each, index) => (
          <Image
            key={index}
            style={{
              width: "100%",
              objectFit:'cover',
              borderRadius:'10px',
              height:'300px',
            }}
            src={each}
          />
        ))}
      </Slide>
    </div>
  );
};


// Carosul  ***************
const ProductDetails = () => {
  const [currentProduct, setCurrentProduct] = useState({});
  const [datamap, setdatamap] = useState([]);
  const { id } = useParams();
  const products = useSelector((state) => state.ProductReducer.allProducts.data)
  const dispatch = useDispatch();
  const toast = useToast();
  const [addedItems, setAddedItems] = useState({});
  const backend_url=process.env.REACT_APP_MAIN_URL
  // console.log(products, "products")
  const getdata1 = async () => {
    axios.get(backend_url+"/fooditems/get?format=json").then((res) => {
      let newdata = res.data.data
      setdatamap(newdata)
    })
  };
  // ****************
  //******** */ add to cart function from button addToCart
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
  //********end add to cart function from button addToCart


  useEffect(() => {
    if (id) {
      // const products = data.ProductReducer.products;
      const productById = products?.filter(
        (product) => product.food_id == id
      );
      productById && setCurrentProduct(productById[0]);
    }
    getdata1();
  }, [id]);
  // console.log(currentProduct, "detail")

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




  const [isExpanded, setIsExpanded] = useState(false);

  if (!currentProduct?.desc) {
    return <p>No description available</p>;
  }

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };


  return (
    <Box className="productDetails-main">

      <Box className="sizeChange">

        <Box className="img-desc">
          <Box className="slide-img">
            <Slideshow img1={currentProduct.imgUrl} img2={currentProduct.imgUrl2} />
          </Box>
          <Box className="desc-main">
            <Box>
              <Text fontSize={["xl", "2xl", "3xl"]} fontWeight="500" style={{ textAlign: "left" }}>
                {" "}
                {currentProduct.name}
              </Text>
            </Box>

            <Box fontSize={["15px", "18px", "20px"]}
              style={{
                display: "flex",
                gap: "5%",
              }}
            >

              <Box fontSize={['13px', '16px', "19px"]}>
                {currentProduct.tags}
              </Box>
            </Box>

            <Box className="quantity">
              <Box
                style={{
                  display: "flex",
                  textAlign: "center",
                }}
              >

                <Image
                  width="20px"
                  src="https://d2407na1z3fc0t.cloudfront.net/Banner/Pieces.png"
                />
                <Text style={{ paddingLeft: "1%" }}>No. of Pieces {currentProduct.qty}</Text>
              </Box>
              <Box style={{
                display: "flex",
                textAlign: "center"
              }}>
                <Image
                  width="20px"
                  src="https://d2407na1z3fc0t.cloudfront.net/Banner/Serves.png"
                />
                <Text style={{ paddingLeft: "1%" }}>Serves {Math.floor(Math.random() * 8 + 1)}</Text>
              </Box>

              <Box style={{
                display: "flex",
                textAlign: "center"
              }}>

                <Image
                  width="20px"
                  src="https://d2407na1z3fc0t.cloudfront.net/Banner/Netwt.png" />
                <Text style={{ paddingLeft: "1%" }}>{currentProduct.net}</Text>
              </Box>
            </Box>


            <Box fontSize={['15px', '15px', "15px"]}
              style={{ textAlign: "justify", color: "#5A5A5A" }}>
            <Text style={{ paddingTop: "3%" }}>
            {isExpanded ? currentProduct.desc : `${currentProduct.desc.substring(0, 100)}`}
            {currentProduct.desc.length > 100 && (
              <span
                onClick={toggleReadMore}
                style={{ color: "#d11243", cursor: "pointer", marginLeft: "5px" }}
              >
                {isExpanded ? " Read Less" : " Read More"}
              </span>
            )}

            </Text>

              
            </Box>



            <Box className="price-addtwocard-main">

              <div style={{lineHeight:'20px',marginTop:'10px',marginBottom:'10px'}}>
              <Flex style={{ alignItems: "center" }}>

              <Text color='#444' fontSize={['15px', '15px', "15px"]} fontWeight='500'><span>MRP:</span> </Text>
              <Text color='#D11243' fontSize={['15px', '15px', "20px"]} fontWeight='500'> ₹{currentProduct.price} </Text>
              </Flex>
              <span>(incl. of all taxes)</span>
              </div>
              

              <Box style={{ marginLeft: "30%" }}>
              <Button bg={"#D11243"} color="white" _hover={{ color: "black" }}
                  paddingX={"18px"} onClick={() => addToCart(currentProduct, currentProduct.name)} style={{fontSize:'18px',backgroundColor: addedItems[currentProduct.name] ? "gray" : "#D11243",}} disabled={addedItems[currentProduct.name]}>
                  {addedItems[currentProduct.name] ? "Added" : "Add to Cart"}
                </Button>
                {/* <ADDTOCARTBUTTON/> */}
              </Box>
            </Box>
            <Divider borderColor="silver" />


            <Flex style={{ justifyContent: "space-between", textAlign: "center", alignItems: "center" }}>
              <Box><YoutubeVideoPlayer /></Box>

              <Flex style={{ textAlign: "center", alignItems: "center" }}>
                <Image width="30px" src="https://www.licious.in/image/rebranding/png/Scooter_express.png" />
                <Text fontSize="xl" color='gray'>Today in &nbsp;</Text>
                <Text fontSize="xl" style={{ color: "gray", fontWeight: "600" }}> 90 min</Text>

              </Flex>
            </Flex>

          </Box>
        </Box>
        <br />
            <hr />
            <br /><br />
        <section class="sourcing-container">
          <div class="image-container">
              <img src={liciousImg} alt="Licious Sourcing Image" class="sourcing-image"/>
          </div>

          <div class="sourcing-box">
              <div class="headings">
                <h3 class="sub-title">What's in your Box</h3>
              </div>

              <hr class="divider"/>

              <div class="details">
                  
                  <ul class="features-list">
                      <li><img src={yes} alt="yes"/> Chicken humanely raised in bio-secure zones</li>
                      <li><img src={yes} alt="yes"/> Hand-selected after age and weight calibration</li>
                      <li><img src={yes} alt="yes"/> 100% vegetarian fed</li>
                      <li><img src={yes} alt="yes"/> Free from antibiotic residue and hormones</li>
                      <li><img src={yes} alt="yes"/> Hygienically vacuum-packed</li>
                      <li><img src={yes} alt="yes"/> Artisanal cut</li>
                      <li class="not-included"><img src={no} alt="no"/> Mix of Offal Organs</li>
                  </ul>
              </div>
          </div>
      </section>







        {/* 
the deliciousBox way box start */}
        <Box className="DLicious-way">


          <Box style={{ width: "50%", margin: "auto" }}>

            <Flex className="theDeliciousWay">
              <Text color='gray.600'>The&nbsp;</Text>
              <Text fontWeight='600' style={{ color: "#D11243" }}>Delicious&nbsp;</Text>
              <Text color='gray.600'>way</Text>
            </Flex>
          </Box>




          <Box className="deliciousBox">


            <Box>
              <Image src="https://www.licious.in/image/rebranding/png/USP1.png" />
              <Text fontSize='sm' className="spaceing">Premium produce, sourced directly from the origin</Text>
            </Box>

            <Box>
              <Image src="https://www.licious.in/image/rebranding/png/USP2.png" />
              <Text fontSize='sm' className="spaceing">Scientifically designed central production Unit</Text>
            </Box>

            <Box>
              <Image src="https://www.licious.in/image/rebranding/png/USP3.png" />
              <Text fontSize='sm' className="spaceing">Compliance to stringent quality checks</Text>
            </Box>

            <Box>
              <Image src="https://www.licious.in/image/rebranding/png/USP4.png" />
              <Text fontSize='sm' className="spaceing">Delivered fresh everyday</Text>
            </Box>
            <Box>
              <Image src="https://www.licious.in/image/rebranding/png/USP5.png" />
              <Text fontSize='sm' className="spaceing">Experience extraordinary cooking</Text>
            </Box>







          </Box>






        </Box>

        {/* 
the deliciousBox way box end */}




<div className="secondDiv" style={{paddingTop:'20px'}}>
  <Text className="category1" style={{paddingBottom:'10px',fontWeight:'600'}}>You may also like</Text>
  <Slider2 />
</div>






      </Box>

    </Box>
  );
};

export default ProductDetails;
