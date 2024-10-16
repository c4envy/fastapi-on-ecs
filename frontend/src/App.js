import React from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { Authenticated } from "./components/Auth/Authenticated";
import  Login  from "./components/Auth/Login";
import { PublicRoute } from "./components/Auth/PublicRoute";
import NavBar from "./components/Navbar/NavBar";
import { TodoDetail } from "./components/Todo/TodoDetail";
import { TodoList } from "./components/Todo/TodoList";
import { AuthConsumer, AuthProvider } from "./context/JWTAuthContext";
import Home from "./components/Home/Home";
import MusicForms from "./components/Music/MusicForms";
import RegisterLayout from "./components/Auth/RegisterLayout";
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import ArtistTracks from "./components/Dashboard/artist/ArtistTracks";
import ArtistProfile from "./components/Dashboard/artist/ArtistProfile";
import Cart from "./components/Home/Cart";
import { CartProvider } from "./context/CartContext";
import Track from "./components/Home/Track";
import { Flex, Spinner } from "@chakra-ui/react";
import Artist from "./components/Home/Artist";
import FanProfile from "./components/Dashboard/fan/FanProfile";
import Checkout from "./components/Home/Checkout";
import OrderConfirmation from "./components/Home/OrderConfirmation";
import Faq from "./components/Navbar/Faq";
import About from "./components/Home/About";
import Documents from "./components/Dashboard/Documents";
import Portfolio from "./components/Dashboard/Portfolio";
import Transaction from "./components/Dashboard/Transaction";
import StreamingCalculator from "./components/streaming-calculator/StreamingCalculator";
import Browse from "./components/Home/Browse";
import OtpVerification from "./components/Auth/OtpVerification";
import PasswordReset from "./components/Auth/PasswordReset";
import { MusicPlayerProvider } from "./context/MusicPlayerContext";

function App() {
  return (
    <>
      <CartProvider>
        <AuthProvider>
          <MusicPlayerProvider>
          <Router>
            <AuthConsumer>
              {(auth) =>
                !auth.isInitialized ? (
                  <Flex height="100vh" alignItems="center" justifyContent="center">
                    <Spinner thickness="4px" speed="0.65s" emptyColor="primary.100" color="secondary.500" size="xl" />
                  </Flex>
                ) : (
                  <Routes>
                    <Route path="/" element={<NavBar />}>
                      <Route path="/browse" element={<Browse/>} />
                      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                      <Route path="/register" element={<PublicRoute><RegisterLayout /></PublicRoute>} />
                      <Route path="/otp-verify/:userId/:email/:phone" element={<OtpVerification />} />
                      <Route path="/reset-password" element={<PasswordReset />} />
                      <Route path="/faq" element={<Faq/>} />
                      <Route path="/about" element={<About/>} />
                      <Route path="/" element={<Home />} />
                      <Route path="/create-music" element={<Authenticated><MusicForms /></Authenticated>} />
                        {/* <Route path="add-track" element={<Authenticated><AddTrack /></Authenticated>} />
                        <Route path="add-tracks" element={<Authenticated><AddTracks /></Authenticated>} /> */}
                      {/* </Route> */}
                      <Route path="/todos" element={<Authenticated><TodoList /></Authenticated>} />
                      <Route path="/todos/:todoId" element={<Authenticated><TodoDetail /></Authenticated>} />
                      <Route path="/dashboard" element={<Authenticated><DashboardLayout /></Authenticated>}>
                        
                          <Route path="/dashboard/artist/profile" element={<Authenticated><ArtistProfile/></Authenticated>} />
                          <Route path="/dashboard/artist/tracks" element={<Authenticated><ArtistTracks/></Authenticated>} />
                          <Route path="/dashboard/artist/documents" element={<Authenticated><Documents/></Authenticated>} />
                   
                          <Route path="/dashboard/merchant/profile" element={<Authenticated><ArtistProfile/></Authenticated>} />
                          <Route path="/dashboard/merchant/tracks" element={<Authenticated><ArtistTracks/></Authenticated>} />
                          <Route path="/dashboard/merchant/documents" element={<Authenticated><Documents/></Authenticated>} />

                   
                          <Route path="/dashboard/fan/profile" element={<Authenticated><FanProfile/></Authenticated>} />
                          <Route path="/dashboard/collections" element={<Authenticated><Portfolio/></Authenticated>} />
                          <Route path="/dashboard/transactions" element={<Authenticated><Transaction/></Authenticated>} />
                   
                        {/* <Route path="merchant">
                          <Route path="profile" element={<MerchantProfile />} />
                          <Route path="tracks" element={<MerchantTracks />} />
                        </Route>
                        <Route path="fan">
                          <Route path="profile" element={<FanProfile />} />
                          <Route path="collection" element={<Collection />} />
                        </Route> */}
                      </Route>


                      <Route path="/cart" element={<Cart />} />
                      <Route path="/streaming-calculator/:id" element={< StreamingCalculator/>} />
                      <Route path="/checkout" element={<Authenticated><Checkout /></Authenticated>} />
                      <Route path="/order-confirmation" element={<Authenticated><OrderConfirmation /></Authenticated>} />
                      {/* Add route for the Track component */}
                      <Route path="/track/:trackId" element={<Track />} />
                      <Route path="/artist/:artistId" element={<Artist />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                )
              }
            </AuthConsumer>
          </Router>
          </MusicPlayerProvider>
        </AuthProvider>
      </CartProvider>
    </>
  );
}

export default App;
