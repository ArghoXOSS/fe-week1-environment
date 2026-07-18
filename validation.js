const DISPLAY_NAME_MIN = 2;
const DISPLAY_NAME_MAX = 50;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VALID_THEMES = new Set(["light", "dark", "system"]);

function validateDisplayName(value) {
  const trimmed = String(value ?? "").trim();

  if (!trimmed) {
    return "Display name is required.";
  }

  if (trimmed.length < DISPLAY_NAME_MIN) {
    return `Display name must be at least ${DISPLAY_NAME_MIN} characters.`;
  }

  if (trimmed.length > DISPLAY_NAME_MAX) {
    return `Display name must be ${DISPLAY_NAME_MAX} characters or fewer.`;
  }

  return "";
}

function validateEmail(value) {
  const trimmed = String(value ?? "").trim();

  if (!trimmed) {
    return "Email address is required.";
  }

  if (!EMAIL_PATTERN.test(trimmed)) {
    return "Please enter a valid email address.";
  }

  return "";
}

function validateTimeZone(value) {
  const trimmed = String(value ?? "").trim();

  if (!trimmed) {
    return "Time zone is required.";
  }

  return "";
}

function validateSettings(settings) {
  const data = settings ?? {};

  return {
    displayName: validateDisplayName(data.displayName),
    email: validateEmail(data.email),
    timeZone: validateTimeZone(data.timeZone),
  };
}

function isFormValid(errors) {
  return Object.values(errors).every((message) => message === "");
}

function normalizeSettings(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return null;
  }

  const theme = VALID_THEMES.has(raw.theme) ? raw.theme : "system";

  return {
    displayName: typeof raw.displayName === "string" ? raw.displayName : "",
    email: typeof raw.email === "string" ? raw.email : "",
    timeZone: typeof raw.timeZone === "string" ? raw.timeZone : "",
    theme,
    emailNotifications: Boolean(raw.emailNotifications),
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    DISPLAY_NAME_MIN,
    DISPLAY_NAME_MAX,
    validateDisplayName,
    validateEmail,
    validateTimeZone,
    validateSettings,
    isFormValid,
    normalizeSettings,
  };
} else {
  window.Validation = {
    validateDisplayName,
    validateEmail,
    validateTimeZone,
    validateSettings,
    isFormValid,
    normalizeSettings,
  };
}
