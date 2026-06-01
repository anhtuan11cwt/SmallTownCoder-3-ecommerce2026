import { useContext } from "react";

import { UserContext } from "@/context/user-context";

export const useUserData = () => useContext(UserContext);
