const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function toBase64(bytes: Uint8Array) {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function fromBase64(value: string) {
  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

export async function encryptSensitiveValue(plainText: string, passphrase: string) {
  const salt = textEncoder.encode('mamacare-v1');
  const keyMaterial = await crypto.subtle.importKey('raw', textEncoder.encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, textEncoder.encode(plainText));

  return `${toBase64(iv)}:${toBase64(new Uint8Array(cipher))}`;
}

export async function decryptSensitiveValue(cipherText: string, passphrase: string) {
  const [ivValue, cipherValue] = cipherText.split(':');
  if (!ivValue || !cipherValue) {
    throw new Error('Invalid encrypted value');
  }

  const salt = textEncoder.encode('mamacare-v1');
  const keyMaterial = await crypto.subtle.importKey('raw', textEncoder.encode(passphrase), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  const iv = fromBase64(ivValue);
  const cipher = fromBase64(cipherValue);
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher);

  return textDecoder.decode(plain);
}
