import { generateKeyPair, exportJWK, exportPKCS8, exportSPKI } from 'jose/jwk/generate';
import fs from 'fs/promises';

async function generateKeys() {
    try {
        const { publicKey, privateKey } = await generateKeyPair('RS256');

        // Export keys in JWK format (JSON Web Key)
        const publicKeyJwk = await exportJWK(publicKey);
        const privateKeyJwk = await exportJWK(privateKey);

        // Export keys in PEM format (PKCS#8 for private, SPKI for public)
        const privateKeyPem = await exportPKCS8(privateKey);
        const publicKeyPem = await exportSPKI(publicKey);

        // Save keys to files
        await fs.writeFile('private.pem', privateKeyPem);
        await fs.writeFile('public.pem', publicKeyPem);
        await fs.writeFile('private.json', JSON.stringify(privateKeyJwk, null, 2));
        await fs.writeFile('public.json', JSON.stringify(publicKeyJwk, null, 2));

        console.log('Keys generated and saved to files.');
    } catch (error) {
        console.error('Error generating keys:', error);
    }
}

generateKeys();