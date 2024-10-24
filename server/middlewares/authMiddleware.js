

import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Middleware pour protéger les routes
/* const protectRoute = async (req, res, next) => {

  try {
    // Vérifier si le token est dans le header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];  // Récupérer le token après 'Bearer '
    console.log("authmiddleware.js Token trouvé dans l'en-tête:", token);
  }
  // Sinon, vérifier dans les cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log("authmiddleware.js Token trouvé dans les cookies:", token);
  }

    // Vérification si le token existe
    if (token) {
      // Vérification et décodage du token avec la clé secrète
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token décodé:", decodedToken); 

      // Récupération de l'utilisateur en utilisant l'ID du token
      const resp = await User.findById(decodedToken.userId).select("isAdmin email");

      // Vérification si l'utilisateur existe dans la base de données
      if (!resp) {
        // Si l'utilisateur n'existe pas, renvoyer une erreur 401
        console.log("Utilisateur non trouvé dans la base de données"); // Log si l'utilisateur n'existe pas
        
        return res.status(401).json({
          status: false,
          message: "Not authorized. User does not exist.",
        });
      }

      // Attachement des informations de l'utilisateur à la requête pour une utilisation ultérieure
      req.user = {
        email: resp.email,
        isAdmin: resp.isAdmin,
        userId: decodedToken.userId,
      };

      // Passage au prochain middleware ou à la route
      next();
    } else {
      // Si le token n'existe pas, renvoyer une erreur 401
      console.log("Aucun token trouvé");
      return res.status(401).json({
        status: false,
        message: "Not authorized... Try login again.",
      });
    }
  } catch (error) {
    console.error(error);
    console.error("Erreur dans le middleware protectRoute:", error); // Log des erreurs
    

    // Gestion spécifique des erreurs de token
    if (error.name === "TokenExpiredError") {
      // Si le token a expiré, renvoyer une erreur 401 avec un message spécifique
      return res.status(401).json({ status: false, message: "Token expired. Please log in again." });
    }
    if (error.name === "JsonWebTokenError") {
      // Si le token est invalide, renvoyer une erreur 401 avec un message spécifique
      return res.status(401).json({ status: false, message: "Invalid token. Please log in again." });
    }
    // Pour toutes les autres erreurs, renvoyer une erreur 401 générique
    return res.status(401).json({ status: false, message: "Not authorized. Try login again." });
  }
}; */



 const protectRoute = (req, res, next) => {
  let token;

  // Vérifiez si le token est dans les cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // Vérifiez si le token est dans le header Authorization
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Si le token n'existe pas, retournez une erreur
  if (!token) {
    return res.status(401).json({
      status: false,
      message: "Not authorized. No token found.",
    });
  }

  // Vérifiez et décodez le token JWT
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Stockez l'utilisateur dans la requête pour utilisation ultérieure
    next();
  } catch (error) {
    console.log("Erreur de validation du token:", error);
    return res.status(401).json({
      status: false,
      message: "Not authorized. Token is invalid.",
    });
  }
};



/* // Middleware pour vérifier si l'utilisateur est administrateur************************************************************
const isAdminRoute = (req, res, next) => {
  // Vérification si l'utilisateur est authentifié et s'il est admin
  if (req.user && req.user.isAdmin) {
    // Si c'est le cas, passer au prochain middleware ou à la route
    next();
  } else {
    // Si l'utilisateur n'est pas admin, renvoyer une erreur 403 (interdit)
    return res.status(403).json({ // 403 pour indiquer que l'accès est interdit
      status: false,
      message: "Not authorized as admin. Try login as admin.",
    });
  }
};
 */


const isAdminRoute = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ status: false, message: 'Not authorized. No token found.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password'); // Exclude password for security

    if (!user) {
      return res.status(404).json({ status: false, message: 'User not found.' });
    }

    if (user.isAdmin) {
      req.user = user; // Attach user object to request
      next(); // Proceed to the next middleware/route
    } else {
      return res.status(403).json({ status: false, message: 'Not authorized as admin. Try login as admin.' });
    }
  } catch (error) {
    return res.status(401).json({ status: false, message: 'Not authorized. Try login again.' });
  }
};


// Exportation des middlewares
export { isAdminRoute, protectRoute };
