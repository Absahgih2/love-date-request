const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

const DATA_FILE = path.join(__dirname, 'data.json');

if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ submissions: [], logs: [] }));
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readData() {
    try {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(raw);
    } catch (e) {
        return { submissions: [], logs: [] };
    }
}

function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/submissions', (req, res) => {
    const data = readData();
    res.json(data.submissions);
});

app.post('/api/submissions', (req, res) => {
    const data = readData();
    const submission = {
        id: Date.now(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    data.submissions.push(submission);
    writeData(data);
    console.log('New submission:', submission);
    res.json({ success: true, submission });
});

app.get('/api/logs', (req, res) => {
    const data = readData();
    res.json(data.logs);
});

app.post('/api/logs', (req, res) => {
    const data = readData();
    const log = {
        id: Date.now(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    data.logs.push(log);
    writeData(data);
    console.log('New log:', log);
    res.json({ success: true, log });
});

app.delete('/api/clear', (req, res) => {
    writeData({ submissions: [], logs: [] });
    res.json({ success: true });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});
