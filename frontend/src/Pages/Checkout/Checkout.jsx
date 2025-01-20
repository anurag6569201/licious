import React, { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Box,
  ButtonGroup,
  Button,
  Heading,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Radio,
  Text,
  Slider,
  SliderMark,
  SliderFilledTrack,
  SliderTrack,
  SliderThumb,
  HStack,
  VStack,
  Image,
  RadioGroup,
  Stat,
  useDisclosure,
  Tab,
  TabList,
  Tabs,
  TabPanel,
  TabPanels,
  Stack,
  Show,
} from "@chakra-ui/react";
import "./Checkout.css";
import { MdCheckCircle } from "react-icons/md";
import { useToast } from "@chakra-ui/react";
import Checkout_cart_prod_card from "./Checkout_cart_prod_card";
import Address_card from "../Address_card";
import axios from "axios";
import {
  emptyBasket,
  getAddressData,
  getCartData,
  postAddressData,
  postMyOrdersData,
} from "../../Redux/ProfileRedux/action";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
let totalPrice = 0;
let addressInitial = {
  bldgno: "",
  locality: "",
  landmark: "",
  city: "",
};
const Form1 = () => {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const onCloseModal = () => {
    setIsModalVisible(false);
  };
  const AddAddress = () => {
    setIsModalVisible(true);
  };
  const toast = useToast();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const location = useLocation();
  const [userAdd, setuserAdd] = useState(addressInitial);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAddressData());
  }, [location.search]);
  const address =
    useSelector((state) => state.ProfileReducer.address) || [];
  // console.log(address);
  const handleUserAddDetail = (event) => {
    // event.preventDefault();
    const { name, value } = event.target;
    setuserAdd({
      ...userAdd,
      [name]: value,
    });
  };
  // console.log(userAdd);
  const submitUserAdd = () => {
    let data = {
      bldgno: userAdd.bldgno,
      locality: userAdd.locality,
      landmark: userAdd.landmark,
      city: userAdd.city,
    };
    // console.log(data, "data")
    dispatch(postAddressData(data));
    dispatch(getAddressData());
    toast({
      position: "top",
      title: "Added Successfully.",
      description: `Address Added.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
  return (
    <>
      <Text fontWeight={"bold"} fontSize={"20px"} textAlign={'left'}>
        Saved Addresses
      </Text>
      <Text fontSize={"16px"}  textAlign={'left'}>
        {address?.length} Saved Addresses
      </Text>
      <RadioGroup defaultValue="1">
        <VStack
          mt="2%"
          justifyContent={"start"}
          alignItems={"center"}
          overflowY={"auto"}
          height={"180px"}
        >
          {address?.length > 0 &&
            address?.map((item) => {
              return (
                <Radio
                  width={"100%"}
                  value={item._id}
                  mt="2%"
                  colorScheme={"red"}
                >
                  <Address_card
                    key={item._id}
                    id={item._id}
                    bldgno={item.bldgno}
                    locality={item.locality}
                    landmark={item.landmark}
                    city={item.city}
                  />
                </Radio>
              );
            })}
        </VStack>
      </RadioGroup>
    </>
  );
};
const Form2 = () => {
  let date = new Date();
  let current_time = date.getHours();
  let converted = current_time > 12 ? current_time - 12 : current_time;
  // const location = useLocation();
  const dispatch = useDispatch();
  totalPrice = 0;
  useEffect(() => {
    dispatch(getCartData());
  }, []);
  const cart = useSelector((state) => state.ProfileReducer.cart) || [];
  // console.log(cart);
  return (
    <Box
     >
      <Text textAlign={'left'}>{cart.length} Items Order Summary </Text><br />
      <Box
        padding={"3"}
        height={["350px", "180px", "180px"]}
        overflowY={"auto"}
        borderRadius={"5px"}
      >
        {cart?.length > 0 &&
          cart?.map((item) => {
            totalPrice += Number(item.price);
            return (
              <Checkout_cart_prod_card
                key={item._id}
                id={item._id}
                imgUrl={item.imgUrl}
                name={item.name}
                net={item.net}
                qty={item.qty}
                price={item.price}
              />
            );
          })}
      </Box>
    </Box>
  );
};

const Form3 = () => {
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  useEffect(() => {
    loadRazorpay();
  }, [paymentMethod]); // Reload Razorpay when the user switches payment method

  const loadRazorpay = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  };

  const handlePayment = () => {
    const options = {
      key: "YOUR_RAZORPAY_KEY", // Replace with your Razorpay API Key
      amount: 50000, // Amount in paise (₹500)
      currency: "INR",
      name: "Your Business Name",
      description: `Payment via ${paymentMethod}`,
      handler: function (response) {
        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
        // Add backend call here to verify payment
      },
      prefill: {
        name: "John Doe",
        email: "johndoe@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#d4224f",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <>
      <Button colorScheme="red" mt={4} onClick={handlePayment}>
        Pay via Razorpay
      </Button>
    </>
  );
};
const Stats = () => {
  return (
    <Box
      padding={"15px"}
      width={["95%", "70%", "50%"]}
      borderWidth="1px"
      rounded="lg"
      margin={"auto"}
      boxShadow=" rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
    >
      <Text
        w="100%"
        fontSize={"xl"}
        textAlign={"start"}
        fontWeight="bold"
        mb="2%"
      >
        Bill Details
      </Text>
      <VStack flexWrap={"wrap"} width={"100%"}>
        <HStack
          width={"100%"}
          lineHeight={"14px"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Text>Sub Total</Text> <Text> ₹ {totalPrice}</Text>{" "}
        </HStack>
        <HStack
          width={"100%"}
          lineHeight={"14px"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Text>Discount</Text> <Text>₹ 0</Text>{" "}
        </HStack>
        <HStack
          width={"100%"}
          lineHeight={"14px"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Text>Delivery Charge</Text> <Text>₹ 0</Text>{" "}
        </HStack>
        <Box border={"0.1px solid black"} width={"100%"}></Box>
        <HStack
          fontSize={"l"}
          width={"100%"}
          lineHeight={"14px"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Text>Total</Text> <Text>₹ {totalPrice}</Text>{" "}
        </HStack>
      </VStack>
      <br />
    </Box>
  );
};

export default function Checkout() {
  const [sliderValue, setSliderValue] = React.useState(0);
  const toast = useToast();
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // console.log(show)

  useEffect(() => {
    dispatch(getCartData());
  }, []);

  const cart = useSelector((state) => state.ProfileReducer.cart);
  const URL_MAIN = process.env.REACT_APP_MAIN_URL;
  // console.log(cart);
  console.log('cart data to see',cart);
  const handleSubmit = () => {
    let cart_data_checkout={
      user:'',
      products:cart,
    }
    console.log('cart data checkout',cart_data_checkout)
    dispatch(postMyOrdersData(cart_data_checkout));
    dispatch(emptyBasket(cart));
    console.log(cart,"remaining Products in cart")
    console.log(localStorage.getItem("token"))
    axios.post(URL_MAIN + "/profile/createmyorderprod/", {
        data: cart_data_checkout, headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    }).then((res) => {
        console.log(res)
    }).catch(err => {
        console.log(err)
    })
    navigate("/");
    toast({
      title: "Order Placed Successfully.",
      description: "Check My orders.",
      status: "success",
      position: "top",
      duration: 3000,
      isClosable: true,
    });
  };
  return (
    <>
      <Box className="mainbox" margin={"auto"} mb={"100px"} mt={"10%"}>
        <VStack margin={'auto'}>
          <Box
            paddingY="10px"
            position={"relative"}
            width={['85%', "80%", "80%", "65%"]}>
            <Slider aria-label='slider-ex-2' colorScheme='red' id="slider"
              width={"100%"}
              defaultValue={0}
              min={0}
              max={100}
              // isDisabled
              value={sliderValue}>
              <Show above='850px'>
                <SliderMark
                  value={-5}
                  fontSize="sm">
                  <Text fontWeight={"bold"} fontSize={["10px", "16px", "20px"]}>
                    Address{" "}
                  </Text>
                  Delivery address
                </SliderMark>
                <SliderMark
                  value={42}
                  fontSize="sm">
                  <Text fontWeight={"bold"} fontSize={["10px", "16px", "20px"]}>
                    Summary{" "}
                  </Text>
                  {cart?.length} item in 1 shipments
                </SliderMark>
                <SliderMark
                  value={95}
                  fontSize="sm">
                  <Text fontWeight={"bold"} fontSize={["13px", "16px", "20px"]}>
                    Payment{" "}
                  </Text>
                </SliderMark>
              </Show>
              <SliderTrack dir="ltr"
                position={"absolute"}
                bottom={"0px"}>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb boxSize={6} padding={0}>
                <Box
                  color="green.800"
                  as={MdCheckCircle}
                />
              </SliderThumb>
            </Slider>
          </Box>
          <br />
          <Box
            height={["fit-content", "400px", "fit-content"]}
            borderWidth="1px"
            rounded="lg"
            boxShadow=" rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px"
            width={['75%']}
            position={"relative"}
            margin={"auto"}
            p={6}
            as="form">
            {step === 1 ? <Form1 /> : step === 2 ? <Form2 /> : <Form3 />}
            <ButtonGroup mt="5%" w="100%">
              <Flex
                w="90%"
                justifyContent="space-between"
                position={"absolute"}
                bottom={"5"}
              >
                <Flex>
                  <Button
                    onClick={() => {
                      setStep(step - 1);
                      setSliderValue(sliderValue - 50);
                    }}
                    isDisabled={step === 1}
                    colorScheme={"red"}
                    variant="solid"
                    w="7rem"
                    mr="5%"
                  >
                    Back
                  </Button>
                  <Button
                    w={step == 3 ? 'fit-content' : "7rem"}
                    colorScheme={"red"}
                    onClick={() => {
                      setStep(step + 1);
                      if (step === 3) {
                        // setProgress(100);
                        handleSubmit();
                        setSliderValue(sliderValue + 50);

                      } else {
                        setSliderValue(sliderValue + 50);
                      }
                    }}
                    variant="solid"
                  >{step == 3 ? `Place Order ₹ ${totalPrice}` : "Next"}
                  </Button>
                </Flex>
                {/* {step === 3 ? (
                  <Button
                    w="40%"
                    bg="#d11243"
                    color={"white"}
                    variant="solid"
                    onClick={handleSubmit}
                  >
                    Place Order with Pay ₹ {totalPrice}
                  </Button>
                ) : null} */}
              </Flex>
            </ButtonGroup>
          </Box>
        </VStack>
        <br />
        <Stats />
      </Box>
    </>
  );
}
