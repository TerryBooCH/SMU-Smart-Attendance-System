export const validateCreateStudentForm = (values) => {
  const errors = {};

  // Validate Student ID
  if (!values.studentId || !values.studentId.trim()) {
    errors.studentId = "Student ID is required";
  } else {
    const studentIdRegex = /^[A-Za-z]\d{7}$/;
    if (!studentIdRegex.test(values.studentId.trim())) {
      errors.studentId = "Student ID must start with a letter followed by 7 numbers (e.g., S1234567)";
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
    // Remove any spaces, dashes, or other non-digit characters for validation
    const cleanedPhone = values.phone.replace(/\D/g, '');
    if (cleanedPhone.length !== 8) {
      errors.phone = "Phone number must be exactly 8 digits";
    } else if (!/^\d{8}$/.test(cleanedPhone)) {
      errors.phone = "Phone number must contain only digits";
    }
  }

  return errors;
};