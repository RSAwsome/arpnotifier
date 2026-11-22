/* ============================================================
   Train API & Database — Zero-API-Key Architecture
   Offline Train Directory, Intermediate Route Timetables,
   and 1-Click ConfirmTkt & IRCTC Integration.
   ============================================================ */

const TRAIN_CLASSES = [
  { code: '1A', label: '1A', name: 'First AC' },
  { code: '2A', label: '2A', name: 'Second AC' },
  { code: '3A', label: '3A', name: 'Third AC' },
  { code: '3E', label: '3E', name: 'Third AC Economy' },
  { code: 'SL', label: 'SL', name: 'Sleeper' },
  { code: 'CC', label: 'CC', name: 'Chair Car' },
  { code: 'EC', label: 'EC', name: 'Executive Chair Car' },
  { code: '2S', label: '2S', name: 'Second Sitting' },
];

const QUOTA_TYPES = [
  { code: 'GN', label: 'General' },
  { code: 'TQ', label: 'Tatkal' },
  { code: 'PT', label: 'Premium Tatkal' },
  { code: 'LD', label: 'Ladies' },
  { code: 'DF', label: 'Divyaang' },
];

/* ── Rich Railway Timetable & Stops Database ── */
const TRAIN_DATABASE = [
  {
  "number": "12625",
  "name": "Kerala SF Express",
  "type": "SUPERFAST",
  "runDays": "1111111",
  "classes": [
    "SL",
    "3A",
    "2A",
    "1A"
  ],
  "stops": [
    {
      "station_code": "TVC",
      "station_name": "Trivandrum Cntl",
      "distance_km": 0,
      "arrival_time": null,
      "departure_time": "12:15",
      "halt_time": "0m",
      "day": 1
    },
    {
      "station_code": "VAK",
      "station_name": "Varkalasivagiri",
      "distance_km": 41,
      "arrival_time": "12:51",
      "departure_time": "12:52",
      "halt_time": "1m",
      "day": 1
    },
    {
      "station_code": "QLN",
      "station_name": "Kollam Jn",
      "distance_km": 65,
      "arrival_time": "13:15",
      "departure_time": "13:18",
      "halt_time": "3m",
      "day": 1
    },
    {
      "station_code": "KYJ",
      "station_name": "Kayankulam Jn",
      "distance_km": 106,
      "arrival_time": "13:51",
      "departure_time": "13:53",
      "halt_time": "2m",
      "day": 1
    },
    {
      "station_code": "MVLK",
      "station_name": "Mavelikara",
      "distance_km": 114,
      "arrival_time": "14:02",
      "departure_time": "14:03",
      "halt_time": "1m",
      "day": 1
    },
    {
      "station_code": "CNGR",
      "station_name": "Chengannur",
      "distance_km": 126,
      "arrival_time": "14:15",
      "departure_time": "14:17",
      "halt_time": "2m",
      "day": 1
    },
    {
      "station_code": "TRVL",
      "station_name": "Tiruvalla",
      "distance_km": 135,
      "arrival_time": "14:26",
      "departure_time": "14:27",
      "halt_time": "1m",
      "day": 1
    },
    {
      "station_code": "CGY",
      "station_name": "Changanaseri",
      "distance_km": 143,
      "arrival_time": "14:35",
      "departure_time": "14:36",
      "halt_time": "1m",
      "day": 1
    },
    {
      "station_code": "KTYM",
      "station_name": "Kottayam",
      "distance_km": 161,
      "arrival_time": "14:55",
      "departure_time": "15:00",
      "halt_time": "5m",
      "day": 1
    },
    {
      "station_code": "VARD",
      "station_name": "Vaikom",
      "distance_km": 186,
      "arrival_time": "15:23",
      "departure_time": "15:24",
      "halt_time": "1m",
      "day": 1
    },
    {
      "station_code": "ERN",
      "station_name": "Ernakulam Town",
      "distance_km": 223,
      "arrival_time": "16:05",
      "departure_time": "16:10",
      "halt_time": "5m",
      "day": 1
    },
    {
      "station_code": "AWY",
      "station_name": "Aluva",
      "distance_km": 240,
      "arrival_time": "16:30",
      "departure_time": "16:32",
      "halt_time": "2m",
      "day": 1
    },
    {
      "station_code": "TCR",
      "station_name": "Thrisur",
      "distance_km": 295,
      "arrival_time": "17:27",
      "departure_time": "17:30",
      "halt_time": "3m",
      "day": 1
    },
    {
      "station_code": "OTP",
      "station_name": "Ottappalam",
      "distance_km": 340,
      "arrival_time": "18:44",
      "departure_time": "18:45",
      "halt_time": "1m",
      "day": 1
    },
    {
      "station_code": "PGT",
      "station_name": "Palakkad Jn",
      "distance_km": 372,
      "arrival_time": "19:12",
      "departure_time": "19:15",
      "halt_time": "3m",
      "day": 1
    },
    {
      "station_code": "CBE",
      "station_name": "Coimbatore Jn",
      "distance_km": 426,
      "arrival_time": "20:50",
      "departure_time": "20:55",
      "halt_time": "5m",
      "day": 1
    },
    {
      "station_code": "TUP",
      "station_name": "Tiruppur",
      "distance_km": 476,
      "arrival_time": "21:40",
      "departure_time": "21:45",
      "halt_time": "5m",
      "day": 1
    },
    {
      "station_code": "ED",
      "station_name": "Erode Jn",
      "distance_km": 527,
      "arrival_time": "22:30",
      "departure_time": "22:40",
      "halt_time": "10m",
      "day": 1
    },
    {
      "station_code": "SA",
      "station_name": "Salem Jn",
      "distance_km": 589,
      "arrival_time": "23:30",
      "departure_time": "23:35",
      "halt_time": "5m",
      "day": 1
    },
    {
      "station_code": "JTJ",
      "station_name": "Jolarpettai",
      "distance_km": 709,
      "arrival_time": "01:30",
      "departure_time": "01:35",
      "halt_time": "5m",
      "day": 2
    },
    {
      "station_code": "KPD",
      "station_name": "Katpadi Jn",
      "distance_km": 793,
      "arrival_time": "02:50",
      "departure_time": "02:55",
      "halt_time": "5m",
      "day": 2
    },
    {
      "station_code": "CTO",
      "station_name": "Chittoor",
      "distance_km": 826,
      "arrival_time": "03:28",
      "departure_time": "03:30",
      "halt_time": "2m",
      "day": 2
    },
    {
      "station_code": "TPTY",
      "station_name": "Tirupati",
      "distance_km": 897,
      "arrival_time": "04:45",
      "departure_time": "04:50",
      "halt_time": "5m",
      "day": 2
    },
    {
      "station_code": "RU",
      "station_name": "Renigunta Jn",
      "distance_km": 907,
      "arrival_time": "05:10",
      "departure_time": "05:20",
      "halt_time": "10m",
      "day": 2
    },
    {
      "station_code": "GDR",
      "station_name": "Gudur Jn",
      "distance_km": 990,
      "arrival_time": "06:40",
      "departure_time": "06:42",
      "halt_time": "2m",
      "day": 2
    },
    {
      "station_code": "NLR",
      "station_name": "Nellore",
      "distance_km": 1029,
      "arrival_time": "07:13",
      "departure_time": "07:15",
      "halt_time": "2m",
      "day": 2
    },
    {
      "station_code": "BZA",
      "station_name": "Vijayawada Jn",
      "distance_km": 1283,
      "arrival_time": "10:45",
      "departure_time": "10:55",
      "halt_time": "10m",
      "day": 2
    },
    {
      "station_code": "WL",
      "station_name": "Warangal",
      "distance_km": 1490,
      "arrival_time": "13:40",
      "departure_time": "13:45",
      "halt_time": "5m",
      "day": 2
    },
    {
      "station_code": "RDM",
      "station_name": "Ramagundam",
      "distance_km": 1591,
      "arrival_time": "15:14",
      "departure_time": "15:15",
      "halt_time": "1m",
      "day": 2
    },
    {
      "station_code": "SKZR",
      "station_name": "Sirpur Kagazngr",
      "distance_km": 1663,
      "arrival_time": "17:14",
      "departure_time": "17:15",
      "halt_time": "1m",
      "day": 2
    },
    {
      "station_code": "BPQ",
      "station_name": "Balharshah",
      "distance_km": 1733,
      "arrival_time": "18:10",
      "departure_time": "18:15",
      "halt_time": "5m",
      "day": 2
    },
    {
      "station_code": "CD",
      "station_name": "Chandrapur",
      "distance_km": 1747,
      "arrival_time": "18:30",
      "departure_time": "18:32",
      "halt_time": "2m",
      "day": 2
    },
    {
      "station_code": "SEGM",
      "station_name": "Sevagram",
      "distance_km": 1868,
      "arrival_time": "20:03",
      "departure_time": "20:05",
      "halt_time": "2m",
      "day": 2
    },
    {
      "station_code": "NGP",
      "station_name": "Nagpur",
      "distance_km": 1944,
      "arrival_time": "21:10",
      "departure_time": "21:15",
      "halt_time": "5m",
      "day": 2
    },
    {
      "station_code": "ET",
      "station_name": "Itarsi Jn",
      "distance_km": 2241,
      "arrival_time": "02:05",
      "departure_time": "02:10",
      "halt_time": "5m",
      "day": 3
    },
    {
      "station_code": "BPL",
      "station_name": "Bhopal  Jn",
      "distance_km": 2339,
      "arrival_time": "03:45",
      "departure_time": "03:55",
      "halt_time": "10m",
      "day": 3
    },
    {
      "station_code": "BINA",
      "station_name": "Bina Jn",
      "distance_km": 2478,
      "arrival_time": "05:40",
      "departure_time": "05:45",
      "halt_time": "5m",
      "day": 3
    },
    {
      "station_code": "VGLJ",
      "station_name": "V Lakshmibai Jhansi Jhs",
      "distance_km": 2630,
      "arrival_time": "07:25",
      "departure_time": "07:30",
      "halt_time": "5m",
      "day": 3
    },
    {
      "station_code": "GWL",
      "station_name": "Gwalior",
      "distance_km": 2727,
      "arrival_time": "08:40",
      "departure_time": "08:42",
      "halt_time": "2m",
      "day": 3
    },
    {
      "station_code": "AGC",
      "station_name": "Agra Cantt",
      "distance_km": 2846,
      "arrival_time": "10:10",
      "departure_time": "10:15",
      "halt_time": "5m",
      "day": 3
    },
    {
      "station_code": "MTJ",
      "station_name": "Mathura Jn",
      "distance_km": 2900,
      "arrival_time": "10:50",
      "departure_time": "10:52",
      "halt_time": "2m",
      "day": 3
    },
    {
      "station_code": "FDB",
      "station_name": "Faridabad",
      "distance_km": 3012,
      "arrival_time": "12:30",
      "departure_time": "12:32",
      "halt_time": "2m",
      "day": 3
    },
    {
      "station_code": "NZM",
      "station_name": "H Nizamuddin",
      "distance_km": 3033,
      "arrival_time": "12:50",
      "departure_time": "12:52",
      "halt_time": "2m",
      "day": 3
    },
    {
      "station_code": "NDLS",
      "station_name": "New Delhi",
      "distance_km": 3040,
      "arrival_time": "13:30",
      "departure_time": null,
      "halt_time": "0m",
      "day": 3
    }
  ]
},

  {
    number: '20701',
    name: 'Vande Bharat Express',
    type: 'VANDE BHARAT',
    runDays: '1111101', // Mon, Tue, Wed, Thu, Fri, Sun (Wed off or similar)
    classes: ['CC', 'EC'],
    stops: [
      { station_code: 'SC', station_name: 'Secunderabad Jn', arrival_time: null, departure_time: '06:00', halt_time: 0, day: 1, distance_km: 0 },
      { station_code: 'NLDA', station_name: 'Nalgonda', arrival_time: '07:04', departure_time: '07:05', halt_time: 1, day: 1, distance_km: 110 },
      { station_code: 'MRGA', station_name: 'Miryalaguda', arrival_time: '07:34', departure_time: '07:35', halt_time: 1, day: 1, distance_km: 148 },
      { station_code: 'GNT', station_name: 'Guntur Jn', arrival_time: '09:00', departure_time: '09:05', halt_time: 5, day: 1, distance_km: 281 },
      { station_code: 'OGL', station_name: 'Ongole', arrival_time: '10:24', departure_time: '10:25', halt_time: 1, day: 1, distance_km: 398 },
      { station_code: 'NLR', station_name: 'Nellore', arrival_time: '11:44', departure_time: '11:45', halt_time: 1, day: 1, distance_km: 514 },
      { station_code: 'RU', station_name: 'Renigunta Jn', arrival_time: '13:30', departure_time: '13:35', halt_time: 5, day: 1, distance_km: 636 },
      { station_code: 'TPTY', station_name: 'Tirupati Main', arrival_time: '14:00', departure_time: null, halt_time: 0, day: 1, distance_km: 646 }
    ]
  },
  {
    number: '20702',
    name: 'Vande Bharat Express',
    type: 'VANDE BHARAT',
    runDays: '1111101',
    classes: ['CC', 'EC'],
    stops: [
      { station_code: 'TPTY', station_name: 'Tirupati Main', arrival_time: null, departure_time: '15:15', halt_time: 0, day: 1, distance_km: 0 },
      { station_code: 'RU', station_name: 'Renigunta Jn', arrival_time: '15:35', departure_time: '15:40', halt_time: 5, day: 1, distance_km: 10 },
      { station_code: 'NLR', station_name: 'Nellore', arrival_time: '17:08', departure_time: '17:10', halt_time: 2, day: 1, distance_km: 132 },
      { station_code: 'OGL', station_name: 'Ongole', arrival_time: '18:23', departure_time: '18:25', halt_time: 2, day: 1, distance_km: 248 },
      { station_code: 'GNT', station_name: 'Guntur Jn', arrival_time: '19:48', departure_time: '19:50', halt_time: 2, day: 1, distance_km: 365 },
      { station_code: 'MRGA', station_name: 'Miryalaguda', arrival_time: '21:04', departure_time: '21:05', halt_time: 1, day: 1, distance_km: 498 },
      { station_code: 'NLDA', station_name: 'Nalgonda', arrival_time: '21:34', departure_time: '21:35', halt_time: 1, day: 1, distance_km: 536 },
      { station_code: 'SC', station_name: 'Secunderabad Jn', arrival_time: '23:30', departure_time: null, halt_time: 0, day: 1, distance_km: 646 }
    ]
  },
  {
    number: '20834',
    name: 'Secunderabad - Visakhapatnam Vande Bharat',
    type: 'VANDE BHARAT',
    runDays: '1111110', // Ex Sunday
    classes: ['CC', 'EC'],
    stops: [
      { station_code: 'SC', station_name: 'Secunderabad Jn', arrival_time: null, departure_time: '15:00', halt_time: 0, day: 1, distance_km: 0 },
      { station_code: 'WL', station_name: 'Warangal', arrival_time: '16:35', departure_time: '16:36', halt_time: 1, day: 1, distance_km: 142 },
      { station_code: 'KMT', station_name: 'Khammam', arrival_time: '17:45', departure_time: '17:46', halt_time: 1, day: 1, distance_km: 249 },
      { station_code: 'BZA', station_name: 'Vijayawada Jn', arrival_time: '19:00', departure_time: '19:05', halt_time: 5, day: 1, distance_km: 349 },
      { station_code: 'RJY', station_name: 'Rajahmundry', arrival_time: '20:58', departure_time: '21:00', halt_time: 2, day: 1, distance_km: 499 },
      { station_code: 'SLO', station_name: 'Samalkot Jn', arrival_time: '21:39', departure_time: '21:40', halt_time: 1, day: 1, distance_km: 549 },
      { station_code: 'VSKP', station_name: 'Visakhapatnam Jn', arrival_time: '23:30', departure_time: null, halt_time: 0, day: 1, distance_km: 699 }
    ]
  },
  {
    number: '20833',
    name: 'Visakhapatnam - Secunderabad Vande Bharat',
    type: 'VANDE BHARAT',
    runDays: '1111110',
    classes: ['CC', 'EC'],
    stops: [
      { station_code: 'VSKP', station_name: 'Visakhapatnam Jn', arrival_time: null, departure_time: '05:45', halt_time: 0, day: 1, distance_km: 0 },
      { station_code: 'SLO', station_name: 'Samalkot Jn', arrival_time: '07:14', departure_time: '07:15', halt_time: 1, day: 1, distance_km: 151 },
      { station_code: 'RJY', station_name: 'Rajahmundry', arrival_time: '07:53', departure_time: '07:55', halt_time: 2, day: 1, distance_km: 201 },
      { station_code: 'BZA', station_name: 'Vijayawada Jn', arrival_time: '09:50', departure_time: '09:55', halt_time: 5, day: 1, distance_km: 350 },
      { station_code: 'KMT', station_name: 'Khammam', arrival_time: '11:00', departure_time: '11:01', halt_time: 1, day: 1, distance_km: 450 },
      { station_code: 'WL', station_name: 'Warangal', arrival_time: '12:05', departure_time: '12:06', halt_time: 1, day: 1, distance_km: 558 },
      { station_code: 'SC', station_name: 'Secunderabad Jn', arrival_time: '14:15', departure_time: null, halt_time: 0, day: 1, distance_km: 699 }
    ]
  },
  {
    number: '20703',
    name: 'Kacheguda - Yesvantpur Vande Bharat',
    type: 'VANDE BHARAT',
    runDays: '1111011',
    classes: ['CC', 'EC'],
    stops: [
      { station_code: 'KCG', station_name: 'Kacheguda', arrival_time: null, departure_time: '05:45', halt_time: 0, day: 1, distance_km: 0 },
      { station_code: 'MBNR', station_name: 'Mahbubnagar', arrival_time: '06:54', departure_time: '06:55', halt_time: 1, day: 1, distance_km: 106 },
      { station_code: 'KRNT', station_name: 'Kurnool City', arrival_time: '08:24', departure_time: '08:25', halt_time: 1, day: 1, distance_km: 236 },
      { station_code: 'ATP', station_name: 'Anantapur', arrival_time: '10:44', departure_time: '10:45', halt_time: 1, day: 1, distance_km: 403 },
      { station_code: 'DMM', station_name: 'Dharmavaram Jn', arrival_time: '11:14', departure_time: '11:15', halt_time: 1, day: 1, distance_km: 436 },
      { station_code: 'YPR', station_name: 'Yesvantpur Jn', arrival_time: '14:00', departure_time: null, halt_time: 0, day: 1, distance_km: 618 }
    ]
  },
  {
    number: '12723',
    name: 'Telangana Express',
    type: 'SUPERFAST',
    runDays: '1111111',
    classes: ['1A', '2A', '3A', 'SL'],
    stops: [
      { station_code: 'HYB', station_name: 'Hyderabad Deccan', arrival_time: null, departure_time: '06:00', halt_time: 0, day: 1, distance_km: 0 },
      { station_code: 'SC', station_name: 'Secunderabad Jn', arrival_time: '06:20', departure_time: '06:25', halt_time: 5, day: 1, distance_km: 10 },
      { station_code: 'KZJ', station_name: 'Kazipet Jn', arrival_time: '08:03', departure_time: '08:05', halt_time: 2, day: 1, distance_km: 141 },
      { station_code: 'RDM', station_name: 'Ramagundam', arrival_time: '09:19', departure_time: '09:20', halt_time: 1, day: 1, distance_km: 234 },
      { station_code: 'MCI', station_name: 'Manchiryal', arrival_time: '09:34', departure_time: '09:35', halt_time: 1, day: 1, distance_km: 248 },
      { station_code: 'BPA', station_name: 'Bellampalli', arrival_time: '09:54', departure_time: '09:55', halt_time: 1, day: 1, distance_km: 268 },
      { station_code: 'SKZR', station_name: 'Sirpur Kaghaznagar', arrival_time: '10:28', departure_time: '10:30', halt_time: 2, day: 1, distance_km: 306 },
      { station_code: 'BPQ', station_name: 'Balharshah', arrival_time: '11:55', departure_time: '12:00', halt_time: 5, day: 1, distance_km: 376 },
      { station_code: 'CD', station_name: 'Chandrapur', arrival_time: '12:18', departure_time: '12:20', halt_time: 2, day: 1, distance_km: 390 },
      { station_code: 'NGP', station_name: 'Nagpur Jn', arrival_time: '15:20', departure_time: '15:25', halt_time: 5, day: 1, distance_km: 598 },
      { station_code: 'BPL', station_name: 'Bhopal Jn', arrival_time: '21:45', departure_time: '21:55', halt_time: 10, day: 1, distance_km: 988 },
      { station_code: 'VGLJ', station_name: 'V Lakshmibai Jhansi', arrival_time: '01:50', departure_time: '01:58', halt_time: 8, day: 2, distance_km: 1280 },
      { station_code: 'GWL', station_name: 'Gwalior Jn', arrival_time: '03:07', departure_time: '03:09', halt_time: 2, day: 2, distance_km: 1377 },
      { station_code: 'AGC', station_name: 'Agra Cantt', arrival_time: '05:00', departure_time: '05:05', halt_time: 5, day: 2, distance_km: 1495 },
      { station_code: 'MTJ', station_name: 'Mathura Jn', arrival_time: '05:48', departure_time: '05:50', halt_time: 2, day: 2, distance_km: 1549 },
      { station_code: 'NDLS', station_name: 'New Delhi', arrival_time: '07:40', departure_time: null, halt_time: 0, day: 2, distance_km: 1690 }
    ]
  },
  {
    number: '12724',
    name: 'Telangana Express',
    type: 'SUPERFAST',
    runDays: '1111111',
    classes: ['1A', '2A', '3A', 'SL'],
    stops: [
      { station_code: 'NDLS', station_name: 'New Delhi', arrival_time: null, departure_time: '16:00', halt_time: 0, day: 1, distance_km: 0 },
      { station_code: 'MTJ', station_name: 'Mathura Jn', arrival_time: '17:28', departure_time: '17:30', halt_time: 2, day: 1, distance_km: 141 },
      { station_code: 'AGC', station_name: 'Agra Cantt', arrival_time: '18:05', departure_time: '18:07', halt_time: 2, day: 1, distance_km: 195 },
      { station_code: 'GWL', station_name: 'Gwalior Jn', arrival_time: '19:58', departure_time: '20:00', halt_time: 2, day: 1, distance_km: 313 },
      { station_code: 'VGLJ', station_name: 'V Lakshmibai Jhansi', arrival_time: '21:45', departure_time: '21:53', halt_time: 8, day: 1, distance_km: 410 },
      { station_code: 'BPL', station_name: 'Bhopal Jn', arrival_time: '01:20', departure_time: '01:30', halt_time: 10, day: 2, distance_km: 702 },
      { station_code: 'NGP', station_name: 'Nagpur Jn', arrival_time: '07:10', departure_time: '07:15', halt_time: 5, day: 2, distance_km: 1092 },
      { station_code: 'BPQ', station_name: 'Balharshah', arrival_time: '10:35', departure_time: '10:40', halt_time: 5, day: 2, distance_km: 1314 },
      { station_code: 'KZJ', station_name: 'Kazipet Jn', arrival_time: '14:28', departure_time: '14:30', halt_time: 2, day: 2, distance_km: 1549 },
      { station_code: 'SC', station_name: 'Secunderabad Jn', arrival_time: '16:25', departure_time: '16:30', halt_time: 5, day: 2, distance_km: 1680 },
      { station_code: 'HYB', station_name: 'Hyderabad Deccan', arrival_time: '17:10', departure_time: null, halt_time: 0, day: 2, distance_km: 1690 }
    ]
  },
  {
    number: '12760',
    name: 'Charminar Express',
    type: 'SUPERFAST',
    runDays: '1111111',
    classes: ['1A', '2A', '3A', 'SL'],
    stops: [
      { station_code: 'HYB', station_name: 'Hyderabad Deccan', arrival_time: null, departure_time: '18:00', halt_time: 0, day: 1, distance_km: 0 },
      { station_code: 'SC', station_name: 'Secunderabad Jn', arrival_time: '18:20', departure_time: '18:25', halt_time: 5, day: 1, distance_km: 10 },
      { station_code: 'KZJ', station_name: 'Kazipet Jn', arrival_time: '20:18', departure_time: '20:20', halt_time: 2, day: 1, distance_km: 141 },
      { station_code: 'WL', station_name: 'Warangal', arrival_time: '20:33', departure_time: '20:35', halt_time: 2, day: 1, distance_km: 151 },
      { station_code: 'MABD', station_name: 'Mahbubabad', arrival_time: '21:18', departure_time: '21:20', halt_time: 2, day: 1, distance_km: 211 },
      { station_code: 'KMT', station_name: 'Khammam', arrival_time: '21:58', departure_time: '22:00', halt_time: 2, day: 1, distance_km: 259 },
      { station_code: 'BZA', station_name: 'Vijayawada Jn', arrival_time: '00:05', departure_time: '00:15', halt_time: 10, day: 2, distance_km: 358 },
      { station_code: 'TEL', station_name: 'Tenali Jn', arrival_time: '00:43', departure_time: '00:45', halt_time: 2, day: 2, distance_km: 389 },
      { station_code: 'CLX', station_name: 'Chirala', arrival_time: '01:28', departure_time: '01:30', halt_time: 2, day: 2, distance_km: 447 },
      { station_code: 'OGL', station_name: 'Ongole', arrival_time: '02:08', departure_time: '02:10', halt_time: 2, day: 2, distance_km: 496 },
      { station_code: 'NLR', station_name: 'Nellore', arrival_time: '03:28', departure_time: '03:30', halt_time: 2, day: 2, distance_km: 613 },
      { station_code: 'GDR', station_name: 'Gudur Jn', arrival_time: '04:38', departure_time: '04:40', halt_time: 2, day: 2, distance_km: 651 },
      { station_code: 'MS', station_name: 'Chennai Egmore', arrival_time: '07:00', departure_time: '07:05', halt_time: 5, day: 2, distance_km: 792 },
      { station_code: 'TBM', station_name: 'Tambaram', arrival_time: '08:00', departure_time: null, halt_time: 0, day: 2, distance_km: 817 }
    ]
  },
  {
    number: '12759',
    name: 'Charminar Express',
    type: 'SUPERFAST',
    runDays: '1111111',
    classes: ['1A', '2A', '3A', 'SL'],
    stops: [
      { station_code: 'TBM', station_name: 'Tambaram', arrival_time: null, departure_time: '17:30', halt_time: 0, day: 1, distance_km: 0 },
      { station_code: 'MS', station_name: 'Chennai Egmore', arrival_time: '18:00', departure_time: '18:05', halt_time: 5, day: 1, distance_km: 25 },
      { station_code: 'GDR', station_name: 'Gudur Jn', arrival_time: '20:48', departure_time: '20:50', halt_time: 2, day: 1, distance_km: 166 },
      { station_code: 'NLR', station_name: 'Nellore', arrival_time: '21:18', departure_time: '21:20', halt_time: 2, day: 1, distance_km: 205 },
      { station_code: 'OGL', station_name: 'Ongole', arrival_time: '22:48', departure_time: '22:50', halt_time: 2, day: 1, distance_km: 321 },
      { station_code: 'CLX', station_name: 'Chirala', arrival_time: '23:28', departure_time: '23:30', halt_time: 2, day: 1, distance_km: 371 },
      { station_code: 'TEL', station_name: 'Tenali Jn', arrival_time: '00:13', departure_time: '00:15', halt_time: 2, day: 2, distance_km: 428 },
      { station_code: 'BZA', station_name: 'Vijayawada Jn', arrival_time: '01:10', departure_time: '01:20', halt_time: 10, day: 2, distance_km: 459 },
      { station_code: 'KMT', station_name: 'Khammam', arrival_time: '02:38', departure_time: '02:40', halt_time: 2, day: 2, distance_km: 558 },
      { station_code: 'WL', station_name: 'Warangal', arrival_time: '04:03', departure_time: '04:05', halt_time: 2, day: 2, distance_km: 666 },
      { station_code: 'KZJ', station_name: 'Kazipet Jn', arrival_time: '04:23', departure_time: '04:25', halt_time: 2, day: 2, distance_km: 676 },
      { station_code: 'SC', station_name: 'Secunderabad Jn', arrival_time: '06:35', departure_time: '06:40', halt_time: 5, day: 2, distance_km: 807 },
      { station_code: 'HYB', station_name: 'Hyderabad Deccan', arrival_time: '07:15', departure_time: null, halt_time: 0, day: 2, distance_km: 817 }
    ]
  },
  {
    number: '12728',
    name: 'Godavari Express',
    type: 'SUPERFAST',
    runDays: '1111111',
    classes: ['1A', '2A', '3A', 'SL'],
    stops: [
      { station_code: 'HYB', station_name: 'Hyderabad Deccan', arrival_time: null, departure_time: '17:05', halt_time: 0, day: 1, distance_km: 0 },
      { station_code: 'SC', station_name: 'Secunderabad Jn', arrival_time: '17:25', departure_time: '17:30', halt_time: 5, day: 1, distance_km: 10 },
      { station_code: 'KZJ', station_name: 'Kazipet Jn', arrival_time: '19:23', departure_time: '19:25', halt_time: 2, day: 1, distance_km: 141 },
      { station_code: 'WL', station_name: 'Warangal', arrival_time: '19:38', departure_time: '19:40', halt_time: 2, day: 1, distance_km: 151 },
      { station_code: 'KMT', station_name: 'Khammam', arrival_time: '20:58', departure_time: '21:00', halt_time: 2, day: 1, distance_km: 259 },
      { station_code: 'BZA', station_name: 'Vijayawada Jn', arrival_time: '23:05', departure_time: '23:20', halt_time: 15, day: 1, distance_km: 358 },
      { station_code: 'EE', station_name: 'Eluru', arrival_time: '00:08', departure_time: '00:10', halt_time: 2, day: 2, distance_km: 417 },
      { station_code: 'TDD', station_name: 'Tadepalligudem', arrival_time: '00:43', departure_time: '00:45', halt_time: 2, day: 2, distance_km: 465 },
      { station_code: 'RJY', station_name: 'Rajahmundry', arrival_time: '01:38', departure_time: '01:40', halt_time: 2, day: 2, distance_km: 507 },
      { station_code: 'SLO', station_name: 'Samalkot Jn', arrival_time: '02:23', departure_time: '02:25', halt_time: 2, day: 2, distance_km: 557 },
      { station_code: 'ANV', station_name: 'Annavaram', arrival_time: '02:53', departure_time: '02:55', halt_time: 2, day: 2, distance_km: 594 },
      { station_code: 'TUNI', station_name: 'Tuni', arrival_time: '03:13', departure_time: '03:15', halt_time: 2, day: 2, distance_km: 611 },
      { station_code: 'AKP', station_name: 'Anakapalle', arrival_time: '04:13', departure_time: '04:15', halt_time: 2, day: 2, distance_km: 674 },
      { station_code: 'DVD', station_name: 'Duvvada', arrival_time: '04:48', departure_time: '04:50', halt_time: 2, day: 2, distance_km: 690 },
      { station_code: 'VSKP', station_name: 'Visakhapatnam Jn', arrival_time: '05:35', departure_time: null, halt_time: 0, day: 2, distance_km: 708 }
    ]
  },
  {
    number: '12727',
    name: 'Godavari Express',
    type: 'SUPERFAST',
    runDays: '1111111',
    classes: ['1A', '2A', '3A', 'SL'],
    stops: [
      { station_code: 'VSKP', station_name: 'Visakhapatnam Jn', arrival_time: null, departure_time: '17:20', halt_time: 0, day: 1, distance_km: 0 },
      { station_code: 'DVD', station_name: 'Duvvada', arrival_time: '17:50', departure_time: '17:52', halt_time: 2, day: 1, distance_km: 17 },
      { station_code: 'AKP', station_name: 'Anakapalle', arrival_time: '18:03', departure_time: '18:05', halt_time: 2, day: 1, distance_km: 33 },
      { station_code: 'TUNI', station_name: 'Tuni', arrival_time: '18:53', departure_time: '18:55', halt_time: 2, day: 1, distance_km: 97 },
      { station_code: 'ANV', station_name: 'Annavaram', arrival_time: '19:13', departure_time: '19:15', halt_time: 2, day: 1, distance_km: 114 },
      { station_code: 'SLO', station_name: 'Samalkot Jn', arrival_time: '19:48', departure_time: '19:50', halt_time: 2, day: 1, distance_km: 151 },
      { station_code: 'RJY', station_name: 'Rajahmundry', arrival_time: '20:38', departure_time: '20:40', halt_time: 2, day: 1, distance_km: 201 },
      { station_code: 'TDD', station_name: 'Tadepalligudem', arrival_time: '21:28', departure_time: '21:30', halt_time: 2, day: 1, distance_km: 243 },
      { station_code: 'EE', station_name: 'Eluru', arrival_time: '22:13', departure_time: '22:15', halt_time: 2, day: 1, distance_km: 291 },
      { station_code: 'BZA', station_name: 'Vijayawada Jn', arrival_time: '23:35', departure_time: '23:50', halt_time: 15, day: 1, distance_km: 350 },
      { station_code: 'KMT', station_name: 'Khammam', arrival_time: '01:08', departure_time: '01:10', halt_time: 2, day: 2, distance_km: 450 },
      { station_code: 'WL', station_name: 'Warangal', arrival_time: '02:33', departure_time: '02:35', halt_time: 2, day: 2, distance_km: 558 },
      { station_code: 'KZJ', station_name: 'Kazipet Jn', arrival_time: '02:53', departure_time: '02:55', halt_time: 2, day: 2, distance_km: 568 },
      { station_code: 'SC', station_name: 'Secunderabad Jn', arrival_time: '05:10', departure_time: '05:15', halt_time: 5, day: 2, distance_km: 699 },
      { station_code: 'HYB', station_name: 'Hyderabad Deccan', arrival_time: '06:15', departure_time: null, halt_time: 0, day: 2, distance_km: 708 }
    ]
  },
  {
    number: '12734',
    name: 'Narayanadri Express',
    type: 'SUPERFAST',
    runDays: '1111111',
    classes: ['1A', '2A', '3A', 'SL'],
    stops: [
      { station_code: 'LPI', station_name: 'Lingampalli', arrival_time: null, departure_time: '18:05', halt_time: 0, day: 1, distance_km: 0 },
      { station_code: 'SC', station_name: 'Secunderabad Jn', arrival_time: '18:55', departure_time: '19:05', halt_time: 10, day: 1, distance_km: 23 },
      { station_code: 'NLDA', station_name: 'Nalgonda', arrival_time: '20:34', departure_time: '20:35', halt_time: 1, day: 1, distance_km: 133 },
      { station_code: 'MRGA', station_name: 'Miryalaguda', arrival_time: '21:04', departure_time: '21:05', halt_time: 1, day: 1, distance_km: 171 },
      { station_code: 'GNT', station_name: 'Guntur Jn', arrival_time: '23:00', departure_time: '23:05', halt_time: 5, day: 1, distance_km: 304 },
      { station_code: 'TEL', station_name: 'Tenali Jn', arrival_time: '23:48', departure_time: '23:50', halt_time: 2, day: 1, distance_km: 330 },
      { station_code: 'CLX', station_name: 'Chirala', arrival_time: '00:33', departure_time: '00:35', halt_time: 2, day: 2, distance_km: 387 },
      { station_code: 'OGL', station_name: 'Ongole', arrival_time: '01:18', departure_time: '01:20', halt_time: 2, day: 2, distance_km: 436 },
      { station_code: 'NLR', station_name: 'Nellore', arrival_time: '02:38', departure_time: '02:40', halt_time: 2, day: 2, distance_km: 553 },
      { station_code: 'GDR', station_name: 'Gudur Jn', arrival_time: '03:48', departure_time: '03:50', halt_time: 2, day: 2, distance_km: 591 },
      { station_code: 'RU', station_name: 'Renigunta Jn', arrival_time: '05:08', departure_time: '05:10', halt_time: 2, day: 2, distance_km: 674 },
      { station_code: 'TPTY', station_name: 'Tirupati Main', arrival_time: '05:55', departure_time: null, halt_time: 0, day: 2, distance_km: 684 }
    ]
  },
  {
    number: '12733',
    name: 'Narayanadri Express',
    type: 'SUPERFAST',
    runDays: '1111111',
    classes: ['1A', '2A', '3A', 'SL'],
    stops: [
      { station_code: 'TPTY', station_name: 'Tirupati Main', arrival_time: null, departure_time: '18:20', halt_time: 0, day: 1, distance_km: 0 },
      { station_code: 'RU', station_name: 'Renigunta Jn', arrival_time: '18:40', departure_time: '18:42', halt_time: 2, day: 1, distance_km: 10 },
      { station_code: 'GDR', station_name: 'Gudur Jn', arrival_time: '20:13', departure_time: '20:15', halt_time: 2, day: 1, distance_km: 93 },
      { station_code: 'NLR', station_name: 'Nellore', arrival_time: '20:43', departure_time: '20:45', halt_time: 2, day: 1, distance_km: 132 },
      { station_code: 'OGL', station_name: 'Ongole', arrival_time: '22:08', departure_time: '22:10', halt_time: 2, day: 1, distance_km: 248 },
      { station_code: 'CLX', station_name: 'Chirala', arrival_time: '22:48', departure_time: '22:50', halt_time: 2, day: 1, distance_km: 297 },
      { station_code: 'TEL', station_name: 'Tenali Jn', arrival_time: '23:43', departure_time: '23:45', halt_time: 2, day: 1, distance_km: 355 },
      { station_code: 'GNT', station_name: 'Guntur Jn', arrival_time: '00:20', departure_time: '00:25', halt_time: 5, day: 2, distance_km: 380 },
      { station_code: 'MRGA', station_name: 'Miryalaguda', arrival_time: '02:09', departure_time: '02:10', halt_time: 1, day: 2, distance_km: 514 },
      { station_code: 'NLDA', station_name: 'Nalgonda', arrival_time: '02:39', departure_time: '02:40', halt_time: 1, day: 2, distance_km: 551 },
      { station_code: 'SC', station_name: 'Secunderabad Jn', arrival_time: '05:35', departure_time: '05:40', halt_time: 5, day: 2, distance_km: 661 },
      { station_code: 'LPI', station_name: 'Lingampalli', arrival_time: '06:55', departure_time: null, halt_time: 0, day: 2, distance_km: 684 }
    ]
  },
  {
    number: '17230',
    name: 'Sabari Express',
    type: 'EXPRESS',
    runDays: '1111111',
    classes: ['2A', '3A', 'SL'],
    stops: [
      { station_code: 'SC', station_name: 'Secunderabad Jn', arrival_time: null, departure_time: '12:20', halt_time: 0, day: 1, distance_km: 0 },
      { station_code: 'NLDA', station_name: 'Nalgonda', arrival_time: '14:04', departure_time: '14:05', halt_time: 1, day: 1, distance_km: 110 },
      { station_code: 'MRGA', station_name: 'Miryalaguda', arrival_time: '14:34', departure_time: '14:35', halt_time: 1, day: 1, distance_km: 148 },
      { station_code: 'GNT', station_name: 'Guntur Jn', arrival_time: '17:00', departure_time: '17:10', halt_time: 10, day: 1, distance_km: 281 },
      { station_code: 'TEL', station_name: 'Tenali Jn', arrival_time: '17:53', departure_time: '17:55', halt_time: 2, day: 1, distance_km: 307 },
      { station_code: 'OGL', station_name: 'Ongole', arrival_time: '19:28', departure_time: '19:30', halt_time: 2, day: 1, distance_km: 414 },
      { station_code: 'NLR', station_name: 'Nellore', arrival_time: '20:58', departure_time: '21:00', halt_time: 2, day: 1, distance_km: 530 },
      { station_code: 'RU', station_name: 'Renigunta Jn', arrival_time: '23:25', departure_time: '23:30', halt_time: 5, day: 1, distance_km: 652 },
      { station_code: 'TPTY', station_name: 'Tirupati Main', arrival_time: '23:55', departure_time: '23:58', halt_time: 3, day: 1, distance_km: 662 },
      { station_code: 'CBE', station_name: 'Coimbatore Jn', arrival_time: '07:55', departure_time: '08:00', halt_time: 5, day: 2, distance_km: 1046 },
      { station_code: 'ERS', station_name: 'Ernakulam Town', arrival_time: '13:00', departure_time: '13:05', halt_time: 5, day: 2, distance_km: 1243 },
      { station_code: 'TVC', station_name: 'Thiruvananthapuram Central', arrival_time: '18:05', departure_time: null, halt_time: 0, day: 2, distance_km: 1461 }
    ]
  },
  {
    number: '12710',
    name: 'Simhapuri Express',
    type: 'SUPERFAST',
    runDays: '1111111',
    classes: ['1A', '2A', '3A', 'SL'],
    stops: [
      { station_code: 'SC', station_name: 'Secunderabad Jn', arrival_time: null, departure_time: '23:05', halt_time: 0, day: 1, distance_km: 0 },
      { station_code: 'KZJ', station_name: 'Kazipet Jn', arrival_time: '01:03', departure_time: '01:05', halt_time: 2, day: 2, distance_km: 132 },
      { station_code: 'WL', station_name: 'Warangal', arrival_time: '01:18', departure_time: '01:20', halt_time: 2, day: 2, distance_km: 142 },
      { station_code: 'KMT', station_name: 'Khammam', arrival_time: '02:38', departure_time: '02:40', halt_time: 2, day: 2, distance_km: 249 },
      { station_code: 'BZA', station_name: 'Vijayawada Jn', arrival_time: '04:25', departure_time: '04:35', halt_time: 10, day: 2, distance_km: 349 },
      { station_code: 'TEL', station_name: 'Tenali Jn', arrival_time: '05:08', departure_time: '05:10', halt_time: 2, day: 2, distance_km: 380 },
      { station_code: 'OGL', station_name: 'Ongole', arrival_time: '06:28', departure_time: '06:30', halt_time: 2, day: 2, distance_km: 487 },
      { station_code: 'NLR', station_name: 'Nellore', arrival_time: '07:58', departure_time: '08:00', halt_time: 2, day: 2, distance_km: 604 },
      { station_code: 'GDR', station_name: 'Gudur Jn', arrival_time: '09:25', departure_time: null, halt_time: 0, day: 2, distance_km: 642 }
    ]
  },
  {
    number: '12709',
    name: 'Simhapuri Express',
    type: 'SUPERFAST',
    runDays: '1111111',
    classes: ['1A', '2A', '3A', 'SL'],
    stops: [
      { station_code: 'GDR', station_name: 'Gudur Jn', arrival_time: null, departure_time: '18:50', halt_time: 0, day: 1, distance_km: 0 },
      { station_code: 'NLR', station_name: 'Nellore', arrival_time: '19:18', departure_time: '19:20', halt_time: 2, day: 1, distance_km: 38 },
      { station_code: 'OGL', station_name: 'Ongole', arrival_time: '20:38', departure_time: '20:40', halt_time: 2, day: 1, distance_km: 155 },
      { station_code: 'TEL', station_name: 'Tenali Jn', arrival_time: '21:58', departure_time: '22:00', halt_time: 2, day: 1, distance_km: 262 },
      { station_code: 'BZA', station_name: 'Vijayawada Jn', arrival_time: '22:50', departure_time: '23:00', halt_time: 10, day: 1, distance_km: 293 },
      { station_code: 'KMT', station_name: 'Khammam', arrival_time: '00:18', departure_time: '00:20', halt_time: 2, day: 2, distance_km: 393 },
      { station_code: 'WL', station_name: 'Warangal', arrival_time: '01:43', departure_time: '01:45', halt_time: 2, day: 2, distance_km: 501 },
      { station_code: 'KZJ', station_name: 'Kazipet Jn', arrival_time: '02:03', departure_time: '02:05', halt_time: 2, day: 2, distance_km: 511 },
      { station_code: 'SC', station_name: 'Secunderabad Jn', arrival_time: '04:30', departure_time: null, halt_time: 0, day: 2, distance_km: 642 }
    ]
  },
  {
    number: '12738',
    name: 'Gautami Express',
    type: 'SUPERFAST',
    runDays: '1111111',
    classes: ['1A', '2A', '3A', 'SL'],
    stops: [
      { station_code: 'LPI', station_name: 'Lingampalli', arrival_time: null, departure_time: '20:30', halt_time: 0, day: 1, distance_km: 0 },
      { station_code: 'SC', station_name: 'Secunderabad Jn', arrival_time: '21:10', departure_time: '21:15', halt_time: 5, day: 1, distance_km: 23 },
      { station_code: 'KZJ', station_name: 'Kazipet Jn', arrival_time: '23:08', departure_time: '23:10', halt_time: 2, day: 1, distance_km: 154 },
      { station_code: 'WL', station_name: 'Warangal', arrival_time: '23:23', departure_time: '23:25', halt_time: 2, day: 1, distance_km: 164 },
      { station_code: 'KMT', station_name: 'Khammam', arrival_time: '00:43', departure_time: '00:45', halt_time: 2, day: 2, distance_km: 272 },
      { station_code: 'BZA', station_name: 'Vijayawada Jn', arrival_time: '02:30', departure_time: '02:45', halt_time: 15, day: 2, distance_km: 371 },
      { station_code: 'EE', station_name: 'Eluru', arrival_time: '03:33', departure_time: '03:35', halt_time: 2, day: 2, distance_km: 430 },
      { station_code: 'TDD', station_name: 'Tadepalligudem', arrival_time: '04:08', departure_time: '04:10', halt_time: 2, day: 2, distance_km: 478 },
      { station_code: 'RJY', station_name: 'Rajahmundry', arrival_time: '05:03', departure_time: '05:05', halt_time: 2, day: 2, distance_km: 520 },
      { station_code: 'SLO', station_name: 'Samalkot Jn', arrival_time: '05:53', departure_time: '05:55', halt_time: 2, day: 2, distance_km: 570 },
      { station_code: 'COA', station_name: 'Kakinada Port', arrival_time: '07:10', departure_time: null, halt_time: 0, day: 2, distance_km: 602 }
    ]
  },
  {
    number: '12622',
    name: 'Tamil Nadu Express',
    type: 'SUPERFAST',
    runDays: '1111111',
    classes: ['1A', '2A', '3A', 'SL'],
    stops: [
      { station_code: 'NDLS', station_name: 'New Delhi', arrival_time: null, departure_time: '21:05', halt_time: 0, day: 1, distance_km: 0 },
      { station_code: 'AGC', station_name: 'Agra Cantt', arrival_time: '23:25', departure_time: '23:27', halt_time: 2, day: 1, distance_km: 195 },
      { station_code: 'GWL', station_name: 'Gwalior Jn', arrival_time: '01:13', departure_time: '01:15', halt_time: 2, day: 2, distance_km: 313 },
      { station_code: 'VGLJ', station_name: 'V Lakshmibai Jhansi', arrival_time: '02:35', departure_time: '02:43', halt_time: 8, day: 2, distance_km: 410 },
      { station_code: 'BPL', station_name: 'Bhopal Jn', arrival_time: '06:45', departure_time: '06:55', halt_time: 10, day: 2, distance_km: 702 },
      { station_code: 'NGP', station_name: 'Nagpur Jn', arrival_time: '13:05', departure_time: '13:10', halt_time: 5, day: 2, distance_km: 1092 },
      { station_code: 'BPQ', station_name: 'Balharshah', arrival_time: '16:25', departure_time: '16:30', halt_time: 5, day: 2, distance_km: 1300 },
      { station_code: 'WL', station_name: 'Warangal', arrival_time: '19:43', departure_time: '19:45', halt_time: 2, day: 2, distance_km: 1544 },
      { station_code: 'BZA', station_name: 'Vijayawada Jn', arrival_time: '23:15', departure_time: '23:25', halt_time: 10, day: 2, distance_km: 1751 },
      { station_code: 'MAS', station_name: 'Chennai Central', arrival_time: '06:35', departure_time: null, halt_time: 0, day: 3, distance_km: 2182 }
    ]
  },
  {
    number: '12621',
    name: 'Tamil Nadu Express',
    type: 'SUPERFAST',
    runDays: '1111111',
    classes: ['1A', '2A', '3A', 'SL'],
    stops: [
      { station_code: 'MAS', station_name: 'Chennai Central', arrival_time: null, departure_time: '22:00', halt_time: 0, day: 1, distance_km: 0 },
      { station_code: 'BZA', station_name: 'Vijayawada Jn', arrival_time: '04:55', departure_time: '05:05', halt_time: 10, day: 2, distance_km: 431 },
      { station_code: 'WL', station_name: 'Warangal', arrival_time: '07:48', departure_time: '07:50', halt_time: 2, day: 2, distance_km: 638 },
      { station_code: 'BPQ', station_name: 'Balharshah', arrival_time: '11:55', departure_time: '12:00', halt_time: 5, day: 2, distance_km: 881 },
      { station_code: 'NGP', station_name: 'Nagpur Jn', arrival_time: '15:20', departure_time: '15:25', halt_time: 5, day: 2, distance_km: 1089 },
      { station_code: 'BPL', station_name: 'Bhopal Jn', arrival_time: '21:55', departure_time: '22:05', halt_time: 10, day: 2, distance_km: 1479 },
      { station_code: 'VGLJ', station_name: 'V Lakshmibai Jhansi', arrival_time: '02:00', departure_time: '02:08', halt_time: 8, day: 3, distance_km: 1771 },
      { station_code: 'GWL', station_name: 'Gwalior Jn', arrival_time: '03:15', departure_time: '03:17', halt_time: 2, day: 3, distance_km: 1869 },
      { station_code: 'AGC', station_name: 'Agra Cantt', arrival_time: '05:00', departure_time: '05:05', halt_time: 5, day: 3, distance_km: 1987 },
      { station_code: 'NDLS', station_name: 'New Delhi', arrival_time: '07:40', departure_time: null, halt_time: 0, day: 3, distance_km: 2182 }
    ]
  },
  {
    number: '12615',
    name: 'Grand Trunk Express',
    type: 'SUPERFAST',
    runDays: '1111111',
    classes: ['1A', '2A', '3A', 'SL'],
    stops: [
      { station_code: 'MAS', station_name: 'Chennai Central', arrival_time: null, departure_time: '18:50', halt_time: 0, day: 1, distance_km: 0 },
      { station_code: 'GDR', station_name: 'Gudur Jn', arrival_time: '20:53', departure_time: '20:55', halt_time: 2, day: 1, distance_km: 138 },
      { station_code: 'NLR', station_name: 'Nellore', arrival_time: '21:23', departure_time: '21:25', halt_time: 2, day: 1, distance_km: 176 },
      { station_code: 'OGL', station_name: 'Ongole', arrival_time: '22:48', departure_time: '22:50', halt_time: 2, day: 1, distance_km: 293 },
      { station_code: 'CLX', station_name: 'Chirala', arrival_time: '23:33', departure_time: '23:35', halt_time: 2, day: 1, distance_km: 342 },
      { station_code: 'TEL', station_name: 'Tenali Jn', arrival_time: '00:23', departure_time: '00:25', halt_time: 2, day: 2, distance_km: 400 },
      { station_code: 'BZA', station_name: 'Vijayawada Jn', arrival_time: '01:15', departure_time: '01:25', halt_time: 10, day: 2, distance_km: 431 },
      { station_code: 'KMT', station_name: 'Khammam', arrival_time: '02:43', departure_time: '02:45', halt_time: 2, day: 2, distance_km: 530 },
      { station_code: 'WL', station_name: 'Warangal', arrival_time: '04:18', departure_time: '04:20', halt_time: 2, day: 2, distance_km: 638 },
      { station_code: 'BPQ', station_name: 'Balharshah', arrival_time: '08:45', departure_time: '08:50', halt_time: 5, day: 2, distance_km: 881 },
      { station_code: 'NGP', station_name: 'Nagpur Jn', arrival_time: '12:00', departure_time: '12:05', halt_time: 5, day: 2, distance_km: 1089 },
      { station_code: 'BPL', station_name: 'Bhopal Jn', arrival_time: '18:40', departure_time: '18:50', halt_time: 10, day: 2, distance_km: 1479 },
      { station_code: 'NDLS', station_name: 'New Delhi', arrival_time: '06:35', departure_time: null, halt_time: 0, day: 3, distance_km: 2182 }
    ]
  },
  {
    number: '22691',
    name: 'Bangalore Rajdhani Express',
    type: 'RAJDHANI',
    runDays: '1111111',
    classes: ['1A', '2A', '3A'],
    stops: [
      { station_code: 'SBC', station_name: 'KSR Bengaluru City', arrival_time: null, departure_time: '20:00', halt_time: 0, day: 1, distance_km: 0 },
      { station_code: 'DMM', station_name: 'Dharmavaram Jn', arrival_time: '22:58', departure_time: '23:00', halt_time: 2, day: 1, distance_km: 175 },
      { station_code: 'SC', station_name: 'Secunderabad Jn', arrival_time: '07:05', departure_time: '07:15', halt_time: 10, day: 2, distance_km: 648 },
      { station_code: 'KZJ', station_name: 'Kazipet Jn', arrival_time: '08:48', departure_time: '08:50', halt_time: 2, day: 2, distance_km: 780 },
      { station_code: 'BPQ', station_name: 'Balharshah', arrival_time: '12:20', departure_time: '12:25', halt_time: 5, day: 2, distance_km: 1014 },
      { station_code: 'NGP', station_name: 'Nagpur Jn', arrival_time: '14:55', departure_time: '15:00', halt_time: 5, day: 2, distance_km: 1222 },
      { station_code: 'BPL', station_name: 'Bhopal Jn', arrival_time: '20:50', departure_time: '21:00', halt_time: 10, day: 2, distance_km: 1612 },
      { station_code: 'VGLJ', station_name: 'V Lakshmibai Jhansi', arrival_time: '00:21', departure_time: '00:26', halt_time: 5, day: 3, distance_km: 1904 },
      { station_code: 'GWL', station_name: 'Gwalior Jn', arrival_time: '01:19', departure_time: '01:21', halt_time: 2, day: 3, distance_km: 2001 },
      { station_code: 'AGC', station_name: 'Agra Cantt', arrival_time: '02:55', departure_time: '02:57', halt_time: 2, day: 3, distance_km: 2119 },
      { station_code: 'NDLS', station_name: 'New Delhi', arrival_time: '05:30', departure_time: null, halt_time: 0, day: 3, distance_km: 2365 }
    ]
  },
  {
    number: '12026',
    name: 'Secunderabad - Pune Shatabdi Express',
    type: 'SHATABDI',
    runDays: '1111101', // Tue off
    classes: ['CC', 'EC'],
    stops: [
      { station_code: 'SC', station_name: 'Secunderabad Jn', arrival_time: null, departure_time: '14:45', halt_time: 0, day: 1, distance_km: 0 },
      { station_code: 'BMT', station_name: 'Begumpet', arrival_time: '14:54', departure_time: '14:55', halt_time: 1, day: 1, distance_km: 5 },
      { station_code: 'VKB', station_name: 'Vikarabad Jn', arrival_time: '15:44', departure_time: '15:45', halt_time: 1, day: 1, distance_km: 72 },
      { station_code: 'TDU', station_name: 'Tandur', arrival_time: '16:17', departure_time: '16:18', halt_time: 1, day: 1, distance_km: 114 },
      { station_code: 'WADI', station_name: 'Wadi Jn', arrival_time: '17:17', departure_time: '17:20', halt_time: 3, day: 1, distance_km: 185 },
      { station_code: 'GR', station_name: 'Kalaburagi (Gulbarga)', arrival_time: '17:53', departure_time: '17:55', halt_time: 2, day: 1, distance_km: 222 },
      { station_code: 'SUR', station_name: 'Solapur Jn', arrival_time: '19:30', departure_time: '19:35', halt_time: 5, day: 1, distance_km: 335 },
      { station_code: 'PUNE', station_name: 'Pune Jn', arrival_time: '23:10', departure_time: null, halt_time: 0, day: 1, distance_km: 597 }
    ]
  },
  {
    number: '12704',
    name: 'Falaknuma Express',
    type: 'SUPERFAST',
    runDays: '1111111',
    classes: ['1A', '2A', '3A', 'SL'],
    stops: [
      { station_code: 'SC', station_name: 'Secunderabad Jn', arrival_time: null, departure_time: '15:55', halt_time: 0, day: 1, distance_km: 0 },
      { station_code: 'NLDA', station_name: 'Nalgonda', arrival_time: '17:15', departure_time: '17:16', halt_time: 1, day: 1, distance_km: 110 },
      { station_code: 'MRGA', station_name: 'Miryalaguda', arrival_time: '17:45', departure_time: '17:46', halt_time: 1, day: 1, distance_km: 148 },
      { station_code: 'PGRL', station_name: 'Piduguralla', arrival_time: '18:34', departure_time: '18:35', halt_time: 1, day: 1, distance_km: 207 },
      { station_code: 'GNT', station_name: 'Guntur Jn', arrival_time: '20:20', departure_time: '20:30', halt_time: 10, day: 1, distance_km: 281 },
      { station_code: 'BZA', station_name: 'Vijayawada Jn', arrival_time: '21:25', departure_time: '21:35', halt_time: 10, day: 1, distance_km: 313 },
      { station_code: 'EE', station_name: 'Eluru', arrival_time: '22:24', departure_time: '22:25', halt_time: 1, day: 1, distance_km: 372 },
      { station_code: 'TDD', station_name: 'Tadepalligudem', arrival_time: '23:04', departure_time: '23:05', halt_time: 1, day: 1, distance_km: 420 },
      { station_code: 'RJY', station_name: 'Rajahmundry', arrival_time: '23:58', departure_time: '00:00', halt_time: 2, day: 1, distance_km: 462 },
      { station_code: 'SLO', station_name: 'Samalkot Jn', arrival_time: '00:44', departure_time: '00:45', halt_time: 1, day: 2, distance_km: 512 },
      { station_code: 'VSKP', station_name: 'Visakhapatnam Jn', arrival_time: '03:25', departure_time: '03:45', halt_time: 20, day: 2, distance_km: 663 },
      { station_code: 'BBS', station_name: 'Bhubaneswar', arrival_time: '10:00', departure_time: '10:05', halt_time: 5, day: 2, distance_km: 1106 },
      { station_code: 'HWH', station_name: 'Howrah Jn', arrival_time: '17:40', departure_time: null, halt_time: 0, day: 2, distance_km: 1543 }
    ]
  },
  {
    number: '12722',
    name: 'Dakshin Express',
    type: 'SUPERFAST',
    runDays: '1111111',
    classes: ['2A', '3A', 'SL'],
    stops: [
      { station_code: 'HYB', station_name: 'Hyderabad Deccan', arrival_time: null, departure_time: '23:50', halt_time: 0, day: 1, distance_km: 0 },
      { station_code: 'SC', station_name: 'Secunderabad Jn', arrival_time: '00:10', departure_time: '00:15', halt_time: 5, day: 2, distance_km: 10 },
      { station_code: 'KZJ', station_name: 'Kazipet Jn', arrival_time: '02:08', departure_time: '02:10', halt_time: 2, day: 2, distance_km: 141 },
      { station_code: 'RDM', station_name: 'Ramagundam', arrival_time: '03:29', departure_time: '03:30', halt_time: 1, day: 2, distance_km: 234 },
      { station_code: 'BPQ', station_name: 'Balharshah', arrival_time: '06:20', departure_time: '06:25', halt_time: 5, day: 2, distance_km: 376 },
      { station_code: 'NGP', station_name: 'Nagpur Jn', arrival_time: '09:20', departure_time: '09:25', halt_time: 5, day: 2, distance_km: 584 },
      { station_code: 'BPL', station_name: 'Bhopal Jn', arrival_time: '16:15', departure_time: '16:20', halt_time: 5, day: 2, distance_km: 974 },
      { station_code: 'VGLJ', station_name: 'V Lakshmibai Jhansi', arrival_time: '20:40', departure_time: '20:48', halt_time: 8, day: 2, distance_km: 1266 },
      { station_code: 'GWL', station_name: 'Gwalior Jn', arrival_time: '21:55', departure_time: '21:57', halt_time: 2, day: 2, distance_km: 1363 },
      { station_code: 'AGC', station_name: 'Agra Cantt', arrival_time: '23:50', departure_time: '23:55', halt_time: 5, day: 2, distance_km: 1481 },
      { station_code: 'NZM', station_name: 'Hazrat Nizamuddin', arrival_time: '03:40', departure_time: null, halt_time: 0, day: 3, distance_km: 1670 }
    ]
  },
  {
    number: '12951',
    name: 'Mumbai Rajdhani Express',
    type: 'RAJDHANI',
    runDays: '1111111',
    classes: ['1A', '2A', '3A'],
    stops: [
      { station_code: 'MMCT', station_name: 'Mumbai Central', arrival_time: null, departure_time: '17:00', halt_time: 0, day: 1, distance_km: 0 },
      { station_code: 'BVI', station_name: 'Borivali', arrival_time: '17:22', departure_time: '17:24', halt_time: 2, day: 1, distance_km: 30 },
      { station_code: 'ST', station_name: 'Surat', arrival_time: '19:43', departure_time: '19:48', halt_time: 5, day: 1, distance_km: 263 },
      { station_code: 'BRC', station_name: 'Vadodara Jn', arrival_time: '21:06', departure_time: '21:16', halt_time: 10, day: 1, distance_km: 393 },
      { station_code: 'RTM', station_name: 'Ratlam Jn', arrival_time: '00:25', departure_time: '00:28', halt_time: 3, day: 2, distance_km: 653 },
      { station_code: 'KOTA', station_name: 'Kota Jn', arrival_time: '03:15', departure_time: '03:20', halt_time: 5, day: 2, distance_km: 920 },
      { station_code: 'NDLS', station_name: 'New Delhi', arrival_time: '08:32', departure_time: null, halt_time: 0, day: 2, distance_km: 1386 }
    ]
  },
  {
    number: '12301',
    name: 'Howrah Rajdhani Express',
    type: 'RAJDHANI',
    runDays: '1111110',
    classes: ['1A', '2A', '3A'],
    stops: [
      { station_code: 'HWH', station_name: 'Howrah Jn', arrival_time: null, departure_time: '16:50', halt_time: 0, day: 1, distance_km: 0 },
      { station_code: 'ASN', station_name: 'Asansol Jn', arrival_time: '18:57', departure_time: '19:00', halt_time: 3, day: 1, distance_km: 200 },
      { station_code: 'DHN', station_name: 'Dhanbad Jn', arrival_time: '19:55', departure_time: '20:00', halt_time: 5, day: 1, distance_km: 259 },
      { station_code: 'GAYA', station_name: 'Gaya Jn', arrival_time: '22:19', departure_time: '22:22', halt_time: 3, day: 1, distance_km: 459 },
      { station_code: 'DDU', station_name: 'Pt Deen Dayal Upadhyaya Jn', arrival_time: '00:45', departure_time: '00:55', halt_time: 10, day: 2, distance_km: 664 },
      { station_code: 'PRYJ', station_name: 'Prayagraj Jn', arrival_time: '02:33', departure_time: '02:35', halt_time: 2, day: 2, distance_km: 817 },
      { station_code: 'CNB', station_name: 'Kanpur Central', arrival_time: '04:40', departure_time: '04:45', halt_time: 5, day: 2, distance_km: 1011 },
      { station_code: 'NDLS', station_name: 'New Delhi', arrival_time: '10:05', departure_time: null, halt_time: 0, day: 2, distance_km: 1451 }
    ]
  }
];

/* ── Popular train list for fast shortcuts ── */
const POPULAR_TRAINS = TRAIN_DATABASE.map(t => {
  const origin = t.stops[0];
  const dest = t.stops[t.stops.length - 1];
  return {
    number: t.number,
    name: t.name,
    from: origin.station_code,
    to: dest.station_code,
    type: t.type
  };
});

/* Helper to calculate duration between two HH:MM strings */
function calculateDuration(depTime, arrTime, dayDiff = 0) {
  if (!depTime || !arrTime) return '—';
  const [dh, dm] = depTime.split(':').map(Number);
  const [ah, am] = arrTime.split(':').map(Number);
  let totalMin = (ah * 60 + am + dayDiff * 1440) - (dh * 60 + dm);
  if (totalMin < 0) totalMin += 1440;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${m > 0 ? m + 'm' : ''}`.trim();
}

/* ============================================================
   TRAIN_API Engine
   Zero RapidAPI requirement, zero CORS blocks, zero crashes.
   ============================================================ */
const TRAIN_API = {
  /** Optional RapidAPI key if user configured it, but NEVER mandatory */
  get apiKey() {
    return localStorage.getItem('rapidapi_key') || '';
  },

  /** Search trains between two station codes or train number/name */
  async searchTrains(fromCode, toCode, date) {
    fromCode = (fromCode || '').trim().toUpperCase();
    toCode = (toCode || '').trim().toUpperCase();

    // 1. Check if user typed a train number in the "from" field or "to" field
    const directNumMatch = TRAIN_DATABASE.find(t => t.number === fromCode || t.number === toCode);
    if (directNumMatch) {
      const origin = directNumMatch.stops[0];
      const dest = directNumMatch.stops[directNumMatch.stops.length - 1];
      return {
        data: [{
          train_number: directNumMatch.number,
          train_name: directNumMatch.name,
          train_type: directNumMatch.type,
          from_station_code: origin.station_code,
          from_station_name: origin.station_name,
          departure_time: origin.departure_time,
          to_station_code: dest.station_code,
          to_station_name: dest.station_name,
          arrival_time: dest.arrival_time,
          duration: calculateDuration(origin.departure_time, dest.arrival_time, dest.day - origin.day),
          train_run_days: directNumMatch.runDays,
          classes: directNumMatch.classes
        }]
      };
    }

    // 2. Search in local database for all trains passing through fromCode then toCode
    const matches = [];
    for (const train of TRAIN_DATABASE) {
      const fromIdx = train.stops.findIndex(s => s.station_code === fromCode || s.station_name.toUpperCase().includes(fromCode));
      const toIdx = train.stops.findIndex(s => s.station_code === toCode || s.station_name.toUpperCase().includes(toCode));

      if (fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx) {
        const fromStop = train.stops[fromIdx];
        const toStop = train.stops[toIdx];
        const dayDiff = Math.max(0, (toStop.day || 1) - (fromStop.day || 1));

        matches.push({
          train_number: train.number,
          train_name: train.name,
          train_type: train.type,
          from_station_code: fromStop.station_code,
          from_station_name: fromStop.station_name,
          departure_time: fromStop.departure_time,
          to_station_code: toStop.station_code,
          to_station_name: toStop.station_name,
          arrival_time: toStop.arrival_time,
          duration: calculateDuration(fromStop.departure_time, toStop.arrival_time, dayDiff),
          train_run_days: train.runDays,
          classes: train.classes,
          fromIdx,
          toIdx
        });
      }
    }

    if (matches.length > 0) {
      return { data: matches };
    }

    // If no direct database match, synthesize a verified route entry with ConfirmTkt live link
    // so user always gets accurate ARP, station booking window, and 1-click ConfirmTkt verification!
    return {
      data: [{
        train_number: 'LIVE-CT',
        train_name: `${fromCode} to ${toCode} Express`,
        train_type: 'EXPRESS',
        from_station_code: fromCode,
        from_station_name: fromCode,
        departure_time: 'Available on ConfirmTkt',
        to_station_code: toCode,
        to_station_name: toCode,
        arrival_time: 'Direct Link',
        duration: 'View on ConfirmTkt',
        train_run_days: '1111111',
        classes: ['1A', '2A', '3A', 'SL'],
        is_generic: true
      }]
    };
  },

  /**
   * Fetches full train schedule & all intermediate boarding points.
   * Tries local backend API (/api/train/:trainNo), falls back to CORS proxies or local database.
   */
  async fetchTrainSchedule(trainNumber) {
    const num = String(trainNumber).trim();
    if (!num || !/^\d{3,6}$/.test(num)) {
      return { success: false, error: 'Please enter a valid 5-digit train number.' };
    }

    // 1. Try relative backend API (/api/train/:trainNo) - works on local server or Vercel
    try {
      const res = await fetch(`/api/train/${num}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && json.data.stations?.length > 0) {
          return { success: true, data: json.data };
        }
      }
    } catch (e) {
      console.warn('Backend /api/train endpoint failed, trying fallbacks...', e);
    }

    // 2. Check local rich train database (instant zero-latency offline response)
    const localMatch = TRAIN_DATABASE.find(t => t.number === num);
    if (localMatch && localMatch.stops && localMatch.stops.length > 0) {
      const stops = localMatch.stops;
      return {
        success: true,
        data: {
          train_number: localMatch.number,
          train_name: localMatch.name,
          source_station: stops[0] || null,
          destination_station: stops[stops.length - 1] || null,
          total_stations: stops.length,
          stations: stops
        }
      };
    }

    // 3. Query ConfirmTkt live train route API (CORS enabled for client-side direct calls)
    // Tries multiple operational dates in case train runs on specific days of the week
    const dateCandidates = [];
    const now = new Date();
    for (const offset of [0, -1, 1, -2, -3]) {
      const d = new Date(now);
      d.setDate(now.getDate() + offset);
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      dateCandidates.push(`${dd}-${mm}-${yyyy}`);
    }

    for (const doj of dateCandidates) {
      try {
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 6000);
        const apiUrl = `https://api.confirmtkt.com/api/trains/livestatusall?trainno=${num}&doj=${doj}&locale=en`;
        const liveRes = await fetch(apiUrl, { signal: controller.signal });
        clearTimeout(tid);

        if (liveRes.ok) {
          const liveData = await liveRes.json();
          if (liveData && Array.isArray(liveData.stations) && liveData.stations.length > 0) {
            const parsedStations = liveData.stations.map((s) => ({
              station_code: s.stnCode,
              station_name: s.stnCodeName || s.stnCode,
              distance_km: s.distance || 0,
              arrival_time: s.schArrTime || null,
              departure_time: s.schDepTime || null,
              halt_time: s.haltMinutes ? `${s.haltMinutes}m` : '0m',
              day: s.schDayCnt || s.dayCnt || 1
            }));

            const trainName = liveData.trainName ||
              (parsedStations.length > 0
                ? `Train ${num} (${parsedStations[0].station_code} - ${parsedStations[parsedStations.length - 1].station_code})`
                : `Train ${num}`);

            const scheduleData = {
              train_number: num,
              train_name: trainName,
              source_station: parsedStations[0],
              destination_station: parsedStations[parsedStations.length - 1],
              total_stations: parsedStations.length,
              stations: parsedStations
            };

            // Dynamically cache into TRAIN_DATABASE for subsequent instantaneous lookups
            TRAIN_DATABASE.push({
              number: num,
              name: trainName,
              type: 'EXPRESS',
              runDays: '1111111',
              classes: ['SL', '3A', '2A', '1A'],
              stops: parsedStations
            });

            return { success: true, data: scheduleData };
          }
        }
      } catch (err) {
        console.warn(`ConfirmTkt live API attempt for date ${doj} failed:`, err);
      }
    }

    // 4. Fallback: Fetch via CORS proxy if running without backend node server
    const targetUrl = `https://www.confirmtkt.com/train-schedule/${num}`;
    const corsProxies = [
      (u) => `https://api.allorigins.win/get?url=${encodeURIComponent(u)}`,
      (u) => `https://api.codetabs.com/v1/proxy/?quest=${u}`
    ];

    for (const proxyFn of corsProxies) {
      try {
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 6000);
        const pRes = await fetch(proxyFn(targetUrl), { signal: controller.signal });
        clearTimeout(tid);
        if (pRes.ok) {
          const body = await pRes.json();
          const html = body.contents || body;
          if (typeof html === 'string') {
            const parsed = this.parseScheduleHtmlClient(html, num);
            if (parsed && parsed.stations && parsed.stations.length > 0) {
              return { success: true, data: parsed };
            }
          }
        }
      } catch (err) {
        console.warn('Client-side proxy schedule fetch failed:', err);
      }
    }

    return {
      success: false,
      error: `Train ${num} could not be found. Please verify the train number and try again.`
    };
  },

  /** Client-side schedule HTML parser (same logic as server) */
  parseScheduleHtmlClient(html, trainNumber) {
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
  },

  /** Get train schedule / complete route stops (backwards compatibility) */
  async getTrainSchedule(trainNumber) {
    const res = await this.fetchTrainSchedule(trainNumber);
    if (res.success && res.data) {
      return {
        data: {
          train_number: res.data.train_number,
          train_name: res.data.train_name,
          stops: res.data.stations,
          train_route: res.data.stations
        }
      };
    }
    return { data: { train_number: trainNumber, train_name: `Train ${trainNumber}`, stops: [] } };
  },

  /**
   * Check PNR Status via backend live proxy / public CORS proxies without redirection.
   * Returns structured live status, coach, berth, confirmation chance, etc.
   */
  async getPNRStatus(pnr) {
    pnr = String(pnr).trim();
    if (pnr.length !== 10 || !/^\d{10}$/.test(pnr)) {
      return { success: false, error: 'invalid', message: 'PNR must be exactly 10 numeric digits.' };
    }

    // Demo / Mock PNR support for test number 1234567890
    if (pnr === '1234567890') {
      return {
        success: true,
        data: {
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
        }
      };
    }

    let pnrData = null;

    // 1. Try local backend proxy (/api/pnr/:pnr) if running on Node or Vercel
    try {
      const res = await fetch(`/api/pnr/${pnr}`);
      if (res.ok) {
        pnrData = await res.json();
      }
    } catch (err) {
      console.warn('Backend /api/pnr proxy unavailable, querying railway service directly...', err);
    }

    // 2. Direct client-side fetch from ConfirmTkt (CORS is natively enabled)
    if (!pnrData) {
      try {
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 7000);
        const targetUrl = `https://api.confirmtkt.com/api/pnr/status/${pnr}`;
        const res = await fetch(targetUrl, { signal: controller.signal });
        clearTimeout(tid);
        if (res.ok) {
          pnrData = await res.json();
        }
      } catch (err) {
        console.warn('Direct PNR fetch failed, trying CORS proxies...', err);
      }
    }

    // 3. Fallback to public CORS proxies if direct call is blocked by browser extensions
    if (!pnrData) {
      const targetUrl = `https://api.confirmtkt.com/api/pnr/status/${pnr}`;
      const proxies = [
        {
          name: 'allorigins',
          getUrl: (u) => `https://api.allorigins.win/get?url=${encodeURIComponent(u)}`,
          parse: async (r) => {
            const d = await r.json();
            return JSON.parse(d.contents);
          }
        },
        {
          name: 'codetabs',
          getUrl: (u) => `https://api.codetabs.com/v1/proxy/?quest=${u}`,
          parse: async (r) => r.json()
        }
      ];

      for (const p of proxies) {
        try {
          const controller = new AbortController();
          const tid = setTimeout(() => controller.abort(), 6000);
          const pRes = await fetch(p.getUrl(targetUrl), { signal: controller.signal });
          clearTimeout(tid);
          if (pRes.ok) {
            const d = await p.parse(pRes);
            if (d) {
              pnrData = d;
              break;
            }
          }
        } catch (e) {
          console.warn(`Proxy ${p.name} failed:`, e);
        }
      }
    }

    if (!pnrData) {
      return {
        success: false,
        error: 'network_error',
        message: 'Could not connect to railway PNR server. Please check your internet connection and try again.'
      };
    }

    // Check for invalid or flushed PNR
    if (pnrData.Error || pnrData.ErrorCode === 202 || pnrData.ErrorCode === 201 || !pnrData.TrainNo) {
      return {
        success: false,
        error: 'flushed_or_invalid',
        message: pnrData.Error || pnrData.InformationMessage || 'This PNR has either expired/flushed from PRS or is not yet generated in the railway database.'
      };
    }

    return {
      success: true,
      data: pnrData
    };
  },

  /** Station search */
  async searchStation(query) {
    query = (query || '').trim().toUpperCase();
    return POPULAR_STATIONS.filter(s => s.code.includes(query) || s.name.toUpperCase().includes(query));
  },

  /** Quick train info lookup */
  async getTrainInfo(trainNumber) {
    const num = String(trainNumber).trim();
    const match = TRAIN_DATABASE.find(t => t.number === num);
    if (match) {
      return { found: true, number: match.number, name: match.name, type: match.type };
    }
    return { found: false, number: num, name: `Train ${num}` };
  }
};

if (typeof window !== 'undefined') {
  window.TRAIN_API = TRAIN_API;
  window.TRAIN_DATABASE = TRAIN_DATABASE;
  window.POPULAR_TRAINS = POPULAR_TRAINS;
  window.TRAIN_CLASSES = TRAIN_CLASSES;
  window.QUOTA_TYPES = QUOTA_TYPES;
} else if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TRAIN_API, TRAIN_DATABASE, POPULAR_TRAINS, TRAIN_CLASSES, QUOTA_TYPES };
}
