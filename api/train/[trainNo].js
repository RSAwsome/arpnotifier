const https = require('https');

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

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { trainNo } = req.query;
  if (!trainNo || !/^\d{3,6}$/.test(trainNo)) {
    res.status(400).json({ success: false, error: 'Valid train number is required.' });
    return;
  }

  const targetUrl = `https://www.confirmtkt.com/train-schedule/${trainNo}`;
  const proxyReq = https.get(targetUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    },
    timeout: 8000
  }, (apiRes) => {
    if (apiRes.statusCode === 404) {
      res.status(404).json({ success: false, error: `Train number ${trainNo} not found.` });
      return;
    }

    let html = '';
    apiRes.on('data', chunk => html += chunk);
    apiRes.on('end', () => {
      try {
        const parsed = parseScheduleHtml(html, trainNo);
        if (parsed && parsed.stations && parsed.stations.length > 0) {
          res.status(200).json({ success: true, data: parsed });
        } else {
          res.status(404).json({ success: false, error: `Could not parse station list for train ${trainNo}.` });
        }
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
    });
  });

  proxyReq.on('error', (err) => {
    res.status(500).json({ success: false, error: 'Scraper failed: ' + err.message });
  });

  proxyReq.on('timeout', () => {
    proxyReq.destroy();
    res.status(504).json({ success: false, error: 'Request timed out.' });
  });
};
