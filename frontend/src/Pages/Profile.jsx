import React, { useState, useEffect, useRef } from 'react';
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Center, Divider, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, FormLabel, HStack, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Slider, SliderFilledTrack, SliderTrack, Stack, Text, UnorderedList, useDisclosure, useToast, VStack, Wrap } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { getAddressData, getMyOrdersData, getProfileData, patchProfileData, postAddressData } from '../Redux/ProfileRedux/action';
import Address_card from './Address_card';
import MyOrders_Card from './MyOrders_Card';
import profile_logo from '../Components/footer/image.png';
import '../Style/profile.css'

let addressInitial = {
    bldgno: "",
    locality: "",
    landmark: "",
    city: ""
};
let userInitial = {
    first_name: "",
    last_name: "",
};

const Profile = () => {

    const Profile = useSelector((state) => state.ProfileReducer.profile) || null;
    const MyOrder = useSelector((state) => state.ProfileReducer.myOrders) || null;
    const Address = useSelector((state) => state.ProfileReducer.address) || null;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const firstField = useRef();
    const [userDetail, setuserDetail] = useState(userInitial);
    const [userAdd, setuserAdd] = useState(addressInitial);
    const dispatch = useDispatch();
    const [firstName, setFirstName] = useState(Profile?.first_name);
    const [lastName, setLastName] = useState(Profile?.last_name);
    const toast = useToast();

    useEffect(() => {
        dispatch(getProfileData());
        dispatch(getAddressData());
        dispatch(getMyOrdersData());
    }, [dispatch]);

    const AddAddress = () => {
        setIsModalVisible(true);
    };

    const onCloseModal = () => {
        setIsModalVisible(false);
    };

    const handleUserDetail = (event) => {
        const { name, value } = event.target;
        setuserDetail({
            ...userDetail,
            [name]: value
        });
    };

    const submitUserDetails = () => {
        let data = {
            first_name: firstName,
            last_name: lastName,
        };
        dispatch(patchProfileData(data));
        dispatch(getProfileData());
        toast({
            position: 'top',
            title: 'Updated Successfully.',
            description: `User Details Updated.`,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };

    const handleUserAddDetail = (event) => {
        const { name, value } = event.target;
        setuserAdd({
            ...userAdd,
            [name]: value
        });
    };

    const submitUserAdd = () => {
        let data = {
            user:Profile.id,
            name:Profile.username,
            email:Profile.email,
            bldgno: userAdd.bldgno,
            locality: userAdd.locality,
            landmark: userAdd.landmark,
            city: userAdd.city
        };
        dispatch(postAddressData(data));
        dispatch(getAddressData());
        toast({
            position: 'top',
            title: 'Added Successfully.',
            description: `Address Added.`,
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };

    return (
        <>
            <div className='container p-0 main_profile_card' style={{ marginTop: '100px', width: '75%', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="profile_logo">
                        <img width={50} height={50} style={{ borderRadius: '50%' }} src={profile_logo} alt="" />
                    </div>
                    <div className="profile_header w-100">
                        <h1 style={{ textAlign: 'left', fontSize: '25px', fontWeight: '600' }}>{Profile?.username}</h1><hr />
                        <h1><span>{Profile?.first_name} {Profile?.last_name} | </span> <span>{Profile?.email}</span> <span onClick={onOpen}>Edit Profile</span></h1>
                    </div>
                </div>
                <div className="profile_space mt-4">
                    <Accordion allowMultiple>
                        <AccordionItem borderRadius={"5px"}>
                            <h3>
                                <AccordionButton padding="7px 0">
                                    <Box color='#d11243' flex='1' textAlign='left'>
                                        My Orders
                                    </Box>
                                    <AccordionIcon color={"#d11243"} />
                                </AccordionButton>
                            </h3>
                            <AccordionPanel pb={4}>
                                <Box flex='1' textAlign='left'>
                                    {MyOrder?.length > 0 && MyOrder?.map((item) => {
                                        console.log("my order",MyOrder)
                                        return <MyOrders_Card key={item.id} data={item.products} time={item.created_at} />
                                    })}
                                </Box>
                            </AccordionPanel>
                        </AccordionItem>
                        <AccordionItem borderRadius={"5px"}>
                            <h3>
                                <AccordionButton padding="7px 0">
                                    <Box color='#d11243' flex='1' textAlign='left'>
                                        Saved Address
                                    </Box>
                                    <AccordionIcon color={"#d11243"} />
                                </AccordionButton>
                            </h3>
                            <AccordionPanel pb={4} padding="0">
                                <VStack borderRadius={"10px"} padding={"10px"}  border={"1px solid red"} justifyContent={"flex-start"} alignItems={"flex-start"}>
                                    <HStack width={"100%"} justifyContent={'space-between'}>
                                        <Text>Saved Address</Text>
                                        <Button alignSelf={"end"} bg={"#d11243"} size={"md"} padding={"8px"} color={"white"} onClick={AddAddress}>Add New Address</Button>
                                    </HStack>
                                    {Address?.length > 0 ? (
                                        Address.map((item) => (
                                            <Address_card key={item.id} id={item.id} bldgno={item.bldgno} locality={item.locality} landmark={item.landmark} city={item.city} />
                                        ))
                                    ) : (
                                        <Text>No addresses found.</Text>
                                    )}
                                </VStack>
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>

            {/* Drawer Component */}
            <Drawer
                isOpen={isOpen}
                placement='right'
                initialFocusRef={firstField}
                size={"sm"}
                onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth='1px'>
                        Update Profile
                    </DrawerHeader>

                    <DrawerBody>
                        <Stack spacing='24px' padding="0 20px">
                            <Box>
                                <div className="container mt-4" style={{ display: 'flex', justifyContent: 'center' }}>
                                    <div className="profile_logo">
                                        <img width={200} height={200} style={{ borderRadius: '50%' }} src={profile_logo} alt="" />
                                    </div>
                                </div>
                            </Box>

                            <Box height={'fit-content'} width={"100%"} padding={"8px"} borderRadius={"5px"} boxShadow="rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px" display={Profile?.first_name && Profile?.last_name ? 'none' : 'block'}>
                                <HStack justifyContent={"space-between"}>
                                    <Text fontSize={"13px"} lineHeight={"13px"}>Complete Your Profile</Text>
                                    <Text fontSize={"13px"} lineHeight={"13px"}>86% Done</Text>
                                </HStack>
                                <Slider aria-label='slider-ex-2' colorScheme='red' defaultValue={86}>
                                    <SliderTrack>
                                        <SliderFilledTrack />
                                    </SliderTrack>
                                </Slider>
                            </Box>

                            <Box>
                                <FormLabel fontSize={"13px"} htmlFor='First Name'>First Name</FormLabel>
                                <Input name="firstName" onChange={(e) => setFirstName(e.target.value)}
                                    type={"text"}
                                    value={firstName}
                                    placeholder='Please enter First Name'
                                />
                            </Box>
                            <Box>
                                <FormLabel fontSize={"13px"} htmlFor='Last Name'>Last Name</FormLabel>
                                <Input name="lastName" onChange={(e) => setLastName(e.target.value)}
                                    type={"text"}
                                    value={lastName}
                                    placeholder='Please enter Last Name'
                                />
                            </Box>
                            <Box>
                                <FormLabel fontSize={"13px"} htmlFor='Email'>Email</FormLabel>
                                <Input name="email" onChange={handleUserDetail}
                                    type={"email"}
                                    ref={firstField}
                                    id='email'
                                    value={Profile?.email}
                                    placeholder='Please enter Email ID'
                                    readOnly
                                />
                            </Box>
                            <Box>
                                <Button onClick={() => {
                                    onClose();
                                    submitUserDetails();
                                }} width={"100%"} bg={"#d11243"} color='#ffffff'>
                                    Submit
                                </Button>
                            </Box>
                        </Stack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            {/* Address modal */}
            {
                isModalVisible && <>
                    <Modal isOpen={isModalVisible}>
                        <ModalOverlay />
                        <ModalContent padding="10px">
                            <ModalHeader paddingLeft="0" paddingTop="0" color=''>Add New Address </ModalHeader>
                            <ModalCloseButton onClick={onCloseModal} />
                            <ModalBody>
                                <VStack gap={3}>
                                    <Input onChange={handleUserAddDetail} name='bldgno' placeholder='Flat no. / Building Name / Street no.' _placeholder={{ color: '#d11243' }} />
                                    <Input onChange={handleUserAddDetail} name='locality' placeholder='Enter Your Locality' _placeholder={{ color: '#d11243' }} />
                                    <Input onChange={handleUserAddDetail} name='landmark' placeholder='landmark ' _placeholder={{ color: '#d11243' }} />
                                    <Input onChange={handleUserAddDetail} name='city' placeholder='city' _placeholder={{ color: '#d11243' }} />
                                </VStack>
                            </ModalBody>
                            <ModalFooter>
                                <Button bg={"#d11243"} color='#ffffff' mr={3} onClick={() => {
                                    submitUserAdd()
                                    onCloseModal()
                                }}>
                                    Save
                                </Button>
                                <Button bg={"#d11243"} color='#ffffff' mr={3} onClick={onCloseModal}>
                                    cancel
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </>
            }
            {/* Drawer Component */}

        </>
    );
};

export default Profile;
