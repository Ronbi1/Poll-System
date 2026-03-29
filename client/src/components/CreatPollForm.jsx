import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreatePollForm.css';

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
            alert(error.message || 'שגיאת שרת');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="poll-form">
            <input
                type="text" placeholder="what is your question" value={question}
                onChange={(e) => setQuestion(e.target.value)} required
            />
            <input
                type="text" placeholder="Your name (poll creator)" value={username}
                onChange={(e) => setUsername(e.target.value)} required
            />

            <div className="options-container">
                <span className="options-title">אפשרויות (עד 8):</span>
                {options.map((opt, index) => (
                    <div key={index} className="option-wrapper">
                        <input
                            type="text" placeholder={`option ${index + 1}`} value={opt}
                            onChange={(e) => handleOptionChange(index, e.target.value)} required
                        />
                    </div>
                ))}
            </div>

            {options.length < 8 && (
                <button type="button" onClick={addOption} className="add-option-btn">
                    + add option
                </button>
            )}

            <button type="submit" className="submit-btn">
                Create Poll
            </button>
        </form>
    );



}