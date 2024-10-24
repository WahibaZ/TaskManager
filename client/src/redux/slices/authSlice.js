

// Le authSlice est responsable de la gestion de l'état lié à l'authentification des utilisateurs 
//dans votre application
//et aussi lenregistrement dans local Storage

import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("userInfo");//les informations sur lutilisateur sont stockees sous la cle userInfo
const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  isSidebarOpen: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {//reducers : Un objet contenant des fonctions qui modifient l'état.
    setCredentials: (state, action) => {
        console.log("Setting user credentials:", action.payload); 
        state.user = action.payload;//mettre a jour le state
        localStorage.setItem("userInfo", JSON.stringify(action.payload));//mettre a jour lelocalstorage
      },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("userInfo");
    },
    setOpenSidebar: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
  },
});

export const { setCredentials, logout, setOpenSidebar } = authSlice.actions;//peuvent être utilisées dans d'autres parties de l'application

export default authSlice.reducer;//utilisé lors de la configuration du store Redux.
