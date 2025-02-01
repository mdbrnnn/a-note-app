///backend/api/login.js
import { auth, admin } from "../firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const token = await user.getIdToken();

    res.status(200).json({ message: "Login successful", token, email });
  } catch (error) {
    res.status(401).json({ message: "Invalid email or password" });
  }
}
