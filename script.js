const STORAGE_KEY = "userSettings";

const form = document.getElementById("settings-form");
const formStatus = document.getElementById("form-status");

const fieldNames = ["displayName", "email", "timeZone"];

function getFormData() {
  return {
    displayName: form.displayName.value,
    email: form.email.value,
    timeZone: form.timeZone.value,
    theme: form.theme.value,
    emailNotifications: form.emailNotifications.checked,
  };
}

function setFieldError(fieldName, message) {
  const control = form.elements[fieldName];
  const errorEl = document.getElementById(`${fieldName}-error`);

  if (message) {
    control.setAttribute("aria-invalid", "true");
    errorEl.textContent = message;
  } else {
    control.removeAttribute("aria-invalid");
    errorEl.textContent = "";
  }
}

function clearFieldErrors() {
  fieldNames.forEach((fieldName) => setFieldError(fieldName, ""));
}

function applyValidationErrors(errors) {
  fieldNames.forEach((fieldName) => {
    setFieldError(fieldName, errors[fieldName] || "");
  });
}

function showFormStatus(message, type) {
  formStatus.textContent = message;
  formStatus.className = `form-status form-status--${type}`;
}

function clearFormStatus() {
  formStatus.textContent = "";
  formStatus.className = "form-status";
}

function focusFirstInvalidField(errors) {
  const firstInvalid = fieldNames.find((fieldName) => errors[fieldName]);
  if (firstInvalid) {
    form.elements[firstInvalid].focus();
  }
}

function populateForm(settings) {
  form.displayName.value = settings.displayName;
  form.email.value = settings.email;
  form.timeZone.value = settings.timeZone;

  const themeInput = form.querySelector(`input[name="theme"][value="${settings.theme}"]`);
  if (themeInput) {
    themeInput.checked = true;
  }

  form.emailNotifications.checked = settings.emailNotifications;
}

function getDefaultSettings() {
  return {
    displayName: "",
    email: "",
    timeZone: "",
    theme: "system",
    emailNotifications: false,
  };
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    return Validation.normalizeSettings(parsed);
  } catch {
    return null;
  }
}

function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function clearStoredSettings() {
  localStorage.removeItem(STORAGE_KEY);
}

function handleSubmit(event) {
  event.preventDefault();
  clearFormStatus();

  const formData = getFormData();
  const errors = Validation.validateSettings(formData);
  applyValidationErrors(errors);

  if (!Validation.isFormValid(errors)) {
    showFormStatus("Please correct the errors below before saving.", "error");
    focusFirstInvalidField(errors);
    return;
  }

  const settings = {
    displayName: formData.displayName.trim(),
    email: formData.email.trim(),
    timeZone: formData.timeZone.trim(),
    theme: formData.theme,
    emailNotifications: formData.emailNotifications,
  };

  saveSettings(settings);
  showFormStatus("Settings saved successfully.", "success");
}

function handleReset() {
  clearFieldErrors();
  clearFormStatus();
  clearStoredSettings();
  populateForm(getDefaultSettings());
}

function handleFieldInput(fieldName) {
  const control = form.elements[fieldName];
  if (control.getAttribute("aria-invalid") === "true") {
    const errors = Validation.validateSettings(getFormData());
    setFieldError(fieldName, errors[fieldName] || "");
  }
  clearFormStatus();
}

fieldNames.forEach((fieldName) => {
  form.elements[fieldName].addEventListener("blur", () => {
    const errors = Validation.validateSettings(getFormData());
    setFieldError(fieldName, errors[fieldName] || "");
  });

  form.elements[fieldName].addEventListener("input", () => {
    handleFieldInput(fieldName);
  });
});

form.addEventListener("submit", handleSubmit);
form.addEventListener("reset", handleReset);

const savedSettings = loadSettings();
populateForm(savedSettings ?? getDefaultSettings());
