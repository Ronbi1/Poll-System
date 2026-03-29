const db = require('../config/db');

exports.createPoll = async (req, res) => {
  const { question, creator_username, options } = req.body;

  try {
    // 1. יצירת הסקר בטבלת polls
    const pollResult = await db.query(
      'INSERT INTO polls (question, creator_username) VALUES ($1, $2) RETURNING id',
      [question, creator_username]
    );

    const pollId = pollResult.rows[0].id;


    const optionPromises = options.map(option =>
      db.query(
        'INSERT INTO poll_options (poll_id, text) VALUES ($1, $2)',
        [pollId, option]
      )
    );

    await Promise.all(optionPromises);

    res.status(201).json({ id: pollId, message: 'Poll created successfully!' });
  } catch (error) {
    console.error('Error creating poll:', error);
    res.status(500).json({ error: 'Failed to create poll' });
  }
};

exports.getPoll = async (req, res) => {
  const { id } = req.params;
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

exports.submitVote = async (req, res) => {
  const poll_id = req.params.id;
  const { option_id, username } = req.body;

  try {
    await db.query(
      'INSERT INTO votes (poll_id, option_id, username) VALUES (1$, 2$, 3$)',
      [poll_id, option_id, username]
    );

    res.status(200).json({ success: true, message: 'Vote submitted successfully' });
  } catch (error) {
    // טיפול חכם בשגיאות: בדיקה אם המשתמש כבר הצביע
    // 23505 זהו קוד השגיאה של PostgreSQL ל"הפרת חוק ייחודיות" (Unique Constraint)
    if (error.code === '23505') {
      return res.status(409).json({ error: 'User has already voted on this poll' });
    }

    console.error('Error submitting vote:', error);
    res.status(500).json({ error: 'Failed to submit vote' });
  }
}