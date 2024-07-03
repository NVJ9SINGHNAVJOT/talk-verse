import * as forge from "node-forge";

const generateAsymmetricKeyPair = () => {
  // Generate a key pair (public and private keys)
  const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
  const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
  const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);

  return { publicKeyPem: publicKeyPem, privateKeyPem: privateKeyPem };
};

export default generateAsymmetricKeyPair;
