const db = require('../config/db');
const runMigrations = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS polls (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        question VARCHAR(255) NOT NULL,
        creator_username VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(100) NOT NULL UNIQUE
    );
    CREATE TABLE IF NOT EXISTS poll_options (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
        text VARCHAR(255) NOT NULL
    );
    CREATE TABLE IF NOT EXISTS votes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
        option_id UUID REFERENCES poll_options(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(poll_id, user_id)
    );
  `;
  try {
    console.log('🚀 Starting database migration...');
    await db.query(queryText);
    console.log('✅ All tables created successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    process.exit();
  }
};
runMigrations();