const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const https = require("https");
const http = require("http");


const app = express();
app.use(express.static(path.join(__dirname, "../frontend")));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const API_KEY = "AQErhmfxKo/Iah1Kw0m/n3Q5qf3VbIJeDpxcXXdPV90wefPCpbE909TSb55krhDBXVsNvuR83LVYjEgiTGAH-EU9IXphaQO7IqPbLNRoZsa48U/MtlEA09f6zy1jBkUg=-i1i5C+Ev?2G@4UI(g5+";  // Replace this
const MERCHANT_ACCOUNT = "Discovery_BEAM_INT_TEST";  // Replace this

const adyen = axios.create({
  baseURL: "https://checkout-test.adyen.com/v71",
  headers: {
    "X-API-Key": API_KEY,
    "Content-Type": "application/json"
  }
});

app.post("/paymentMethods", async (req, res) => {
  const request = {
    merchantAccount: MERCHANT_ACCOUNT,
    countryCode: "US",
    channel: "Web",
    amount: { currency: "USD", value: 1000 }
  };
  try {
    const response = await adyen.post("/paymentMethods", request);
    res.json(response.data);
  } catch (error) {
    res.status(500).json(error.response?.data || error.message);
  }
});



app.post("/payments", async (req, res) => {
  try {
    const response = await adyen.post("/payments", {
      ...req.body,
      amount: {
        currency: "USD",
        value: 1000
      },
      reference: `payment-${Date.now()}`,
      merchantAccount: MERCHANT_ACCOUNT
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json(error.response?.data || error.message);
  }
});

const sslOptions = {
  key: fs.readFileSync("./cert/server.key"),
  cert: fs.readFileSync("./cert/server.cert")
};

http.createServer(app).listen(3760, () => {
  console.log("✅ HTTPS server running on http://localhost:3760");
});
