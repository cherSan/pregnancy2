import {createContext, useContext} from "react";

export type PageContextType = {
    isForegroundOpen: boolean;
    openForeground: () => void;
    closeForeground: () => void;
    toggleForeground: () => void;
}

export const PageContext = createContext<PageContextType | undefined>(undefined);

export const usePage = () => {
    const context = useContext(PageContext);
    if (!context) {
        throw new Error('usePage must be used within a Page component');
    }
    return context;
};