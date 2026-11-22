const https = require('https');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { pnr } = req.query;
  if (!pnr || !/^\d{10}$/.test(pnr)) {
    res.status(400).json({ success: false, error: 'Valid 10-digit PNR is required.' });
    return;
  }

  if (pnr === '1234567890') {
    res.status(200).json({
      Pnr: '1234567890',
      TrainNo: '17250',
      TrainName: 'Kakatiya Express',
      Doj: '15-Dec-2026',
      BookingDate: '16-Oct-2026',
      From: 'CCT',
      To: 'TPTY',
      BoardingPoint: 'CCT',
      BoardingStationName: 'Kakinada Town',
      ReservationUptoName: 'Tirupati',
      DepartureTime: '15:15',
      ArrivalTime: '05:25',
      Class: 'SL',
      Quota: 'GN',
      ChartPrepared: false,
      PassengerCount: 2,
      PassengerStatus: [
        { BookingStatus: 'CNF/S4/23', CurrentStatus: 'CNF/S4/23', Coach: 'S4', Berth: '23' },
        { BookingStatus: 'CNF/S4/24', CurrentStatus: 'CNF/S4/24', Coach: 'S4', Berth: '24' }
      ]
    });
    return;
  }

  const targetUrl = `https://api.confirmtkt.com/api/pnr/status/${pnr}`;
  const proxyReq = https.get(targetUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json'
    },
    timeout: 8000
  }, (apiRes) => {
    res.status(apiRes.statusCode || 200);
    apiRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    res.status(500).json({ success: false, error: 'Proxy request failed: ' + err.message });
  });

  proxyReq.on('timeout', () => {
    proxyReq.destroy();
    res.status(504).json({ success: false, error: 'PNR request timed out.' });
  });
};
