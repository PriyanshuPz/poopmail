export const RESERVED_USERNAMES = [
  "admin",
  "administrator",
  "root",
  "system",
  "sys",
  "sysadmin",
  "webmaster",
  "postmaster",
  "hostmaster",
  "moderator",
  "mod",
  "support",
  "help",
  "helpdesk",
  "service",
  "contact",
  "info",
  "mail",
  "email",
  "noreply",
  "no-reply",
  "donotreply",
  "notifications",
  "notification",
  "alerts",
  "alert",
  
  "abuse",
  "legal",
  "dmca",
  "copyright",
  "trademark",
  "privacy",
  "terms",
  "security",
  "compliance",
  "fraud",
  "spam",
  "phishing",
  "report",
  "reports",
  
  "api",
  "www",
  "ftp",
  "smtp",
  "pop",
  "pop3",
  "imap",
  "http",
  "https",
  "ssl",
  "tls",
  "vpn",
  "dns",
  
  "mailer",
  "daemon",
  "nobody",
  "anonymous",
  "guest",
  "public",
  "test",
  "demo",
  "example",
  "sample",
  
  "sales",
  "marketing",
  "billing",
  "invoice",
  "payment",
  "finance",
  "accounting",
  "hr",
  "recruitment",
  "careers",
  "jobs",
  
  "community",
  "forum",
  "blog",
  "news",
  "press",
  "media",
  "social",
  
  "dev",
  "developer",
  "development",
  "staging",
  "production",
  "prod",
  "backup",
  "archive",
  "logs",
  "status",
  
  "bot",
  "automated",
  "script",
  "null",
  "undefined",
  "void",
  "delete",
  "remove",
  "admin123",
  "password",
  
  "tsbin",
  "poopmail",
  "tempmail",
  "temp",
  "temporary",
  "disposable",
  
  "secure",
  "verified",
  "official",
  "staff",
  "team",
  "owner",
  "ceo",
  "cto",
  "cfo",
];

export function isReservedUsername(username: string): boolean {
  if (!username) return false;
  
  const normalizedUsername = username.toLowerCase().trim();
  
  // Check exact matches
  if (RESERVED_USERNAMES.includes(normalizedUsername)) {
    return true;
  }
  
  // Check if it starts with reserved prefixes
  const reservedPrefixes = ["admin", "system", "support", "mod", "root"];
  if (reservedPrefixes.some(prefix => normalizedUsername.startsWith(prefix))) {
    return true;
  }
  
  // Check if it contains reserved patterns
  const reservedPatterns = ["noreply", "no-reply", "donotreply"];
  if (reservedPatterns.some(pattern => normalizedUsername.includes(pattern))) {
    return true;
  }
  
  return false;
}


export function getReservedUsernameError(username: string): string {
  return `The username "${username}" is reserved and cannot be used. Please choose a different username.`;
}
