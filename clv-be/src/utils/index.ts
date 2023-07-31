export function generateRandomPassword(): string {
  const passwordLength = 8; // You can adjust the desired password length here
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digitChars = '0123456789';
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  const allChars = lowercaseChars + uppercaseChars + digitChars + specialChars;

  let randomPassword = '';
  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    randomPassword += allChars[randomIndex];
  }

  return randomPassword;
}
