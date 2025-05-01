export type SignUpFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type ValidationError = {
  field: keyof SignUpFormData;
  message: string;
};

export const validateSignUp = (data: SignUpFormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.email.includes("@")) {
    errors.push({ field: "email", message: "Invalid email address" });
  }

  if (data.password.length < 8) {
    errors.push({
      field: "password",
      message: "Password must be at least 8 characters.",
    });
  }

  if (data.password !== data.confirmPassword) {
    errors.push({
      field: "confirmPassword",
      message: "Passwords do not match.",
    });
  }
  return errors;
};
