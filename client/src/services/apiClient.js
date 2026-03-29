const API_BASE_URL = 'http://localhost:3000/api';

export const pollService = {
    createPoll: async (pollData) => {
        const response = await fetch(`${API_BASE_URL}/polls`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pollData),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'שגיאה ביצירת הסקר');

        return data;
    },

    // נוסיף לכאן בהמשך את הפונקציות getPoll ו-submitVote
};