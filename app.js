const express = require('express');
const { SessionsClient } = require('@google-cloud/dialogflow-cx'); // Dialogflow CX
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

// Dialogflow CX Configuration (update these as needed)
const projectIdCX = 'capstone-c242-ps457-team'; // Your project ID
const locationCX = 'global'; // Adjust if your agent is in a different location (e.g., 'us-central1')
const agentIdCX = 'e06d58b2-e65c-43a8-a1f3-9ab172ad7d98'; // Your agent ID
const sessionClientCX = new SessionsClient();

// PTKP Data
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

// Function to calculate PPh Terutang (tax calculation)
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

// Routes for tax calculations
app.post('/calculate-under2025', (req, res) => {
    const { tahun, penghasilan, golongan } = req.body;

    if (typeof penghasilan !== 'number' || penghasilan < 0) {
        return res.status(400).json({ error: "Tolong masukkan angka penghasilan yang valid" });
    }

    let final = 0; // Ensure final is always initialized
    let pkp = penghasilan; // Default PKP is the penghasilan, can be adjusted if necessary

    switch (golongan) {
        case 'pribadi':
            if (penghasilan <= 500000000) {
                final = 0; // No tax for penghasilan <= 500 million
            } else if (tahun <= 7) {
                final = penghasilan * 0.005; // 0.5% tax rate
            } else {
                final = hitungPPhTerutang(pkp); // Use progressive calculation
            }
            break;

        case 'CV':
            if (tahun <= 4) {
                final = penghasilan * 0.05; // 5% tax rate
            } else {
                final = hitungPPhTerutang(pkp); // Use progressive calculation
            }
            break;

        case 'PT':
            if (tahun <= 3) {
                final = penghasilan * 0.5; // 50% tax rate
            } else {
                final = hitungPPhTerutang(pkp); // Use progressive calculation
            }
            break;

        default:
            return res.status(400).json({ error: "Golongan tidak valid" });
    }

    res.json({ taxAmount: final });
});

app.post('/calculate-2025', (req, res) => {
    const { penghasilan, golongan, norma } = req.body;

    if (typeof penghasilan !== 'number' || penghasilan < 0) {
        return res.status(400).json({ error: "Tolong masukkan angka penghasilan yang valid" });
    }

    const ptkpEntry = PTKP.find(entry => entry.golongan === golongan);
    if (!ptkpEntry) {
        return res.status(400).json({ error: "Golongan tidak ditemukan" });
    }
    const ptkp = ptkpEntry.bebasPajak;

    // Calculate PKP (Penghasilan Kena Pajak)
    const LKU = norma / 100;
    const penghasilanNetto = penghasilan * LKU; 
    const pkp = penghasilanNetto - ptkp;

    let totalPajak = hitungPPhTerutang(pkp);
    let pkpFinal = Math.max(pkp, 0);

    // Ensure PKP is not negative
    const pphFinal = Math.max(totalPajak, 0);

    // Calculate the final tax amount
    const final = pphFinal / 12;
    let finalRounded = Math.round(final);

    // Include PKP in the response
    res.json({
        penghasilan: penghasilan,
        penghasilanNetto: penghasilanNetto,
        ptkp: ptkp,
        pkp: pkpFinal,
        PPHTerutang: pphFinal,
        taxAmount: finalRounded
    });
});

app.post('/calculate-pembukuan-progresif', (req, res) => {
    const { penghasilan, hargaPokok, biayaUsaha, golongan } = req.body;

    if (typeof penghasilan !== 'number' || typeof hargaPokok !== 'number' || typeof biayaUsaha !== 'number') {
        return res.status(400).json({ error: "Semua input harus berupa angka" });
    }

    const ptkpEntry = PTKP.find(entry => entry.golongan === golongan);
    if (!ptkpEntry) {
        return res.status(400).json({ error: "Golongan tidak ditemukan" });
    }
    const ptkp = ptkpEntry.bebasPajak;

    let penghasilanNetto = penghasilan - hargaPokok - biayaUsaha; 
    let pkp = penghasilanNetto - ptkp;
    let totalPajak = hitungPPhTerutang(pkp);

    res.json({ totalPajak: totalPajak });
});

app.post('/chat', async (req, res) => {
    const userInput = req.body.message; // User's message from the request body
    const languageCode = req.body.language_code || 'id'; // Default to 'en' if no language_code is provided
    const sessionId = uuidv4(); // Generate a unique session ID for each user

    if (!userInput) {
        return res.status(400).json({ error: 'Message is required' });
    }

    // Create a new session for Dialogflow CX
    const sessionPath = sessionClientCX.projectLocationAgentSessionPath(
        projectIdCX,
        locationCX,
        agentIdCX,
        sessionId
    );

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: userInput,
            },
            languageCode: languageCode, // Specify the language code here
        },
    };

    try {
        // Send request to Dialogflow CX agent
        const [response] = await sessionClientCX.detectIntent(request);
        console.log('Full response from Dialogflow CX:', JSON.stringify(response, null, 2)); // Log the full response for debugging
        const result = response.queryResult;

        // Check if responseMessages are present
        if (result.responseMessages && result.responseMessages.length > 0) {
            // Extract text responses from responseMessages
            const messages = result.responseMessages
                .map(msg => {
                    if (msg.text) {
                        return msg.text.text[0]; // Extract the first text message
                    }
                    return null; // Handle other types of messages if needed
                })
                .filter(Boolean); // Remove null values

            // Return the processed messages
            return res.json({
                reply: messages
            });
        } else {
            // If no responseMessages, return a default error
            console.log('No responseMessages found in Dialogflow response.');
            return res.status(404).json({ error: 'No fulfillment response from Dialogflow' });
        }
    } catch (error) {
        // Log the full error details
        console.error('Error during Dialogflow CX request:', error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
});

app.get('/health', (req, res) => {
    res.status(200).send('Healthy');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

