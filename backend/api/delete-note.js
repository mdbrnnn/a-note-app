//backend/api/delete-note.js
import { db } from "../firebase.js";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import admin from "firebase-admin";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { noteId } = req.query;
  const authToken = req.headers.authorization?.split(" ")[1];

  if (!authToken) {
    return res.status(401).json({ message: "Authorization required" });
  }

  try {
    // Verify the user's token
    const decodedToken = await admin.auth().verifyIdToken(authToken);
    const userEmail = decodedToken.email;

    // Get the note from Firestore
    const noteRef = doc(db, "notes", noteId);
    const noteSnap = await getDoc(noteRef);

    if (!noteSnap.exists()) {
      return res.status(404).json({ message: "Note not found" });
    }

    const noteData = noteSnap.data();
    if (noteData.email !== userEmail) {
      return res.status(403).json({ message: "Unauthorized to delete this note" });
    }

    // Delete the note
    await deleteDoc(noteRef);
    res.status(200).json({ message: "Note deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error deleting note", error: error.message });
  }
}
