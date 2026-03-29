import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pollService } from '../services/apiClient';
import styles from './CreatePollForm.module.css';

export default function createPollForm() {
    const [question, setQuestion] = useState('');
    const [username, setUsername] = useState('');
    const [options, setOptions] = useState(['', '']);
    const navigate = useNavigate();

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        if (options.length < 8) setOptions([...options, '']);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!question.trim() || !username.trim() || options.some(opt => !opt.trim())) {
            alert('Please fill all the field');
            return;
        }

        try {
            const data = await pollService.createPoll({ question, options, creator_username: username });
            navigate(`/poll/${data.id}`);
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Server error');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.pollForm}>
            <input
                className={styles.inputField}
                type="text" placeholder="What is your question" value={question}
                onChange={(e) => setQuestion(e.target.value)} required
            />
            <input
                className={styles.inputField}
                type="text" placeholder='Your name (poll creator)' value={username}
                onChange={(e) => setUsername(e.target.value)} required
            />

            <div className={styles.optionsContainer}>
                <span className={styles.optionsTitle}>אפשרויות (עד 8):</span>
                {options.map((opt, index) => (
                    <input
                        key={index}
                        className={styles.inputField}
                        type="text" placeholder={`option ${index + 1}`} value={opt}
                        onChange={(e) => handleOptionChange(index, e.target.value)} required
                    />
                ))}
            </div>

            {options.length < 8 && (
                <button type="button" onClick={addOption} className={styles.addOptionBtn}>
                    + Add option
                </button>
            )}

            <button type="submit" className={styles.submitBtn}>
                Create Poll
            </button>
        </form>
    );



}