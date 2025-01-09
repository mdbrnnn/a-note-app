const authToken = localStorage.getItem('authToken');
const userEmail = localStorage.getItem('userEmail'); // You should store the logged-in email in localStorage

// Fetch notes from the backend
async function fetchNotes() {
    try {
        const response = await fetch(`http://localhost:3000/notes/${userEmail}`, {
            headers: { 'Authorization': `Bearer ${authToken}` },
        });

        const data = await response.json();
        if (data.notes) {
            displayNotes(data.notes);
        }
    } catch (error) {
        console.error('Error fetching notes:', error);
    }
}

// Create a new note
async function createNote() {
    const noteText = document.getElementById('note-text').value.trim();
    if (noteText !== '') {
        try {
            const response = await fetch('http://localhost:3000/create-note', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ email: userEmail, noteText }),
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                fetchNotes(); // Reload the notes after creation
            } else {
                alert('Failed to create the note');
            }
        } catch (error) {
            console.error('Error creating note:', error);
            alert('Failed to create the note');
        }
    } else {
        alert("Note cannot be empty!");
    }
}

// Delete a note
async function deleteNote(noteId) {
    try {
        const response = await fetch(`http://localhost:3000/delete-note/${noteId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` },
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            fetchNotes(); // Reload the notes after deletion
        } else {
            alert('Failed to delete the note');
        }
    } catch (error) {
        console.error('Error deleting note:', error);
    }
}

// Update a note
async function updateNote(noteId) {
    const noteText = document.getElementById('note-text').value.trim();
    if (noteText !== '') {
        try {
            const response = await fetch(`http://localhost:3000/update-note/${noteId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ noteText }),
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                fetchNotes(); // Reload the notes after update
            } else {
                alert('Failed to update the note');
            }
        } catch (error) {
            console.error('Error updating note:', error);
        }
    } else {
        alert("Note cannot be empty!");
    }
}

// Display notes on the page
function displayNotes(notes) {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';

    notes.forEach(note => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${note.note_text}</span>
            <button onclick="deleteNote(${note.id})">Delete</button>
            <button onclick="editNote(${note.id}, '${note.note_text}')">Edit</button>
        `;
        notesList.appendChild(listItem);
    });
}

// Call fetchNotes() on page load to display notes
fetchNotes();
