const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const eventsFilePath = path.join(__dirname, '../data/events.json');

if (!fs.existsSync(eventsFilePath)) {
    fs.writeFileSync(eventsFilePath, '[]');
}

router.post('/events', (req, res) => {
    const newEvent = req.body;

    fs.readFile(eventsFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read file' });
        
        let events = JSON.parse(data);
        events.push(newEvent);

        fs.writeFile(eventsFilePath, JSON.stringify(events, null, 2), (err) => {
            if (err) return res.status(500).json({ error: 'Failed to write file' });
            res.status(200).json({ message: 'Event saved!' });
        });
    });
});

module.exports = router;