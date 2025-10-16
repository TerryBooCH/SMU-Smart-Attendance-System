export const validateSignInForm = (values) => {
  const errors = {};
  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!values.password.trim()) {
    errors.password = "Password is required";
  }

  return errors;
};

export const validateCreateStudentForm = (values) => {
  const errors = {};

  // Validate Student ID
  if (!values.studentId || !values.studentId.trim()) {
    errors.studentId = "Student ID is required";
  } else {
    const studentIdRegex = /^[A-Za-z]\d{7}$/;
    if (!studentIdRegex.test(values.studentId.trim())) {
      errors.studentId =
        "Student ID must start with a letter followed by 7 numbers (e.g., S1234567)";
    }
  }

  // Validate Name
  if (!values.name || !values.name.trim()) {
    errors.name = "Name is required";
  } else if (values.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  // Validate Email (optional, but must be valid if provided)
  if (values.email && values.email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(values.email.trim())) {
      errors.email = "Email is invalid";
    }
  }

  // Validate Phone (optional, but must be exactly 8 digits if provided)
  if (values.phone && values.phone.trim()) {
    const phoneValue = values.phone.trim();
    // Check if phone contains only digits
    if (!/^\d+$/.test(phoneValue)) {
      errors.phone = "Phone number must contain only numbers";
    } else if (phoneValue.length !== 8) {
      errors.phone = "Phone number must be exactly 8 digits";
    }
  }

  return errors;
};

export const validateUpdateStudentForm = (values) => {
  const errors = {};

  // Validate Name
  if (!values.name || !values.name.trim()) {
    errors.name = "Name is required";
  } else if (values.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  // Validate Email
  if (values.email && values.email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(values.email.trim())) {
      errors.email = "Email is invalid";
    }
  }

  // Validate Phone
  if (values.phone && values.phone.trim()) {
    const phoneValue = values.phone.trim();
    // Check if phone contains only digits
    if (!/^\d+$/.test(phoneValue)) {
      errors.phone = "Phone number must contain only numbers";
    } else if (phoneValue.length !== 8) {
      errors.phone = "Phone number must be exactly 8 digits";
    }
  }

  return errors;
};

export const validateCreateRosterForm = (values) => {
  const errors = {};

  if (!values.name || values.name.trim() === "") {
    errors.name = "Roster name is required";
  } else if (values.name.trim().length < 2) {
    errors.name = "Roster name must be at least 2 characters";
  }

  return errors;
};
