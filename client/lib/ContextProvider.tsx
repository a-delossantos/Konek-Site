"use client";

import React, {
    createContext,
    useContext,
    Dispatch,
    SetStateAction,
    useState,
    ReactNode,
} from "react";

type DataType = {
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    imageUrl: string;
};

interface Props {
    children: ReactNode;
}

interface ContextProps {
    userData: DataType | null;
    setUserData: Dispatch<SetStateAction<DataType>>;
}

const defaultValue: ContextProps = {
    userData: {
        firstName: "",
        lastName: "",
        email: "",
        gender: "",
        imageUrl: "",
    },
    setUserData: () => {},
};

const GlobalContext = createContext<ContextProps>(defaultValue);

export const GlobalContextProvider = ({ children }: Props) => {
    const [userData, setUserData] = useState<DataType>(null!);
    return (
        <GlobalContext.Provider value={{ userData, setUserData }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);
