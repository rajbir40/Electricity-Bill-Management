const db = require('../lib/db');

const getLogs = async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM audit_log');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getLogs };