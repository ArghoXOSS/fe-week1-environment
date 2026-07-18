const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const {
  validateDisplayName,
  validateEmail,
  validateTimeZone,
  validateSettings,
  isFormValid,
  normalizeSettings,
} = require("../validation.js");

describe("validateDisplayName", () => {
  it("returns an error for blank fields", () => {
    assert.equal(validateDisplayName(""), "Display name is required.");
    assert.equal(validateDisplayName("   "), "Display name is required.");
  });

  it("returns an error for short names", () => {
    assert.equal(validateDisplayName("A"), "Display name must be at least 2 characters.");
  });

  it("accepts valid names", () => {
    assert.equal(validateDisplayName("Jo"), "");
    assert.equal(validateDisplayName("  Alex Morgan  "), "");
    assert.equal(validateDisplayName("A".repeat(50)), "");
  });

  it("rejects names longer than 50 characters", () => {
    assert.equal(
      validateDisplayName("A".repeat(51)),
      "Display name must be 50 characters or fewer."
    );
  });
});

describe("validateEmail", () => {
  it("returns an error for blank fields", () => {
    assert.equal(validateEmail(""), "Email address is required.");
  });

  it("returns an error for malformed emails", () => {
    assert.equal(validateEmail("not-an-email"), "Please enter a valid email address.");
    assert.equal(validateEmail("missing@domain"), "Please enter a valid email address.");
    assert.equal(validateEmail("@example.com"), "Please enter a valid email address.");
  });

  it("accepts valid emails", () => {
    assert.equal(validateEmail("user@example.com"), "");
    assert.equal(validateEmail("  user.name+tag@example.co.uk  "), "");
  });
});

describe("validateTimeZone", () => {
  it("returns an error for missing time zones", () => {
    assert.equal(validateTimeZone(""), "Time zone is required.");
    assert.equal(validateTimeZone("   "), "Time zone is required.");
  });

  it("accepts a selected time zone", () => {
    assert.equal(validateTimeZone("America/New_York"), "");
  });
});

describe("validateSettings", () => {
  it("accepts valid complete data", () => {
    const errors = validateSettings({
      displayName: "Jane Doe",
      email: "jane@example.com",
      timeZone: "UTC",
    });

    assert.deepEqual(errors, {
      displayName: "",
      email: "",
      timeZone: "",
    });
    assert.equal(isFormValid(errors), true);
  });

  it("returns multiple errors for multiple invalid fields", () => {
    const errors = validateSettings({
      displayName: "J",
      email: "bad-email",
      timeZone: "",
    });

    assert.equal(errors.displayName, "Display name must be at least 2 characters.");
    assert.equal(errors.email, "Please enter a valid email address.");
    assert.equal(errors.timeZone, "Time zone is required.");
    assert.equal(isFormValid(errors), false);
  });
});

describe("normalizeSettings", () => {
  it("returns null for malformed stored data", () => {
    assert.equal(normalizeSettings(null), null);
    assert.equal(normalizeSettings([]), null);
    assert.equal(normalizeSettings("settings"), null);
  });

  it("normalizes partial or invalid stored values safely", () => {
    assert.deepEqual(normalizeSettings({ theme: "invalid" }), {
      displayName: "",
      email: "",
      timeZone: "",
      theme: "system",
      emailNotifications: false,
    });
  });
});
