//backend/api/create-note.js
import { db, admin } from "../firebase.js";
import { doc, collection, addDoc } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, noteText } = req.body;

  if (!email || !noteText) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    const newNoteRef = await addDoc(collection(db, "notes"), {
      email,
      noteText,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Note created successfully", id: newNoteRef.id });
  } catch (error) {
    res.status(500).json({ message: "Error creating note", error: error.message });
  }
}
