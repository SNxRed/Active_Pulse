// server/index.js
const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = 3001; // Puerto para la API intermedia

app.use(express.json());

app.post('/api/validate-signup', async (req, res) => {
  const { userId, firstName, lastName, phoneNumber, address, dateOfBirth, gender, emergencyContactName, emergencyContactPhone } = req.body;

  try {
    const response = await fetch("https://ymjjininyltkzfajvwvd.supabase.co/functions/v1/validate-signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        userId,
        firstName,
        lastName,
        phoneNumber,
        address,
        dateOfBirth,
        gender,
        emergencyContactName,
        emergencyContactPhone,
      }),
    });

    const result = await response.json();
    if (response.ok) {
      res.status(200).json(result);
    } else {
      res.status(response.status).json(result);
    }
  } catch (error) {
    console.error("Error calling validate-signup:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});