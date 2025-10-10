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

export const validateCreateCourseForm = (values) => {
  const errors = {};

  // Validate Course Code
  if (!values.code || !values.code.trim()) {
    errors.code = "Course code is required";
  } else {
    const courseCodeRegex = /^[A-Za-z]{2}\d{3}$/;
    if (!courseCodeRegex.test(values.code.trim())) {
      errors.code =
        "Course code must be 2 letters followed by 3 numbers (e.g., CS104)";
    }
  }

  // Validate Course Title
  if (!values.title || !values.title.trim()) {
    errors.title = "Course title is required";
  } else if (values.title.trim().length < 3) {
    errors.title = "Course title must be at least 3 characters";
  }

  return errors;
};