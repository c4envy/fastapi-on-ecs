import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import theme from "./theme/theme";
import { CookiesProvider } from "react-cookie";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </ChakraProvider>
  </React.StrictMode>
);
