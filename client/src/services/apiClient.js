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

    getPoll: async (id) => {
        const response = await fetch(`${API_BASE_URL}/polls/${id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Poll not found');
        return data;
    },

    submitVote: async (id, voteData) => {
        const response = await fetch(`${API_BASE_URL}/polls/${id}/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(voteData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error submiting vote');
        return data;
    }


};