import {FC, ReactNode} from "react";
export const PageContent: FC<{ children: ReactNode | ReactNode[] }> = ({ children }) => {
    return children;
};