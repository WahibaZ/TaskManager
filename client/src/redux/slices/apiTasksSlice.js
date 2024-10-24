import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const API_URI = "http://localhost:8800/api";


const baseQuery = fetchBaseQuery({
  baseUrl: API_URI,
  credentials: 'include', 
  
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.user?.token; // Extrait le token depuis l'état global (auth)
    
    if (token) {
      headers.set("Authorization", `Bearer ${token}`); // Ajoute le token dans l'en-tête si disponible
    }

    return headers; // Retourne les en-têtes modifiés
  },
});

// Définition du slice API pour les tâches
export const apiTasksSlice = createApi({
  baseQuery, // Utilisation de baseQuery pour les requêtes
  tagTypes: ["Tache"], // Tag utilisé pour invalider et revalider les données liées aux tâches
  endpoints: (builder) => ({
    // Endpoint pour récupérer toutes les tâches
    getTasks: builder.query({
      query: () => "/task/",
      providesTags: ["Tache"], // Permet d'indiquer que ce query utilise les tâches comme tag
    }),
    
    // Endpoint pour créer une nouvelle tâche
    createTask: builder.mutation({
      query: (newTask) => ({
        url: "/task/create",
        method: "POST",
        body: newTask, // Le corps de la requête contient les informations de la nouvelle tâche
      }),
      invalidatesTags: ["Tache"], // Invalide les données liées aux tâches pour rafraîchir la liste
    }),
  }),
});

// Export des hooks générés automatiquement pour chaque endpoint
export const { useGetTasksQuery, useCreateTaskMutation } = apiTasksSlice;
