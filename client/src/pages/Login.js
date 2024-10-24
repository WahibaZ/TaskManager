import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../redux/slices/apiSlice";
import { setCredentials } from "../redux/slices/authSlice";

const Login = () => {
  const [loginError, setLoginError] = useState("");
  const { user } = useSelector((state) => state.auth);//il extrait l'utilisateur actuel (user) à partir de l'état auth. Cela permet au composant de savoir si l'utilisateur est connecté ou non.
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    try {
      
       // Réinitialiser le message d'erreur
       setLoginError("");

      /** Exécute la mutation de connexion avec les données du formulaire. 
       * unwrap() est utilisé pour obtenir la réponse directement ou lever une erreur si la requête échoue. */
      const userData = await login(data).unwrap();
      dispatch(setCredentials(userData));
      console.log("User data after dispatch:", userData);
      /**Si la connexion réussit, cette action est dispatchée pour stocker les informations de l'utilisateur 
       * dans le store Redux, 
       * ce qui met à jour l'état de l'application. */
     
    } catch (err) {
       // Gérer les erreurs de connexion
      console.log("Login failed", err);
      setLoginError("Login or password is incorrect."); // Définir le message d'erreur
    }
  };
  
  useEffect(() => {
    console.log("User state changed:", user);
    if (user) {
      console.log("Navigating to dashboard for user:", user);
      if (window.location.pathname !== "/dashboard") {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);
  
  /**Si user est défini, il enregistre un message dans la console et vérifie 
   * si l'utilisateur n'est pas déjà sur la page du tableau de bord.
   *  Si l'utilisateur n'est pas sur le tableau de bord, il utilise navigate pour le rediriger vers cette page. */
 
  // État pour gérer les messages d'erreur 
 
 

  return (
    
    <div className='w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]'>
      <div className='w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center'>
        {/* left side */}
        <div className='h-full w-full lg:w-2/3 flex flex-col items-center justify-center'>
          <div className='w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20'>
            <span className='flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base border-gray-300 text-gray-600'>
              Manage all your tasks in one place!
            </span>
            <p className='flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-blue-700'>
              <span>Task Manager</span>
            </p>
            <div className='cell'>
              <div className='circle rotate-in-up-left'></div>
            </div>
          </div>
        </div>

        {/* right side */}
        <div className='w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center'>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className='form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14'
          >
            <div className=''>
              <p className='text-blue-600 text-3xl font-bold text-center'>
                Welcome back!
              </p>
              <p className='text-center text-base text-gray-700 '>
                {/* Affichage du message d'erreur */}
              {loginError && (
                <span className='text-red-500 text-sm text-center'>{loginError}</span>
              )}
              </p>
            </div>

            <div className='flex flex-col gap-y-5'>
              <Textbox
                placeholder='email@example.com'
                type='email'
                name='email'
                label='Email Address'
                className='w-full rounded-full'
                register={register("email", {
                  required: "Email Address is required!",
                })}
                error={errors.email ? errors.email.message : ""}
              />
              <Textbox
                placeholder='your password'
                type='password'
                name='password'
                label='Password'
                className='w-full rounded-full'
                register={register("password", {
                  required: "Password is required!",
                })}
                error={errors.password ? errors.password.message : ""}
              />

              <span className='text-sm text-gray-500 hover:text-blue-600 hover:underline cursor-pointer'>
                Forget Password?
              </span>

              <Button
                type='submit'
                label='Submit'
                className='w-full h-10 bg-blue-700 text-white rounded-full'
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
//state : Il fait référence à l'état global de votre application Redux. 
//C'est un objet qui contient toutes les informations gérées par le store Redux.

/*useDispatch : Ce hook est utilisé pour obtenir la fonction dispatch, 
qui est utilisée pour envoyer des actions au store Redux.*/

/*useSelector : Ce hook est utilisé pour accéder à l'état du store Redux. 
Ici, il extrait l'utilisateur actuel (user) à partir de l'état auth. 
Cela permet au composant de savoir si l'utilisateur est connecté ou non.*/

/**useLoginMutation : Ce hook provient de l'API générée par redux-toolkit/query. 
 * Il permet d'exécuter la mutation de connexion, et isLoading indique si la requête de connexion est en cours. */

/*useForm : Ce hook est fourni par react-hook-form pour gérer les formulaires de manière efficace. 
Il fournit des méthodes comme register pour lier des champs de formulaire,
 handleSubmit pour gérer la soumission du formulaire, et errors pour accéder aux erreurs de validation.*/

 //handleSubmit est une fonction prédéfinie fournie par la bibliothèque react-hook-form