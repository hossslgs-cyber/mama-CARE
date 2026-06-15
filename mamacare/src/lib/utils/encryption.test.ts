import { describe, it, expect } from 'vitest';
import { encryptSensitiveValue, decryptSensitiveValue } from './encryption';

describe('encryptSensitiveValue / decryptSensitiveValue', () => {
  it('round-trips a simple string', async () => {
    const plainText = 'Hello, MamaCare!';
    const passphrase = 'test-passphrase-123';

    const encrypted = await encryptSensitiveValue(plainText, passphrase);
    expect(encrypted).toContain(':');
    expect(encrypted).not.toBe(plainText);

    const decrypted = await decryptSensitiveValue(encrypted, passphrase);
    expect(decrypted).toBe(plainText);
  });

  it('round-trips an empty string', async () => {
    const encrypted = await encryptSensitiveValue('', 'pw');
    const decrypted = await decryptSensitiveValue(encrypted, 'pw');
    expect(decrypted).toBe('');
  });

  it('round-trips unicode content', async () => {
    const text = 'مرحبا 你好 🩺';
    const encrypted = await encryptSensitiveValue(text, 'secret');
    const decrypted = await decryptSensitiveValue(encrypted, 'secret');
    expect(decrypted).toBe(text);
  });

  it('produces different ciphertext for the same input (random IV)', async () => {
    const plain = 'repeat';
    const pw = 'key';
    const a = await encryptSensitiveValue(plain, pw);
    const b = await encryptSensitiveValue(plain, pw);
    expect(a).not.toBe(b);
  });

  it('fails to decrypt with the wrong passphrase', async () => {
    const encrypted = await encryptSensitiveValue('secret', 'correct-password');
    await expect(decryptSensitiveValue(encrypted, 'wrong-password')).rejects.toThrow();
  });

  it('throws on malformed ciphertext (no colon)', async () => {
    await expect(decryptSensitiveValue('nocolon', 'pw')).rejects.toThrow('Invalid encrypted value');
  });
});
