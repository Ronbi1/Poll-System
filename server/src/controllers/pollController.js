const db = require('../config/db');

exports.createPoll = async (req, res) => {
    const { question, options, creator_username } = req.body;

    try {
        await db.query('BEGIN');

        const pollResult = await db.query(
            'INSERT INTO polls (question, creator_username) VALUES ($1, $2) RETURNING id',
             [question, creator_username]
        );
        
        const pollId = pollResult.rows[0].id;

        for(const text of options) {
            await db.query('INSERT INTO options (poll_id, text) VALUES ($1, $2)',
            [pollId, text]
        );
    }

    await db.query('COMMIT');
    res.status(201).json({ id: pollId, message: 'Poll created successfully' });
} catch (error) {
    await db.query('ROLLBACK');
    console.error('Error creating poll:', error);
    res.status(500).json({ error: 'Failed to create poll' });
}
};

exports.getPoll = async (req, res) => {
    const {id} = req.params;
    try {
        // 1. שליפת פרטי הסקר
        const pollResult = await db.query('SELECT * FROM polls WHERE id = $1', [id]);
        
        if (pollResult.rows.length === 0) {
          return res.status(404).json({ error: 'Poll not found' });
        }
    
        // 2. שליפת האפשרויות וספירת הקולות לכל אפשרות
        const optionsResult = await db.query(`
          SELECT o.id, o.text, COUNT(v.id) as votes 
          FROM poll_options o 
          LEFT JOIN votes v ON o.id = v.option_id 
          WHERE o.poll_id = $1 
          GROUP BY o.id
        `, [id]);
    
        const poll = pollResult.rows[0];
        poll.options = optionsResult.rows; // חיבור האפשרויות לאובייקט הסקר
    
        res.status(200).json(poll);
        
      } catch (error) {
        console.error('Error fetching poll:', error);
        res.status(500).json({ error: 'Failed to fetch poll' });
      }
    };