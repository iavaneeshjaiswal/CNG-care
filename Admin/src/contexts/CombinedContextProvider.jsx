import React from "react";
import { UserProvider } from "../contexts/userContext";
import { ProductProvider } from "../contexts/porductContext";
import { AdminProvider } from "../contexts/admincontext";

export const CombinedContextProvider = ({ children }) => {
  return (
    <UserProvider>
      <ProductProvider>
        <AdminProvider>{children}</AdminProvider>
      </ProductProvider>
    </UserProvider>
  );
};
