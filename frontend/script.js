async function fetchNotes() {
    const token = localStorage.getItem('authToken');
    const userEmail = localStorage.getItem('userEmail');

    if (!token || !userEmail) {
        window.location.href = './login.html';
    }

    try {
        const response = await fetch(`/api/notes/${userEmail}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok) {
            displayNotes(data.notes || []);
        } else {
            alert(data.message || 'Failed to fetch notes');
        }
    } catch (error) {
        console.error('Error fetching notes:', error);
        alert('Unable to fetch notes. Please try again later.');
    }
}

async function createNote() {
    const noteText = document.getElementById('note-text').value.trim();
    const token = localStorage.getItem('authToken');
    const userEmail = localStorage.getItem('userEmail');

    if (!noteText) {
        alert('Note text cannot be empty!');
        return;
    }

    try {
        const response = await fetch('/api/create-note', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ email: userEmail, noteText }),
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            fetchNotes();
        } else {
            alert(result.message || 'Failed to create note');
        }
    } catch (error) {
        alert('Unable to create note. Please try again later.');
    }
}

async function deleteNote(noteId) {
    const token = localStorage.getItem('authToken');

    try {
        const response = await fetch(`/api/delete-note/${noteId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            fetchNotes();
        } else {
            alert(result.message || 'Failed to delete note');
        }
    } catch (error) {
        alert('Unable to delete note. Please try again later.');
    }
}
