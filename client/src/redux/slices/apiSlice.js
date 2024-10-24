
//permet de créer une API qui facilite les requêtes HTTP et la gestion de l'état associé

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Point de base pour l'API (mettre à jour selon votre environnement)
const API_URI = "http://localhost:8800/api";

const baseQuery = fetchBaseQuery({
  baseUrl: API_URI,
  credentials: 'include', // Ce paramètre est important pour inclure les cookies (JWT)
  
  prepareHeaders: (headers, { getState }) => {//Cette fonction permet de préparer et de modifier les en-têtes des requêtes.
    //Elle extrait le token d'authentification de l'état global (Redux store).
    //Si le token existe, il l'ajoute à l'en-tête Authorization pour les requêtes qui en ont besoin.
    const token = getState().auth.user?.token;
    
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["User"], // Ajout de tagTypes pour une invalidation future (si besoin)
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/user/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getTeamList: builder.query({
      query: () => "/user/get-team",
      providesTags: ["User"],
    }),
    addUser: builder.mutation({
      query: (newUser) => ({
        url: "/user/register",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"], // Pour réactualiser la liste des utilisateurs après suppression
    }),
     // Endpoint pour mettre à jour un utilisateur
     updateUser: builder.mutation({
      query: ({ id, ...user }) => ({
        url: `/user/${id}`, // Utilise l'ID de l'utilisateur dans l'URL
        method: 'PUT', // Méthode PUT pour mettre à jour
        body: user, // Corps de la requête
      }),
      invalidatesTags: ["User"],
    }),

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
// Endpoint pour créer une nouvelle sous tâche
createSubTask: builder.mutation({
  query: ({ id, newSubTask }) => ({
    url: `/task/create-subtask/${id}`,  // Utilisez l'ID ici
    method: "POST",
    body: newSubTask,
  }),
  invalidatesTags: ["Tache"],
}),


  }),
});

// Export des hooks générés automatiquement pour chaque endpoint
export const { useLoginMutation, useGetTeamListQuery,useAddUserMutation, useDeleteUserMutation, useUpdateUserMutation, useGetTasksQuery, useCreateTaskMutation, useCreateSubTaskMutation } = apiSlice;
