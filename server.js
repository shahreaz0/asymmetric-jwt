const express = require("express");

const jose = require("jose");

const app = express();

app.use(express.json());

app.use(async (req, res, next) => {
  try {
    const method = req.method;

    const token = (req.headers.authorization || "").split(" ")[1];

    if (!token) return res.send({ message: "Provide token" });

    const JWKS = jose.createRemoteJWKSet(
      new URL("http://localhost:3000/.well-known/jwks.json")
    );

    const { payload } = await jose.jwtVerify(token, JWKS, {
      issuer: "urn:example:issuer",
      audience: "urn:example:audience",
    });

    console.log(payload);

    next();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

app.get("/", (req, res) => {
  res.send({ message: "photos service" });
});

app.get("/photos", (req, res) => {
  res.send({ message: "Protected Photos" });
});

app.listen(8000, () => {
  console.log("http://localhost:8000");
});
