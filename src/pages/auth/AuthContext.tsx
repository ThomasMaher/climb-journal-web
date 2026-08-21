import { createContext } from "react";
import type { UserState } from "../../models/user_models";

export const AuthContext = createContext<UserState>({user: undefined, setUser: ()=> {}, loading: true});