import { useContext } from "react";
import { UserContext } from "@/context/auth.context";

export const useAuth = () => {
  const utx = useContext(UserContext);
  if(!utx) throw new Error("Wrap with UserContextProvider");
  return utx;
};