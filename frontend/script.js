async function fetchNotes() {
    const token = localStorage.getItem('authToken');
    const userEmail = localStorage.getItem('userEmail');
    
    if (!token || !userEmail) {
        window.location.href = './login.html';
    }

    try {
        const response = await fetch(`/api/notes/${userEmail}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        const data = await response.json();
        if (data.notes) {
            displayNotes(data.notes);
        }
    } catch (error) {
        console.error('Error fetching notes:', error);
    }
}

async function createNote() {
    const noteText = document.getElementById('note-text').value.trim();
    const token = localStorage.getItem('authToken');
    const userEmail = localStorage.getItem('userEmail');
    
    if (noteText !== '') {
        try {
            const response = await fetch('/api/create-note', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ email: userEmail, noteText }),
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                fetchNotes();
            } else {
                alert('Failed to create note');
            }
        } catch (error) {
            alert('Failed to create note');
        }
    } else {
        alert("Note cannot be empty!");
    }
}

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

fetchNotes();
