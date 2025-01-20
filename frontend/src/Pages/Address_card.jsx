import { Heading, HStack, Image, Text, useToast, VStack } from '@chakra-ui/react'
import React from 'react'
import { MdDeleteForever } from 'react-icons/md'
import { useDispatch } from 'react-redux';
import { deleteAddressData, getAddressData } from '../Redux/ProfileRedux/action';

const Address_card = ({ id, bldgno, locality, landmark, city }) => {
    const toast = useToast();
    const dispatch = useDispatch();
    const deleteFromCart = (id, name) => {
        dispatch(deleteAddressData(id))
        dispatch(getAddressData());
        toast({
            position: 'top',
            title: 'Removed Successfully.',
            description: `Address removed.`,
            status: 'success',
            duration: 3000,
            isClosable: true,
        })
    };

    return (
        <div className="border-0 rounded-3 mb-4" style={{ background: '#f9f9f9',width:'100%' }}>
            <div className="p-2 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16">
                    <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"/>
                    <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                    </svg>
                    <div>
                        <h5 className="text-dark" style={{ fontWeight: '600', fontSize: '16px' }}>
                            {bldgno} {locality}, {landmark} {city}
                        </h5>
                    </div>
                </div>

                <div>
                    <button
                        className="btn btn-danger p-2 rounded-circle d-flex align-items-center justify-content-center"
                        onClick={() => deleteFromCart(id)}
                        style={{ width: '35px', height: '35px' }}
                    >
                        <MdDeleteForever color="white" size="20px" />
                    </button>
                </div>
            </div>
        </div>
    )
}
export default Address_card
