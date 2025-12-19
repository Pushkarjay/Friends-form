/**
 * Friends Form - Local Backend Server
 * Handles saving/loading data to local JSON file
 * 
 * Run: node server.js
 * Or use: start.bat (opens browser automatically)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DATA_DIR = path.join(__dirname, '..', 'Data', 'Database');
const DATA_FILE = path.join(DATA_DIR, 'friends-database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ entries: [], lastId: 0 }, null, 2));
}

// MIME types for serving static files
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Read database
function readDatabase() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading database:', error);
        return { entries: [], lastId: 0 };
    }
}

// Write database
function writeDatabase(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing database:', error);
        return false;
    }
}

// Parse JSON body
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (e) {
                reject(e);
            }
        });
        req.on('error', reject);
    });
}

// Send JSON response
function sendJSON(res, data, status = 200) {
    res.writeHead(status, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(JSON.stringify(data));
}

// Serve static files
function serveStatic(res, filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('File not found');
            return;
        }
        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(data);
    });
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const pathname = url.pathname;
    
    // CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }
    
    // API Routes
    if (pathname.startsWith('/api/')) {
        try {
            // GET all entries
            if (pathname === '/api/entries' && req.method === 'GET') {
                const db = readDatabase();
                sendJSON(res, { success: true, entries: db.entries, count: db.entries.length });
                return;
            }
            
            // GET single entry
            if (pathname.match(/^\/api\/entries\/\d+$/) && req.method === 'GET') {
                const id = parseInt(pathname.split('/').pop());
                const db = readDatabase();
                const entry = db.entries.find(e => e.id === id);
                if (entry) {
                    sendJSON(res, { success: true, entry });
                } else {
                    sendJSON(res, { success: false, error: 'Entry not found' }, 404);
                }
                return;
            }
            
            // POST new entry
            if (pathname === '/api/entries' && req.method === 'POST') {
                const body = await parseBody(req);
                const db = readDatabase();
                
                db.lastId++;
                const newEntry = {
                    ...body,
                    id: db.lastId,
                    created: new Date().toISOString(),
                    updated: new Date().toISOString()
                };
                db.entries.push(newEntry);
                
                if (writeDatabase(db)) {
                    console.log(`✅ Saved new entry #${db.lastId}: ${body.name || 'Unnamed'}`);
                    sendJSON(res, { success: true, entry: newEntry, id: db.lastId });
                } else {
                    sendJSON(res, { success: false, error: 'Failed to save' }, 500);
                }
                return;
            }
            
            // PUT update entry
            if (pathname.match(/^\/api\/entries\/\d+$/) && req.method === 'PUT') {
                const id = parseInt(pathname.split('/').pop());
                const body = await parseBody(req);
                const db = readDatabase();
                
                const index = db.entries.findIndex(e => e.id === id);
                if (index !== -1) {
                    db.entries[index] = {
                        ...db.entries[index],
                        ...body,
                        id: id,
                        updated: new Date().toISOString()
                    };
                    
                    if (writeDatabase(db)) {
                        console.log(`✅ Updated entry #${id}: ${body.name || 'Unnamed'}`);
                        sendJSON(res, { success: true, entry: db.entries[index] });
                    } else {
                        sendJSON(res, { success: false, error: 'Failed to save' }, 500);
                    }
                } else {
                    sendJSON(res, { success: false, error: 'Entry not found' }, 404);
                }
                return;
            }
            
            // DELETE entry
            if (pathname.match(/^\/api\/entries\/\d+$/) && req.method === 'DELETE') {
                const id = parseInt(pathname.split('/').pop());
                const db = readDatabase();
                
                const index = db.entries.findIndex(e => e.id === id);
                if (index !== -1) {
                    const deleted = db.entries.splice(index, 1)[0];
                    if (writeDatabase(db)) {
                        console.log(`🗑️ Deleted entry #${id}: ${deleted.name || 'Unnamed'}`);
                        sendJSON(res, { success: true });
                    } else {
                        sendJSON(res, { success: false, error: 'Failed to save' }, 500);
                    }
                } else {
                    sendJSON(res, { success: false, error: 'Entry not found' }, 404);
                }
                return;
            }
            
            // GET unique values for a field (for autocomplete dropdowns)
            if (pathname.match(/^\/api\/values\/\w+$/) && req.method === 'GET') {
                const fieldName = pathname.split('/').pop();
                const db = readDatabase();
                const values = new Set();
                
                db.entries.forEach(entry => {
                    let val = entry[fieldName];
                    if (val && typeof val === 'string') {
                        val = val.replace(/<[^>]*>/g, '').trim();
                        if (val) values.add(val);
                    }
                });
                
                const sortedValues = Array.from(values).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
                sendJSON(res, { success: true, field: fieldName, values: sortedValues });
                return;
            }
            
            // GET all unique values for all fields (bulk fetch)
            if (pathname === '/api/values' && req.method === 'GET') {
                const db = readDatabase();
                const allValues = {};
                
                db.entries.forEach(entry => {
                    Object.keys(entry).forEach(key => {
                        if (key === 'id' || key === 'created' || key === 'updated' || key === 'mainPhoto' || key === 'photos' || key === 'photoStates') return;
                        
                        let val = entry[key];
                        if (val && typeof val === 'string') {
                            val = val.replace(/<[^>]*>/g, '').trim();
                            if (val) {
                                if (!allValues[key]) allValues[key] = new Set();
                                allValues[key].add(val);
                            }
                        }
                    });
                });
                
                // Convert sets to sorted arrays
                Object.keys(allValues).forEach(key => {
                    allValues[key] = Array.from(allValues[key]).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
                });
                
                sendJSON(res, { success: true, values: allValues });
                return;
            }
            
            // API route not found
            sendJSON(res, { success: false, error: 'API endpoint not found' }, 404);
            
        } catch (error) {
            console.error('API Error:', error);
            sendJSON(res, { success: false, error: error.message }, 500);
        }
        return;
    }
    
    // Serve static files
    let filePath = path.join(__dirname, '..', pathname === '/' ? 'index.html' : pathname);
    
    // Security: prevent directory traversal
    if (!filePath.startsWith(path.join(__dirname, '..'))) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }
    
    serveStatic(res, filePath);
});

server.listen(PORT, () => {
    console.log('');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║         🎉 Friends Form Server is Running!                 ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log(`║  🌐 Open: http://localhost:${PORT}                            ║`);
    console.log(`║  📁 Database: Data/Database/friends-database.json          ║`);
    console.log('║  ❌ Press Ctrl+C to stop                                   ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('');
});
