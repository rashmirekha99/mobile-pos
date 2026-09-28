export const calculateEAN13Checksum = (digits12: string): string => {
  if (digits12.length !== 12 || !/^\d{12}$/.test(digits12)) {
    throw new Error('EAN-13 requires exactly 12 digits to calculate checksum');
  }

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(digits12[i], 10);
    sum += i % 2 === 0 ? digit : digit * 3;
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return digits12 + checkDigit.toString();
};

export const validateEAN13 = (barcode: string): boolean => {
  if (barcode.length !== 13 || !/^\d{13}$/.test(barcode)) {
    return false;
  }

  const digits12 = barcode.substring(0, 12);
  const expectedChecksum = calculateEAN13Checksum(digits12);
  return barcode === expectedChecksum;
};

export const generateRandomBarcode = (type: 'QR' | 'EAN13' | 'CODE128'): string => {
  const timestamp = Date.now().toString();

  switch (type) {
    case 'EAN13': {
      const digits12 = timestamp.slice(-12).padStart(12, '0');
      return calculateEAN13Checksum(digits12);
    }
    case 'CODE128':
      return `POS-${timestamp.slice(-10)}`;
    case 'QR':
      return `MPOS-${timestamp}`;
    default:
      return timestamp;
  }
};

export const isValidBarcode = (value: string, type: 'QR' | 'EAN13' | 'CODE128'): boolean => {
  if (!value || value.trim().length === 0) return false;

  switch (type) {
    case 'EAN13':
      return validateEAN13(value);
    case 'CODE128':
      return value.length >= 1 && value.length <= 80;
    case 'QR':
      return value.length >= 1 && value.length <= 2048;
    default:
      return false;
  }
};
