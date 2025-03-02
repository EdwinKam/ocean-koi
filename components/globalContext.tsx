import React, { createContext, useState, ReactNode, useContext } from "react";

// Define the initial context value type
type GlobalContextType = {
  createdPost: number;
  setCreatedPost: React.Dispatch<React.SetStateAction<number>>;
};

// Create the context with a default value
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Custom hook to use the GlobalContext
export const useAfterAuthContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error(
      "useAfterAuthContext must be used within a ContextAfterAuth",
    );
  }
  return context;
};

type RefreshProviderProps = {
  children: ReactNode;
};

const ContextAfterAuth = ({ children }: RefreshProviderProps) => {
  const [createdPost, setCreatedPost] = useState<number>(0);

  return (
    <GlobalContext.Provider value={{ createdPost, setCreatedPost }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default ContextAfterAuth;
