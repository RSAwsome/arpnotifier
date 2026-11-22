const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname);

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// In-memory cache for train schedules (trainNo -> parsed schedule object)
const trainCache = new Map();

/**
 * Parses ConfirmTkt train schedule HTML into a structured JSON route object.
 * Correctly computes sequential day numbers across midnight boundaries.
 */
function parseScheduleHtml(html, trainNumber) {
  let trainName = '';
  const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (h1Match) {
    const rawH1 = h1Match[1].replace(/<[^>]+>/g, '').trim();
    trainName = rawH1.replace(/:\s*Train Route.*$/i, '').trim();
  }

  const stations = [];
  const tableMatch = html.match(/<table[^>]*>(.*?)<\/table>/s);
  if (!tableMatch) return null;

  const rows = tableMatch[0].match(/<tr[^>]*>.*?<\/tr>/gs) || [];
  let currentDay = 1;
  let prevMinutes = -1;

  for (const row of rows) {
    if (row.includes('<th') || !row.includes('railway-stations/')) continue;

    const nameMatch = row.match(/href="\/railway-stations\/[^"]*"[^>]*>\s*<div>(.*?)<\/div>\s*<div>([A-Z0-9]+)\s*-\s*([0-9.]+)km<\/div>/s);
    if (!nameMatch) continue;

    const stationName = nameMatch[1].trim();
    const stationCode = nameMatch[2].trim();
    const distanceKm = parseFloat(nameMatch[3]) || 0;

    const cells = row.match(/<td[^>]*>(.*?)<\/td>/gs) || [];
    if (cells.length < 3) continue;

    const timingCell = cells[2];
    const timeDivs = timingCell.match(/<div>(.*?)<\/div>/gs) || [];
    let arrival = '';
    let departure = '';

    if (timeDivs.length >= 2) {
      arrival = timeDivs[0].replace(/<[^>]+>/g, '').trim();
      departure = timeDivs[1].replace(/<[^>]+>/g, '').trim();
    } else if (timeDivs.length === 1) {
      const txt = timeDivs[0].replace(/<[^>]+>/g, '').trim();
      arrival = txt;
      departure = txt;
    }

    let halt = '0m';
    if (cells.length >= 4) {
      halt = cells[3].replace(/<[^>]+>/g, '').trim();
      if (halt === '-') halt = '0m';
    }

    // Determine Day calculation: if departure/arrival wrapped past midnight, increment currentDay
    const effectiveTimeStr = (departure && departure !== 'End') ? departure : arrival;
    const timeParts = effectiveTimeStr.match(/(\d{1,2}):(\d{2})/);
    if (timeParts) {
      const minutes = parseInt(timeParts[1], 10) * 60 + parseInt(timeParts[2], 10);
      if (prevMinutes !== -1 && minutes < prevMinutes) {
        currentDay++;
      }
      prevMinutes = minutes;
    }

    stations.push({
      station_code: stationCode,
      station_name: stationName,
      distance_km: distanceKm,
      arrival_time: arrival === 'Start' ? null : arrival,
      departure_time: departure === 'End' ? null : departure,
      halt_time: halt,
      day: currentDay
    });
  }

  if (stations.length === 0) return null;

  return {
    train_number: trainNumber,
    train_name: trainName || `Train ${trainNumber}`,
    source_station: stations[0],
    destination_station: stations[stations.length - 1],
    total_stations: stations.length,
    stations
  };
}

/**
 * Fetches train schedule from ConfirmTkt or cached memory
 */
function fetchTrainSchedule(trainNo) {
  return new Promise((resolve) => {
    if (trainCache.has(trainNo)) {
      return resolve({ success: true, cached: true, data: trainCache.get(trainNo) });
    }

    const targetUrl = `https://www.confirmtkt.com/train-schedule/${trainNo}`;
    const req = https.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: 8000
    }, (apiRes) => {
      if (apiRes.statusCode === 404) {
        return resolve({ success: false, error: `Train number ${trainNo} not found.` });
      }

      let html = '';
      apiRes.on('data', chunk => html += chunk);
      apiRes.on('end', () => {
        try {
          const parsed = parseScheduleHtml(html, trainNo);
          if (parsed && parsed.stations && parsed.stations.length > 0) {
            trainCache.set(trainNo, parsed);
            return resolve({ success: true, cached: false, data: parsed });
          } else {
            return resolve({ success: false, error: `Could not parse station list for train ${trainNo}.` });
          }
        } catch (err) {
          return resolve({ success: false, error: err.message });
        }
      });
    });

    req.on('error', (err) => resolve({ success: false, error: 'Network error: ' + err.message }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ success: false, error: 'Request timed out while fetching train schedule.' });
    });
  });
}

/**
 * Fetches PNR status from ConfirmTkt API
 */
function fetchPnrStatus(pnr) {
  return new Promise((resolve) => {
    const targetUrl = `https://api.confirmtkt.com/api/pnr/status/${pnr}`;
    const req = https.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      },
      timeout: 8000
    }, (apiRes) => {
      let data = '';
      apiRes.on('data', chunk => data += chunk);
      apiRes.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ success: true, statusCode: apiRes.statusCode, data: json });
        } catch (err) {
          resolve({ success: false, error: 'Invalid JSON response from PNR service.' });
        }
      });
    });

    req.on('error', (err) => resolve({ success: false, error: 'Network error: ' + err.message }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ success: false, error: 'Request timed out while querying PNR status.' });
    });
  });
}

const server = http.createServer(async (req, res) => {
  // Common CORS headers for all API requests
  const setCors = (contentType = 'application/json; charset=UTF-8') => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    res.setHeader('Content-Type', contentType);
  };

  if (req.method === 'OPTIONS') {
    setCors();
    res.writeHead(200);
    res.end();
    return;
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = reqUrl.pathname;

  // 1. Train Schedule & Boarding Points API: /api/train/:trainNo or /api/schedule/:trainNo
  if (pathname.startsWith('/api/train/') || pathname.startsWith('/api/schedule/')) {
    setCors();
    const trainNo = pathname.split('/')[3]?.trim();
    if (!trainNo || !/^\d{3,6}$/.test(trainNo)) {
      res.writeHead(400);
      res.end(JSON.stringify({ success: false, error: 'Valid train number (3 to 6 digits) is required.' }));
      return;
    }

    try {
      const result = await fetchTrainSchedule(trainNo);
      if (result.success) {
        res.writeHead(200);
        res.end(JSON.stringify(result));
      } else {
        res.writeHead(404);
        res.end(JSON.stringify(result));
      }
    } catch (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ success: false, error: 'Internal server error: ' + err.message }));
    }
    return;
  }

  // 2. PNR Status API: /api/pnr/:pnr
  if (pathname.startsWith('/api/pnr/')) {
    setCors();
    const pnr = pathname.split('/')[3]?.trim();
    if (!pnr || !/^\d{10}$/.test(pnr)) {
      res.writeHead(400);
      res.end(JSON.stringify({ success: false, error: 'Valid 10-digit PNR number is required.' }));
      return;
    }

    try {
      const result = await fetchPnrStatus(pnr);
      if (result.success) {
        res.writeHead(result.statusCode || 200);
        res.end(JSON.stringify(result.data));
      } else {
        res.writeHead(502);
        res.end(JSON.stringify({ success: false, error: result.error }));
      }
    } catch (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ success: false, error: 'Internal server error: ' + err.message }));
    }
    return;
  }

  // 3. Static File Serving
  let reqPath = pathname;
  if (reqPath === '/') reqPath = '/index.html';
  
  const filePath = path.join(PUBLIC_DIR, reqPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Node HTTP Server listening on port ${PORT}`);
});
