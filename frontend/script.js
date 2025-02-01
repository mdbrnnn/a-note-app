//frontend/login.js
async function fetchNotes() {
    const token = localStorage.getItem("authToken");
    const userEmail = localStorage.getItem("userEmail");
  
    if (!token || !userEmail) {
      window.location.href = "./login.html";
      return;
    }
  
    try {
      const response = await fetch(`/api/notes/${userEmail}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const data = await response.json();
      if (data.notes) {
        displayNotes(data.notes);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  }
  