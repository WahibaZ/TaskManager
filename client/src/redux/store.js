import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"; // Reducer pour la gestion de l'authentification
import { apiSlice } from "./slices/apiSlice"; // API slice pour la gestion des utilisateurs
//import { apiTasksSlice } from './slices/apiTasksSlice'; // API slice pour la gestion des tâches

// Configuration du store Redux
const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,  // Ajout de l'apiSlice pour les utilisateurs
    //[apiTasksSlice.reducerPath]: apiTasksSlice.reducer,   // Ajout de l'apiTasksSlice pour les tâches
    auth: authReducer,  // Reducer pour la gestion de l'authentification
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware) ,   // Ajout du middleware de l'apiSlice
      //.concat(apiTasksSlice.middleware),  // Ajout du middleware de l'apiTasksSlice
  devTools: true, // Activation des DevTools pour le débogage
});

export default store;

