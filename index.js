import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import currencyapi from '@everapi/currencyapi-js';

const app = express();
app.use(cors());
app.use(express.json());

const port = 3001;

// GET endpoint (existing)
app.get("/userPost/", async (req, res) => {
  // Your existing code for handling GET requests
});

// POST endpoint for /b2bbroker
app.post("/b2bbroker", async (req, res) => {
  try {
    // Make the initial API call to get the UUID
    const wizardUrl = "https://bo.razemarkets.com/api/v2/my/signup/wizard";
    const wizardResponse = await fetch(wizardUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body),
      redirect: 'follow'
    });

    // Extract the UUID from the wizard response
    const wizardData = await wizardResponse.json();
    const { uuid } = wizardData;

    // Modify req.body to include the UUID
    req.body.uuid = uuid;

    // Use the retrieved UUID in the subsequent API call
    const signUpUrl = `https://bo.razemarkets.com/api/v2/my/signup/`;
    const signUpResponse = await fetch(signUpUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body),
      redirect: 'follow'
    });

    // Get the response from the final API call
    const signUpData = await signUpResponse.text();

    // Send the response back to the client
    res.status(signUpResponse.status).send(signUpData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

app.get("/currencyapi", async (req, res) => {
  // const client = new currencyapi('cur_live_A6rW1WVXAn9ieeKaFRMnzreK19PYAOUjCfU5RYcR');
  // client.latest({
  //     base_currency: 'USD',
  //     currencies: 'EUR'
  // }).then(response => {
  //     res.send(response);
  //     console.log(response)
  // });


var requestOptions = {
  method: 'GET',
  redirect: 'follow'
};

// AUD - USD
// EUR/USD
// GBD/USD
// GPP/JPY

let overall = [];

await fetch("https://api.currencyapi.com/v3/latest?apikey=cur_live_A6rW1WVXAn9ieeKaFRMnzreK19PYAOUjCfU5RYcR&base_currency=AUD&currencies[]=USD", requestOptions)
  .then(response => response.text())
  .then(result => {
    console.log(JSON.parse(result).data);
    overall = [...overall, JSON.parse(result).data];
  })
  .catch(error => console.log('error', error));
await fetch("https://api.currencyapi.com/v3/latest?apikey=cur_live_A6rW1WVXAn9ieeKaFRMnzreK19PYAOUjCfU5RYcR&base_currency=EUR&currencies[]=USD", requestOptions)
  .then(response => response.text())
  .then(result => {
    overall = [...overall, JSON.parse(result).data];
  })
  .catch(error => console.log('error', error));
await fetch("https://api.currencyapi.com/v3/latest?apikey=cur_live_A6rW1WVXAn9ieeKaFRMnzreK19PYAOUjCfU5RYcR&base_currency=GBP&currencies[]=USD", requestOptions)
  .then(response => response.text())
  .then(result => {
    overall = [...overall, JSON.parse(result).data];
  })
  .catch(error => console.log('error', error));
await fetch("https://api.currencyapi.com/v3/latest?apikey=cur_live_A6rW1WVXAn9ieeKaFRMnzreK19PYAOUjCfU5RYcR&base_currency=GBP&currencies[]=JPY", requestOptions)
  .then(response => response.text())
  .then(result => {
    overall = [...overall, JSON.parse(result).data];
  })
  .catch(error => console.log('error', error));

  res.send(overall);
  console.log(overall);

});

app.listen(process.env.PORT || 3001, function () {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );

  const port = this.address().port;
  const mode = app.settings.env;
  const host = `http://localhost:${port}`; // Replace with your host if not localhost

  // Logging the full URL
  console.log(`Express server listening on: ${host}`);
});
