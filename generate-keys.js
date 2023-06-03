const jose = require("jose");
const fs = require("fs");

async function generateKeys() {
  try {
    const { publicKey, privateKey } = await jose.generateKeyPair("RS256", {
      extractable: true,
    });

    const pkcs8Pem = await jose.exportPKCS8(privateKey);

    const publicJwk = await jose.exportJWK(publicKey);

    const jwks = {
      keys: [publicJwk],
    };

    if (!fs.existsSync("certs")) {
      fs.mkdirSync("certs");
    }

    if (!fs.existsSync("public/.well-known")) {
      fs.mkdirSync("public/.well-known", {
        recursive: true,
      });
    }

    fs.writeFileSync("public/.well-known/jwks.json", JSON.stringify(jwks));

    fs.writeFileSync("certs/private.pem", pkcs8Pem);

    console.log("=============================");
    console.log("Keys generated");
    console.log("=============================");
  } catch (error) {
    console.log(error);
  }
}

// generateKeys();
module.exports = generateKeys;
