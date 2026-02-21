const https = require('https');
const fs = require('fs');

function fetchStooq(symbol) {
    return new Promise((resolve) => {
        const url = `https://stooq.com/q/d/l/?s=${symbol}&i=d`;
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const lines = data.trim().split('\n');
                resolve({ symbol, status: res.statusCode, lines: lines.length, data: data.substring(0, 50).trim() });
            });
        }).on('error', (err) => resolve({ symbol, error: err.message }));
    });
}

async function run() {
    const tests = [
        // Spain
        'SAN.MC', 'SAN.ES', 'SAN.SM', 'SAN', 'SAN.F',
        // Germany
        'SAP.DE', 'SAP.F', 'SAP',
        // Italy
        'ENI.IT', 'ENI.MI', 'ENI.F', 'ENI'
    ];
    const results = [];
    for (const t of tests) {
        results.push(await fetchStooq(t));
    }
    fs.writeFileSync('stooq-results.json', JSON.stringify(results, null, 2), 'utf8');
}

run();
