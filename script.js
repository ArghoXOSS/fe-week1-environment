const form = document.getElementById("settings-form");
const formStatus = document.getElementById("form-status");
const bioField = document.getElementById("bio");
const bioCount = document.getElementById("bio-count");

const validators = {
  fullName: (value) => {
    const trimmed = value.trim();
    if (!trimmed) return "Full name is required.";
    if (trimmed.length < 2) return "Full name must be at least 2 characters.";
    if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
      return "Full name may only contain letters, spaces, hyphens, and apostrophes.";
    }
    return "";
  },

  email: (value) => {
    const trimmed = value.trim();
    if (!trimmed) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return "Please enter a valid email address.";
    }
    return "";
  },

  username: (value) => {
    const trimmed = value.trim();
    if (!trimmed) return "Username is required.";
    if (trimmed.length < 3) return "Username must be at least 3 characters.";
    if (trimmed.length > 20) return "Username must be 20 characters or fewer.";
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      return "Username may only contain letters, numbers, and underscores.";
    }
    return "";
  },

  bio: (value) => {
    if (value.length > 200) return "Bio must be 200 characters or fewer.";
    return "";
  },

  password: (value, formData) => {
    const confirm = formData.get("confirmPassword");
    if (!value && !confirm) return "";

    if (!value) return "Please enter a new password or clear the confirmation field.";
    if (value.length < 8) return "Password must be at least 8 characters.";
    if (!/[a-zA-Z]/.test(value) || !/\d/.test(value)) {
      return "Password must include at least one letter and one number.";
    }
    return "";
  },

  confirmPassword: (value, formData) => {
    const password = formData.get("password");
    if (!password && !value) return "";
    if (password && !value) return "Please confirm your new password.";
    if (value !== password) return "Passwords do not match.";
    return "";
  },
};

function showFieldError(fieldName, message) {
  const input = document.getElementById(fieldName);
  const errorEl = document.getElementById(`${fieldName}-error`);

  if (message) {
    input.classList.add("invalid");
    errorEl.textContent = message;
  } else {
    input.classList.remove("invalid");
    errorEl.textContent = "";
  }
}

function validateField(fieldName, formData) {
  const input = document.getElementById(fieldName);
  const validator = validators[fieldName];
  if (!validator) return true;

  const message = validator(input.value, formData);
  showFieldError(fieldName, message);
  return !message;
}

function validateForm() {
  const formData = new FormData(form);
  let isValid = true;

  Object.keys(validators).forEach((fieldName) => {
    if (!validateField(fieldName, formData)) {
      isValid = false;
    }
  });

  return isValid;
}

function showStatus(message, type) {
  formStatus.textContent = message;
  formStatus.className = `form-status visible ${type}`;
}

function hideStatus() {
  formStatus.className = "form-status";
  formStatus.textContent = "";
}

bioField.addEventListener("input", () => {
  bioCount.textContent = bioField.value.length;
  validateField("bio", new FormData(form));
});

Object.keys(validators).forEach((fieldName) => {
  const input = document.getElementById(fieldName);
  input.addEventListener("blur", () => {
    validateField(fieldName, new FormData(form));
  });

  input.addEventListener("input", () => {
    if (input.classList.contains("invalid")) {
      validateField(fieldName, new FormData(form));
    }
    hideStatus();
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  hideStatus();

  if (!validateForm()) {
    showStatus("Please fix the errors above before saving.", "error");
    const firstInvalid = form.querySelector(".invalid");
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  const data = Object.fromEntries(new FormData(form));
  data.notifications = form.notifications.checked;

  console.log("Settings saved:", data);
  showStatus("Settings saved successfully!", "success");
});

form.addEventListener("reset", () => {
  hideStatus();
  bioCount.textContent = "0";

  Object.keys(validators).forEach((fieldName) => {
    showFieldError(fieldName, "");
  });
});
