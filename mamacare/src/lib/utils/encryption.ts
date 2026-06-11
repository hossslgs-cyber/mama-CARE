const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const PBKDF2_ITERATIONS = 100_000;
const SALT_LENGTH_BYTES = 16;
const IV_LENGTH_BYTES = 12;

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

async function deriveKey(passphrase: string, salt: Uint8Array, usage: KeyUsage[]) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    usage
  );
}

export async function encryptSensitiveValue(plainText: string, passphrase: string) {
  if (!passphrase) {
    throw new Error('Encryption passphrase must not be empty');
  }

  try {
    const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH_BYTES));
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH_BYTES));
    const key = await deriveKey(passphrase, salt, ['encrypt']);

    const cipher = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      textEncoder.encode(plainText)
    );

    return `${toBase64(salt)}:${toBase64(iv)}:${toBase64(new Uint8Array(cipher))}`;
  } catch (error) {
    if (error instanceof Error && error.message.includes('passphrase')) throw error;
    throw new Error(
      `Encryption failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function decryptSensitiveValue(cipherText: string, passphrase: string) {
  if (!passphrase) {
    throw new Error('Decryption passphrase must not be empty');
  }

  const parts = cipherText.split(':');

  try {
    // Support legacy format (iv:cipher) with static salt for backward compatibility
    if (parts.length === 2) {
      const [ivValue, cipherValue] = parts;
      if (!ivValue || !cipherValue) throw new Error('Invalid encrypted value: expected "iv:ciphertext" format');
      const legacySalt = textEncoder.encode('mamacare-v1');
      const key = await deriveKey(passphrase, legacySalt, ['decrypt']);
      const iv = fromBase64(ivValue);
      const cipher = fromBase64(cipherValue);
      const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher);
      return textDecoder.decode(plain);
    }

    const [saltValue, ivValue, cipherValue] = parts;
    if (!saltValue || !ivValue || !cipherValue) {
      throw new Error('Invalid encrypted value: expected "salt:iv:ciphertext" format');
    }

    const salt = fromBase64(saltValue);
    const key = await deriveKey(passphrase, salt, ['decrypt']);
    const iv = fromBase64(ivValue);
    const cipher = fromBase64(cipherValue);
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher);

    return textDecoder.decode(plain);
  } catch (error) {
    if (error instanceof Error && (error.message.includes('passphrase') || error.message.includes('Invalid encrypted'))) {
      throw error;
    }
    throw new Error(
      `Decryption failed (wrong passphrase or corrupted data): ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
