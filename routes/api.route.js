const router = require("express").Router();
const jose = require("jose");

const fs = require("node:fs/promises");
const path = require("path");

const generateKeys = require("../generate-keys");

router.get("/", async (req, res, next) => {
  res.send({ message: "Ok api is working 🚀" });
});

router.get("/keygen", (req, res) => {
  generateKeys();

  res.send({ message: "Keys generated" });
});

router.get("/login", async (req, res) => {
  const pkcs8 = await fs.readFile(path.join("certs/private.pem"), "utf8");
  const alg = "RS256";

  const privateKey = await jose.importPKCS8(pkcs8, alg);

  const jwt = await new jose.SignJWT({ name: "shahreaz", age: 29, id: 1 })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer("urn:example:issuer")
    .setAudience("urn:example:audience")
    .setExpirationTime("30m")
    .sign(privateKey);

  res.send({ token: jwt });
});

module.exports = router;
