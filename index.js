const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
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
