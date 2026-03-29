// client/src/pages/PollsListPage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { pollService } from '../services/apiClient'; // Import the service

export default function PollsListPage() {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        pollService.getAllPolls()
            .then(data => {
                setPolls(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error:", err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading polls...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h3>Existing Polls</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {polls.length === 0 ? (
                    <p>No polls found.</p>
                ) : (
                    polls.map(poll => (
                        <div key={poll.id} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                            <strong style={{ fontSize: '18px' }}>{poll.question}</strong>
                            <p style={{ fontSize: '14px', color: '#666' }}>Created by: {poll.creator_username}</p>
                            <Link to={`/poll/${poll.id}`} style={{ color: '#007bff', fontWeight: 'bold' }}>
                                Vote & View Results →
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}