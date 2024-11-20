import React from "react";
import { UserProvider } from "../contexts/userContext";
import { ProductProvider } from "../contexts/porductContext";

export const CombinedContextProvider = ({ children }) => {
  return (
    <UserProvider>
      <ProductProvider>{children}</ProductProvider>
    </UserProvider>
  );
};

