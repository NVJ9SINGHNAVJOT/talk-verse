import * as forge from "node-forge";

// only for group encryption
const customKey = process.env.GROUP_KEY as string;
const iv = process.env.GROUP_IV as string;
const key = forge.md.sha256.create().update(customKey).digest().getBytes();

// Encrypt a message using the recipient's public key
export function encryptPMessage(message: string, recipientPublicKey: string): string | null {
  try {
    const publicKey = forge.pki.publicKeyFromPem(recipientPublicKey);
    const encrypted = publicKey.encrypt(message, "RSA-OAEP", {
      md: forge.md.sha256.create(),
    });
    return forge.util.encode64(encrypted);
  } catch (error) {
    return null;
  }
}

// Decrypt the encrypted message using the recipient's private key
export function decryptPMessage(encryptedMessage: string, recipientPrivateKey: string): string | null {
  try {
    const privateKey = forge.pki.privateKeyFromPem(recipientPrivateKey);
    const encryptedBytes = forge.util.decode64(encryptedMessage);
    const decrypted = privateKey.decrypt(encryptedBytes, "RSA-OAEP", {
      md: forge.md.sha256.create(),
    });
    return decrypted;
  } catch (error) {
    return null;
  }
}

export function encryptGMessage(text: string): string | null {
  try {
    const cipher = forge.cipher.createCipher("AES-CBC", key);
    cipher.start({ iv });
    cipher.update(forge.util.createBuffer(text));
    cipher.finish();
    const encryptedBytes = cipher.output.getBytes();
    return forge.util.encode64(encryptedBytes);
  } catch (error) {
    return null;
  }
}

export function decryptGMessage(text: string): string | null {
  try {
    const decipher = forge.cipher.createDecipher("AES-CBC", key);
    decipher.start({ iv });
    decipher.update(forge.util.createBuffer(forge.util.decode64(text)));
    decipher.finish();
    const decryptedBytes = decipher.output.getBytes();
    return forge.util.encodeUtf8(decryptedBytes);
  } catch (error) {
    return null;
  }
}
