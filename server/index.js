import cookieParser from "cookie-parser";//Middleware utilisé dans Express pour analyser les cookies envoyés par le client dans les requêtes HTTP.
//Par exemple, pour lire, modifier, ou supprimer les cookies dans les requêtes entrantes, et gérer les sessions ou l'authentification.
import cors from "cors";
import dotenv from "dotenv";//Permet de charger les variables d'environnement depuis un fichier .env dans process.env.
import express from "express"; //Il est couramment utilisé pour créer des serveurs HTTP et API REST. Express simplifie la gestion des routes, des requêtes, des middlewares et des réponses.
import morgan from "morgan"; // Il est utile pour enregistrer les requêtes HTTP faites au serveur, ce qui est important pour déboguer, surveiller et analyser l'utilisation de ton API.
import { dbConnection } from "./utils/index.js";
import { errorHandler, routeNotFound } from "./middlewares/errorMiddlewares.js";
import routes from "./routes/index.js";

dotenv.config();

dbConnection();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(
    cors({
      origin: ["http://localhost:5173" , "http://localhost:3000" ],  // Port par défaut pour Vite et vous pouvez ajouter dautres
      methods: ["GET", "POST", "DELETE", "PUT"],
      credentials: true,// Indique si les cookies ou les en-têtes d'authentification sont autorisés.
    })
  );

  app.use(express.json());// Lorsque ton serveur reçoit des requêtes POST ou PUT contenant des données au format JSON, ce middleware permet à Express de comprendre et d'extraire ces données, en les mettant à disposition dans req.body.
app.use(express.urlencoded({ extended: true }));//Quand tu envoies des données depuis un formulaire web classique avec la méthode POST, elles arrivent au serveur sous forme de chaîne de caractères URL-encoded. Ce middleware les convertit en objets JavaScript et les met à disposition dans req.body.

app.use(cookieParser());// Les cookies sont souvent utilisés pour stocker des informations sur le client (comme un jeton d'authentification). Ce middleware te permet d'accéder aux cookies envoyés par le navigateur dans la requête.

app.use(morgan("dev"));//Morgan est un middleware qui permet de logger (enregistrer) chaque requête HTTP faite à ton serveur.
app.use("/api", routes);//Cela signifie que toutes les routes définies dans routes seront précédées de /api. Par exemple, si dans routes, tu as une route /users, elle sera accessible via /api/users.

app.use(routeNotFound);//Si aucune route définie ne correspond à la requête, cette fonction routeNotFound sera appelée pour gérer l'erreur 404 et renvoyer une réponse appropriée au client (ex. : "Page not found").
app.use(errorHandler);  //Si une erreur survient dans une route, ce middleware sera appelé pour gérer cette erreur et renvoyer une réponse appropriée au client (comme un message d'erreur ou un code d'état HTTP 500).

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  