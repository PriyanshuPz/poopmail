const ALLOWED_DOMAIN =
  process.env.SMTP_DOMAIN || process.env.MAIL_DOMAIN || "mail.tsbin.tech";

export function makeCustomAddress(username: string) {
  const sanitizedUsername = username
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "");

  if (!sanitizedUsername) {
    throw new Error("Invalid username");
  }

  if (sanitizedUsername.length < 1 || sanitizedUsername.length > 64) {
    throw new Error("Username must be between 1 and 64 characters");
  }

  return `${sanitizedUsername}@${ALLOWED_DOMAIN}`;
}