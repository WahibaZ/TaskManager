import bcrypt from "bcryptjs"; // Une bibliothèque utilisée pour hacher les mots de passe avant de les stocker en base de données, afin de les sécuriser.
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    role: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],//Un tableau d'ObjectId qui fait référence à des documents de la collection "Task" (cle etranger).
    isActive: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }// Crée automatiquement deux champs, createdAt et updatedAt, pour savoir quand le document a été créé et modifié.
);

// un middleware "pré-enregistrement" qui s'exécute juste avant qu'un utilisateur soit sauvegardé en base de données.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);// genere chaîne aléatoire de caractères ajoutée au mot de passe avant de le hacher.
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {//Cette méthode compare le mot de passe saisi (enteredPassword) avec le mot de passe haché qui est stocké dans la base de données.
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema); //Cela crée le modèle User basé sur le schéma userSchema. Ce modèle est utilisé pour interagir avec la collection MongoDB des utilisateurs.

export default User;