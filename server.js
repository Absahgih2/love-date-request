const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Data file path
const DATA_FILE = path.join(__dirname, 'data.json');

// Initialize data file if not exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ submissions: [], logs: [] }));
}

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper to read data
function readData() {
    try {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(raw);
    } catch (e) {
        return { submissions: [], logs: [] };
    }
}

// Helper to write data
function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// API: Get all submissions
app.get('/api/submissions', (req, res) => {
    const data = readData();
    res.json(data.submissions);
});

// API: Add a submission
app.post('/api/submissions', (req, res) => {
    const data = readData();
    const submission = {
        id: Date.now(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    data.submissions.push(submission);
    writeData(data);
    res.json({ success: true, submission });
});

// API: Get all logs
app.get('/api/logs', (req, res) => {
    const data = readData();
    res.json(data.logs);
});

// API: Add a log
app.post('/api/logs', (req, res) => {
    const data = readData();
    const log = {
        id: Date.now(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    data.logs.push(log);
    writeData(data);
    res.json({ success: true, log });
});

// API: Clear all data
app.delete('/api/clear', (req, res) => {
    writeData({ submissions: [], logs: [] });
    res.json({ success: true });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
