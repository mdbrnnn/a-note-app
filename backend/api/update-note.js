//backend/api/update-note.js
import { db } from "../firebase.js";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import admin from "firebase-admin";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { noteId } = req.query;
  const { noteText } = req.body;
  const authToken = req.headers.authorization?.split(" ")[1];

  if (!authToken) {
    return res.status(401).json({ message: "Authorization required" });
  }

  if (!noteText || noteText.trim() === "") {
    return res.status(400).json({ message: "Note text cannot be empty" });
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
      return res.status(403).json({ message: "Unauthorized to update this note" });
    }

    // Update the note
    await updateDoc(noteRef, { noteText });
    res.status(200).json({ message: "Note updated successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error updating note", error: error.message });
  }
}
