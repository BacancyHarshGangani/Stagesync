import { createContext, useContext, useState } from "react"

type themetype = {
    theme : string,
    setTheme : React.Dispatch<React.SetStateAction<string>>;
}

export const themecontext = createContext<themetype | null>(null)

export const ThemeProvider =(
    {children}
 :{
    children: React.ReactNode
}) => {

    const [theme, setTheme ] = useState('dark');


    return(
        <themecontext.Provider value={{ theme, setTheme} }>
            {children}
        </themecontext.Provider>
    )
}

export const usetheme = () => {
    const thx = useContext(themecontext);
    if(!thx) throw new Error("wrpa a theme provider")
    return thx ;
}