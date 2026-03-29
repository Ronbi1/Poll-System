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
    const pollResult = await db.query('SELECT * FROM polls WHERE id = $1', [id]);
    if (pollResult.rows.length === 0) return res.status(404).json({ error: 'Poll not found' });

    // שאילתה מתוקנת וחסינה
    const optionsResult = await db.query(`
      SELECT 
        po.id, 
        po.text, 
        COALESCE(count(v.id), 0)::int AS votes_count
      FROM poll_options po
      LEFT JOIN votes v ON po.id = v.option_id
      WHERE po.poll_id = $1
      GROUP BY po.id
    `, [id]);

    const poll = pollResult.rows[0];
    poll.options = optionsResult.rows;
    res.json(poll);
  } catch (error) {
    console.error('Error fetching poll:', error);
    res.status(500).json({ error: 'Failed to fetch poll' });
  }
};

exports.submitVote = async (req, res) => {
  const poll_id = req.params.id;
  const { option_id, username } = req.body;

  try {
    // בדיקה שכל הנתונים הגיעו
    if (!option_id || !username) {
      return res.status(400).json({ error: 'Missing option_id or username' });
    }

    await db.query(
      'INSERT INTO votes (poll_id, option_id, username) VALUES ($1, $2, $3)',
      [poll_id, option_id, username]
    );

    res.status(200).json({ success: true, message: 'Vote submitted successfully' });
  } catch (error) {
    // קוד 23505 ב-Postgres אומר שהמשתמש כבר הצביע (Unique Constraint)
    if (error.code === '23505') {
      return res.status(409).json({ error: 'כבר הצבעת לסקר זה!' });
    }

    console.error('Error submitting vote:', error); // זה מה שידפיס לנו את הבעיה בטרמינל
    res.status(500).json({ error: 'Failed to submit vote' });
  }
};

exports.getAllPolls = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM polls ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching all polls:', error);
    res.status(500).json({ error: 'Failed to fetch polls' });
  }
};