import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Flex, Heading, IconButton, Menu, MenuButton, MenuItem, MenuList, Table, TableCaption, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Tr, useDisclosure } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useChat } from "../ChatContext";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { IoLogOut } from "react-icons/io5";
import axios from "axios";

const AdminDashboard = () => {

    const { username, logout } = useChat();
    const [userData, setUserData] = useState([]);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();

    const navigate = useNavigate();

    const handleLogout = async () => {
    
        try {
            await axios.post("http://localhost:5000/logout",{}, { withCredentials: true });
            logout();
            navigate("/");
        } catch (err) {
            console.log(err);
        }

    };

    const userdata = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getallusers', { withCredentials: true });
            console.log(response.data);
            setUserData(response.data);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        userdata();
    }, []);


    return (
        <Flex h="100vh" bgColor="#1A202C" flexDir="column" alignItems={'center'} gap={4} >
            <Flex bg={'#171923'} h={'90px'} w={'100%'} >
                <Flex bg={'#171923'} w={'100%'} justifyContent={'flex-end'} alignItems={'center'}>

                    <Menu >
                        <MenuButton
                            as={IconButton}
                            aria-label='Options'
                            icon={<FaUser />}
                            variant='outline'
                            mr={'10px'}
                            bgColor={"#1A202C"}
                            color="white"
                            border={'none'}
                            _hover={"none"}

                        />
                        <Text color={'white'} mr={'20px'}> {username}</Text>
                        <MenuList bgColor={"#171923"} border={'none'}>
                            {/* <MenuItem icon={<AddIcon />} onClick={onEditOpen} bgColor={"#171923"} color={"white"}>
                                            Add File
                                        </MenuItem> */}
                            <MenuItem icon={<IoLogOut size={19} />} onClick={onOpen} bgColor={"#171923"} color={"white"}>
                                Log Out
                            </MenuItem>
                        </MenuList>
                    </Menu>

                    <AlertDialog
                        isOpen={isOpen}
                        leastDestructiveRef={cancelRef}
                        onClose={onClose}

                    >
                        <AlertDialogOverlay>
                            <AlertDialogContent bgColor={"#2D3748"} color={"white"}>
                                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                    Log out
                                </AlertDialogHeader>

                                <AlertDialogBody>
                                    Are you sure?
                                </AlertDialogBody>

                                <AlertDialogFooter>
                                    <Button ref={cancelRef} onClick={onClose}>
                                        Cancel
                                    </Button>
                                    <Button
                                        colorScheme='red'
                                        onClick={async () => {
                                            onClose();
                                            await handleLogout();  // ✅ Ensure async execution
                                        }}
                                        ml={3}
                                    >
                                        Log Out
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialogOverlay>
                    </AlertDialog>


                    {/* <AlertDialog
                                    motionPreset='slideInBottom'
                                    leastDestructiveRef={editCancelRef}
                                    onClose={onEditClose}
                                    isOpen={isEditOpen}
                                    isCentered
                                >
                                    <AlertDialogOverlay />
            
                                    <AlertDialogContent bgColor={"#2D3748"} color={"white"}>
                                        <AlertDialogHeader>Upload a file</AlertDialogHeader>
                                        <AlertDialogCloseButton />
                                        <AlertDialogBody>
                                            <input type="file" name="avatar" ref={fileInputRef} onChange={handleFileChange} />
                                        </AlertDialogBody>
                                        <AlertDialogFooter>
                                            <Button ref={editCancelRef} onClick={onEditClose}>
                                                Cancel
                                            </Button>
                                            <Button colorScheme='red'  ml={3} onClick={handleFileSubmit}>
                                                Submit
                                            </Button>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog> */}


                </Flex>
            </Flex>

            <Flex w="100%" flexDir={'column'} >

                <Box textAlign="center" w={"50%"}>
                    <Heading as="h3" size="lg" color="white">
                        User List
                    </Heading>
                </Box>

                <TableContainer w={"50%"} textAlign={'center'}>
                    <Table variant='simple' color={'white'} border={'1px solid white'} >

                        <Thead  >
                            <Tr color={'white'}>
                                <Th color={'white'} textAlign="center">User Name</Th>
                                <Th color={'white'} textAlign="center">Email </Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {userData.map((user, index) => (
                                <Tr key={index}>
                                    <Td textAlign="center"
                                        cursor="pointer"
                                        onClick={() => navigate(`/admindashboard/${user.userid}`)}
                                    >
                                        {user.username}</Td>
                                    <Td textAlign="center"
                                        cursor="pointer"
                                        onClick={() => navigate(`/admindashboard/${user.userid}`)}
                                    >{user.emailid}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Flex>

        </Flex>
    )
}

export default AdminDashboard;