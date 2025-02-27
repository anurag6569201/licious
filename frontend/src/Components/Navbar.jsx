import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Fade,
  HStack,
  Img,
  MenuDivider,
  Show,
  Skeleton,
  SlideFade,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import Signup from "../Pages/Signup";
import "./Navbar.css";
import {
  Box,
  Flex,
  Text,
  Image,
  Button,
  Input,
} from "@chakra-ui/react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import LICIOUS from "./D'LICIOUS.jpeg";
import axios from "axios";
import { MdOutlineAccountCircle } from 'react-icons/md'
import Cart from "../Pages/Cart";
import { NavbarMobTab } from "./NavbarMobTab";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../Redux/ProductsRedux/action";


const MiddleNavbar = () => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const { isOpen, onOpen, onToggle1, onClose } = useDisclosure();
  const Api_start = `https://api.openweathermap.org/data/2.5/weather?`;
  const Api_key = `566cee1b29349fab7cfc8dfe8ff9e2fc`;
  const navigate = useNavigate()
  const btnRef = React.useRef()

  const [Latitude, setLatitude] = useState("");
  const [Longitude, setLongitude] = useState("");
  const [city, setCity] = useState("");

  const products = useSelector((state) => state.ProductReducer.allProducts.data) || [];
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [SuggestionList, setSuggestionList] = useState([])
  const dispatch = useDispatch();


  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    },);
    let finalApi_EndPoint = `${Api_start}lat=${Latitude}&lon=${Longitude}&appid=${Api_key}`;

    axios.get(finalApi_EndPoint).then((res) => {
      setCity(res.data.name);
    });
  }, [Latitude, Longitude]);

  useEffect(() => {
    dispatch(getAllProducts());
    if (query === "") {
      setSuggestionList([])
    } else {
      let newSuggestionList = products.filter((item) => {
        let queryItem = query.trim().toLowerCase();
        return item?.name?.toLowerCase().indexOf(queryItem) !== -1 ? true : false
      })
        .map((item) => item);
      setSuggestionList(newSuggestionList);
    }
  }, [query])
  const backend_url=process.env.REACT_APP_MAIN_URL
  const [categories, setCategories] = useState([]);

  useEffect(() => {
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
  let handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    localStorage.removeItem("isAdmin");
    return navigate("/")
  };

  return (
    <Box className="MiddleNavbar-main">
      <Flex style={{ gap: "20px", alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Link to="/"> <Image width="70px" src={LICIOUS} /> </Link>
        </Box>
        <Box>
          <Flex>
            <Image className="MiddleNavbar_location" src="https://www.licious.in/image/rebranding/svg/location-pin.svg" />
            <Text>{city ? city : <Button>Choose City</Button>}</Text>
          </Flex>
        </Box>
      </Flex>

      <Box width="30%" position={'relative'}>
        <Input value={query} onChange={(e) => setQuery(e.target.value)} borderColor="gray" variant="filled" size={["sm", "md", "md"]} placeholder="Search for any delicious product" />
        {SuggestionList.length > 0 ?
          <VStack borderColor="gray" border={"3px"} className="style-3" backgroundColor={"white"} borderBottomRadius='5px' padding={'10px'} width={"100%"} position={'absolute'} top={12} height={"fit-content"} maxHeight={'350px'} overflow={'auto'} >
            {SuggestionList.map((elem) => {
              return <Link to={`/productdetails/${elem.food_id}`} onClick={() => {
                setSuggestionList([])
                setQuery("")
              }}>
                <HStack textAlign={'left'} key={elem.food_id} >
                  <Img src={elem.imgUrl} alt={elem.name} width={"20%"} />
                  <Text fontSize={'14px'}>{elem.name}</Text>
                </HStack>
              </Link>
            })
            }
          </VStack>
          // :
          // SuggestionList.length > 0 ?
          //   <VStack padding={'20px'}>
          //     <Img width={"50%"} src="https://www.licious.in/img/rebranding/no_prod_found_illustration.svg" alt="not found" />
          //     <p>Oops, we couldn’t find any search results
          //       Try refining your search or explore from the below suggestions</p>
          //   </VStack>
          :
          ""
        }
      </Box>

      <Flex style={{
        alignItems: "center", justifyContent: "space-between",
        gap: "12%", width: "30%"
      }}>
        <Box>
          <Menu>
            {({ isOpen }) => (
              <>
                <MenuButton isActive={isOpen}>
                  {
                    <Flex>
                      <Image src="https://www.licious.in/image/rebranding/svg/categories-grey.svg" />
                      <Text padding="5px" _hover={{ color: "#D11243" }}>Categories</Text>
                    </Flex>
                  }
                </MenuButton>
                <MenuList style={{ padding: "5%" }}>
                  {categories.map((el) => {
                    return <MenuItem>
                      <Link to={`/product/${el.product_id}`} style={{ display: "flex", alignItems: "center" }}>
                        <Image width="35px" src={el.imgSrc} />
                        <Text>&nbsp;{el.name}</Text>
                      </Link>{" "}
                    </MenuItem>
                  })}
                </MenuList>
              </>
            )}
          </Menu>


        </Box>
        <Box>
          <Flex>
            <Image src="https://www.licious.in/image/rebranding/svg/profile-grey.svg" />
            <Text _hover={{ color: "#D11243" }}> {
              localStorage.getItem("token") == undefined ? <Button padding="5px" variant="link" onClick={onOpen}>Login</Button>
                : <Menu>
                  <MenuButton
                    aria-label="Options"
                    icon={<MdOutlineAccountCircle size={"50px"} />}
                    variant=""
                  >Profile</MenuButton>
                  <MenuList>
                    <Link to="/profile">
                      <MenuItem icon={""}>
                        Profile
                      </MenuItem>
                    </Link>

                  {isAdmin ? (
                      <Link to="/attendance">
                        <MenuItem icon={""}>
                          Attendance
                        </MenuItem>
                      </Link>
                    ) : (
                      <MenuItem icon={""} style={{ cursor: "not-allowed", opacity: 0.5 }}>
                        Attendance (Restricted)
                      </MenuItem>
                    )}

                    <MenuDivider />
                    <MenuItem onClick={handleLogout} icon={""}>
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
            }</Text>
          </Flex>
        </Box>
        <Box className="cart-box">
          <Cart />
        </Box>
      </Flex>

      {/* signup Drawer start */}
      <Drawer size={"sm"} finalFocusRef={btnRef}
        isOpen={isOpen} placement='right' onClose={onClose} >
        <Box>
          <DrawerOverlay />
          <DrawerContent >
            <DrawerCloseButton size='lg' />
            <DrawerBody>
              <Signup onClose={onClose}/>
            </DrawerBody>
          </DrawerContent>
        </Box>
      </Drawer>
    </Box >

  );
};


const Navbar = () => {
  return (
    <Box className="Navbar-Main">
      <Show above='850px'>
        <MiddleNavbar />
      </Show>

      <Show below="850px">
        <NavbarMobTab />
      </Show>

    </Box>
  );
};

export default Navbar;













