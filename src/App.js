import React, { Suspense } from 'react'
import './App.css';
import { Box, Spinner } from '@chakra-ui/react'
import { Routes, Route } from 'react-router-dom';
const Home = React.lazy(() => import("./Components/Pages/Home"));
const Chat = React.lazy(() => import("./Components/Pages/Chat"));

function App() {

  // const Loader = (
  //   <Box w="100%" display="flex" justifycontent="center">
  //     <Spinner size='xl' />
  //   </Box>
  // )

  return (
    <div className="App">
      <Suspense fallback={
        <Box w="100%" display="flex" justifyContent="center" mt="45vh">
          <Spinner thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl' />
        </Box>
      }>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chats" element={<Chat />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
