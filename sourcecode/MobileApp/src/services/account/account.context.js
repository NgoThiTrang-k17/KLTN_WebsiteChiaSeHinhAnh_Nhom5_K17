import React, { useState, createContext } from "react";
import { login } from "../account/account.service";

export const AccountContext = createContext();

export const AccountContextProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const onLogin = (email, password) => {
        setIsLoading(true);
        login(email, password)
          .then((u) => {
            setUser(u);
            setIsLoading(false);
          })
          .catch((e) => {
            setIsLoading(false);
            setError(e.toString());
          });
    };

    return (
        <AccountContext.Provider
          value={{
            isAuthenticated: !!user,
            user,
            isLoading,
            error,
            onLogin,
          }}
        >
          {children}
        </AccountContext.Provider>
      );
}