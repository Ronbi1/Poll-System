import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { pollService } from '../services/apiClient';
import styles from './PollViewPage.module.css';

export default function PollViewPage() {
    const { id } = useParams();
    const [poll, setPoll] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [username, setUsername] = useState('');
    const [voted, setVoted] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchPollData = () => {
        pollService.getPoll(id)
            .then(data => {
                setPoll(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchPollData();
    }, [id]);

    const handleVote = async () => {
        if (!selectedOption || !username.trim()) return alert('נא למלא שם ולבחור אפשרות');

        try {
            await pollService.submitVote(id, { option_id: selectedOption, username });
            setVoted(true);
            fetchPollData(); // רענון נתונים כדי לראות את הקול החדש
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!poll) return <div>Poll not found</div>;

    // חישוב סך כל הקולות לטובת אחוזים
    const totalVotes = poll.options.reduce((sum, opt) => sum + Number(opt.votes_count), 0);

    const sharePoll = () => {
        const url = window.location.href; // הלינק הישיר לסקר
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard! Share it with your friends.');
    };


    return (
        <div className={styles.container}>
            <h2>{poll.question}</h2>

            {!voted && (
                <input
                    type="text" placeholder="Full name" value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.nameInput}
                />
            )}

            <div className={styles.optionsList}>
                {poll.options.map((option) => {
                    const percentage = totalVotes > 0 ? Math.round((Number(option.votes_count) / totalVotes) * 100) : 0;

                    return (
                        <div
                            key={option.id}
                            className={`${styles.optionItem} ${selectedOption === option.id ? styles.selected : ''}`}
                            onClick={() => !voted && setSelectedOption(option.id)}
                        >
                            <div className={styles.optionText}>
                                <span>{option.text}</span>
                                {voted && <span>{option.votes_count} votes ({percentage}%)</span>}
                            </div>

                            {voted && (
                                <div className={styles.progressBarBg}>
                                    <div className={styles.progressBarFill} style={{ width: `${percentage}%` }}></div>
                                </div>
                            )}
                        </div>
                    );
                })}
                <button onClick={sharePoll} style={{ marginTop: '10px', padding: '10px', cursor: 'pointer' }}>
                    🔗 Share Poll
                </button>
            </div>

            {!voted ? (
                <button className={styles.voteBtn} onClick={handleVote} disabled={!selectedOption}>
                    Submmit vote✅
                </button>

            ) : (
                <p className={styles.votedMessage}>Theanks for your vote 🙏</p>
            )}

        </div>
    );
}