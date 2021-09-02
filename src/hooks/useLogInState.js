import { useState, useEffect } from "react";
// Moralis
import { useMoralis } from "react-moralis";
// Functions
import { Login, Logout } from "../functions/functions";

export const useLogInState = () => {
  // get the actual loggedIn Moralisuser
  const { user } = useMoralis();
  const [state, setState] = useState(user);

  const LogIn = async () => {
    const user = await Login();
    setState(user);
  };

  const LogOut = async () => {
    const user = await Logout();
    setState(user);
  };

  // Initial
  useEffect(() => {
    setState(user);
  }, [user]);

  return { state, setState, LogIn, LogOut };
};
