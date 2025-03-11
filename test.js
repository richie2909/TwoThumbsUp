import crypto from "crypto"
const secretKey = crypto.randomBytes(64).toString('hex'); // 64 bytes = 512 bits
console.log('Generated Secret Key:', secretKey);