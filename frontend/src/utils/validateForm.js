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

  // Validate Student ID (1 uppercase letter + 7 digits)
  if (!values.studentId || !values.studentId.trim()) {
    errors.studentId = "Student ID is required";
  } else {
    const studentIdRegex = /^[A-Z]\d{7}$/; // uppercase only
    if (!studentIdRegex.test(values.studentId.trim())) {
      errors.studentId =
        "Student ID must start with a capital letter followed by 7 numbers (e.g., S1234567)";
    }
  }

  // Validate Name
  if (!values.name || !values.name.trim()) {
    errors.name = "Name is required";
  } else if (values.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  // Validate Class (2 letters + 3 digits)
  if (!values.className || !values.className.trim()) {
    errors.className = "Class is required";
  } else {
    const classRegex = /^[A-Za-z]{2}\d{3}$/;
    if (!classRegex.test(values.className.trim())) {
      errors.className =
        "Class must start with 2 letters followed by 3 numbers (e.g., AB123)";
    }
  }

  if (!values.email || !values.email.trim()) {
    errors.email = "Email is required";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(values.email.trim())) {
      errors.email = "Enter a valid email address";
    }
  }

  // Validate Phone (optional, must be exactly 8 digits if provided)
  if (values.phone && values.phone.trim()) {
    const phoneValue = values.phone.trim();
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

  // Name (required)
  if (!values.name || !values.name.trim()) {
    errors.name = "Name is required";
  } else if (values.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  // Class (required)
  if (!values.className || !values.className.trim()) {
    errors.className = "Class is required";
  } else {
    const classRegex = /^[A-Za-z]{2}\d{3}$/;
    if (!classRegex.test(values.className.trim())) {
      errors.className =
        "Class must start with 2 letters followed by 3 numbers (e.g., AB123)";
    }
  }

  // Email (now required)
  if (!values.email || !values.email.trim()) {
    errors.email = "Email is required";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(values.email.trim())) {
      errors.email = "Enter a valid email address";
    }
  }

  // Phone (optional but must be 8 digits if provided)
  if (values.phone && values.phone.trim()) {
    const phoneValue = values.phone.trim();
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

export const validateAddStudentToRosterForm = (values) => {
  const errors = {};

  if (!values.studentId || !values.studentId.trim()) {
    errors.studentId = "Student ID is required";
  } else {
    const studentIdRegex = /^[A-Za-z]\d{7}$/;
    if (!studentIdRegex.test(values.studentId.trim())) {
      errors.studentId =
        "Student ID must start with a letter followed by 7 numbers (e.g., S1234567)";
    }
  }

  return errors;
};

export const validateCreateSessionForm = (values) => {
  const errors = {};

  // Course name
  if (!values.courseName?.trim()) {
    errors.courseName = "Course name is required";
  }

  // Roster selection
  if (!values.rosterId) {
    errors.rosterId = "Roster is required";
  }

  // Start time validation
  if (!values.startAt) {
    errors.startAt = "Start time is required";
  } else {
    const startTime = new Date(values.startAt);
    const now = new Date();

    if (startTime < now) {
      errors.startAt = "Start time cannot be in the past";
    }
  }

  // End time validation
  if (!values.endAt) {
    errors.endAt = "End time is required";
  } else if (
    values.startAt &&
    new Date(values.startAt) >= new Date(values.endAt)
  ) {
    errors.endAt = "End time must be after start time";
  }

  // Late-after minutes
  if (
    values.lateAfterMinutes === undefined ||
    values.lateAfterMinutes === null ||
    values.lateAfterMinutes < 0
  ) {
    errors.lateAfterMinutes = "Late after minutes must be a positive number";
  }

  return errors;
};


