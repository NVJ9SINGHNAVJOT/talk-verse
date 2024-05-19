import * as forge from 'node-forge';
import * as crypto from 'crypto';

const gAlgorithm = process.env.G_ALGORITHM as string;
const customKey = process.env.GROUP_KEY as string;
const iv = process.env.GROUP_IV as string;

// Encrypt a message using the recipient's public key
export function encryptPMessage(message: string, recipientPublicKey: string): string {
    try {
        const publicKey = forge.pki.publicKeyFromPem(recipientPublicKey);
        const encrypted = publicKey.encrypt(message, 'RSA-OAEP', {
            md: forge.md.sha256.create(),
        });
        return forge.util.encode64(encrypted);
    } catch (error) {
        return "";
    }
}

// Decrypt the encrypted message using the recipient's private key
export function decryptPMessage(encryptedMessage: string, recipientPrivateKey: string): string {
    try {
        const privateKey = forge.pki.privateKeyFromPem(recipientPrivateKey);
        const encryptedBytes = forge.util.decode64(encryptedMessage);
        const decrypted = privateKey.decrypt(encryptedBytes, 'RSA-OAEP', {
            md: forge.md.sha256.create(),
        });
        return decrypted;
    } catch (error) {
        return "";
    }
}

export function encryptGMessage(text: string): string {
    try {
        const key = crypto.createHash('sha256').update(customKey).digest(); // Derive a 256-bit key from the custom input
        const cipher = crypto.createCipheriv(gAlgorithm, key, iv);
        let encrypted = cipher.update(text, 'utf-8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    } catch (error) {
        return "";
    }
}

export function decryptGMessage(encryptedText: string): string {
    try {
        const key = crypto.createHash('sha256').update(customKey).digest(); // Derive the same key for decryption
        const decipher = crypto.createDecipheriv(gAlgorithm, key, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');
        return decrypted;
    } catch (error) {
        return "";
    }
}