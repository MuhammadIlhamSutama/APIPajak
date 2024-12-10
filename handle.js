// handle.js
const PTKP = [
    { golongan: 'TK/0', bebasPajak: 54000000 },
    { golongan: 'TK/1', bebasPajak: 58500000 },
    { golongan: 'TK/2', bebasPajak: 63000000 },
    { golongan: 'TK/3', bebasPajak: 67500000 },
    { golongan: 'K/0', bebasPajak: 58500000 },
    { golongan: 'K/1', bebasPajak: 63000000 },
    { golongan: 'K/2', bebasPajak: 67500000 },
    { golongan: 'K/3', bebasPajak: 72000000 },
    { golongan: 'K/I/0', bebasPajak: 112500000 },
    { golongan: 'K/I/1', bebasPajak: 117500000 },
    { golongan: 'K/I/2', bebasPajak: 121500000 },
    { golongan: 'K/I/3', bebasPajak: 126000000 }
  ];
  
  function hitungPPhTerutang(pkp) {
    if (pkp <= 0) return 0;
  
    const tarif = [
      { batas: 60000000, persen: 0.05 },
      { batas: 250000000, persen: 0.15 },
      { batas: 500000000, persen: 0.25 },
      { batas: Infinity, persen: 0.30 }
    ];
  
    let totalPajak = 0;
    let sisaPKP = pkp;
  
    for (let i = 0; i < tarif.length; i++) {
      const { batas, persen } = tarif[i];
      let bagianKenaPajak = Math.min(sisaPKP, batas - (tarif[i - 1]?.batas || 0));
      totalPajak += bagianKenaPajak * persen;
      sisaPKP -= bagianKenaPajak;
      if (sisaPKP <= 0) break;
    }
  
    return totalPajak;
  }
  
  function handleTaxCalculationUnder2025(req, res) {
    const { tahun, penghasilan, golongan } = req.body;
  
    if (typeof penghasilan !== 'number' || penghasilan < 0) {
      return res.status(400).json({ error: "Tolong masukkan angka penghasilan yang valid" });
    }
  
    let taxAmount = 0;
  
    switch (golongan) {
      case 'pribadi':
        taxAmount = penghasilan <= 500000000 ? 0 : (tahun <= 7 ? 0.005 : 0.01);
        break;
      case 'CV':
        taxAmount = tahun <= 4 ? 0.05 : 0;
        break;
      case 'PT':
        taxAmount = tahun <= 3 ? 0.5 : 0;
        break;
      default:
        return res.status(400).json({ error: "Golongan tidak valid" });
    }
  
    const final = penghasilan * taxAmount;
    res.json({ taxAmount: final });
  }
  
  function handleTaxCalculation2025(req, res) {
    const { penghasilan, golongan, norma } = req.body;
  
    if (typeof penghasilan !== 'number' || penghasilan < 0) {
      return res.status(400).json({ error: "Tolong masukkan angka penghasilan yang valid" });
    }
  
    const ptkpEntry = PTKP.find(entry => entry.golongan === golongan);
    if (!ptkpEntry) {
      return res.status(400).json({ error: "Golongan tidak ditemukan" });
    }
  
    const ptkp = ptkpEntry.bebasPajak;
    const LKU = norma / 100;
    const penghasilanNetto = penghasilan * LKU;
    const pkp = penghasilanNetto - ptkp;
    const totalPajak = hitungPPhTerutang(Math.max(pkp, 0)) / 12;
  
    res.json({
      penghasilan,
      penghasilanNetto,
      ptkp,
      pkp: Math.max(pkp, 0),
      PPHTerutang: totalPajak,
      taxAmount: Math.round(totalPajak)
    });
  }
  
  function handleProgressiveTax(req, res) {
    const { penghasilan, hargaPokok, biayaUsaha, golongan } = req.body;
  
    if (typeof penghasilan !== 'number' || typeof hargaPokok !== 'number' || typeof biayaUsaha !== 'number') {
      return res.status(400).json({ error: "Semua input harus berupa angka" });
    }
  
    const ptkpEntry = PTKP.find(entry => entry.golongan === golongan);
    if (!ptkpEntry) {
      return res.status(400).json({ error: "Golongan tidak ditemukan" });
    }
  
    const penghasilanNetto = penghasilan - hargaPokok - biayaUsaha;
    const pkp = penghasilanNetto - ptkpEntry.bebasPajak;
    const totalPajak = hitungPPhTerutang(Math.max(pkp, 0));
  
    res.json({ totalPajak });
  }
  
  module.exports = {
    handleTaxCalculationUnder2025,
    handleTaxCalculation2025,
    handleProgressiveTax
  };
  