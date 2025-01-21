import React from "react";
import { UserProvider } from "../contexts/userContext";
import { ProductProvider } from "../contexts/porductContext";
import { AdminProvider } from "../contexts/admincontext";
import { WorkshopProvider } from "../contexts/workshopContext";

export const CombinedContextProvider = ({ children }) => {
  return (
    <WorkshopProvider>
      <UserProvider>
        <ProductProvider>
          <AdminProvider>{children}</AdminProvider>
        </ProductProvider>
      </UserProvider>
    </WorkshopProvider>
  );
};
