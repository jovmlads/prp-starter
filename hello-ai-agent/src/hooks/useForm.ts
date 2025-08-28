import { useState, useCallback } from 'react';

export interface UseFormConfig<T> {
  initialValues: T;
  validationRules?: Partial<Record<keyof T, (value: any) => string | null>>;
  onSubmit?: (values: T) => void | Promise<void>;
}

export interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  handleChange: (field: keyof T, value: any) => void;
  handleBlur: (field: keyof T) => void;
  handleSubmit: (
    onSubmit: (values: T) => void | Promise<void>
  ) => (e?: React.FormEvent) => Promise<void>;
  setFieldError: (field: keyof T, error: string) => void;
  setFieldValue: (field: keyof T, value: any) => void;
  resetForm: () => void;
  validateField: (field: keyof T) => string | null;
  validateForm: () => boolean;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationRules = {},
}: UseFormConfig<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate a single field
  const validateField = useCallback(
    (field: keyof T): string | null => {
      const validator = validationRules[field];
      if (!validator) return null;

      const value = values[field];
      return validator(value);
    },
    [values, validationRules]
  );

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isFormValid = true;

    Object.keys(validationRules).forEach((key) => {
      const field = key as keyof T;
      const error = validateField(field);
      if (error) {
        newErrors[field] = error;
        isFormValid = false;
      }
    });

    setErrors(newErrors);
    return isFormValid;
  }, [validateField, validationRules]);

  // Check if form is currently valid
  const isValid = Object.keys(validationRules).every((key) => {
    const field = key as keyof T;
    return !validateField(field);
  });

  // Handle field value change
  const handleChange = useCallback(
    (field: keyof T, value: any) => {
      setValues((prev) => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  // Handle field blur (for validation)
  const handleBlur = useCallback(
    (field: keyof T) => {
      setTouched((prev) => ({ ...prev, [field]: true }));

      const error = validateField(field);
      if (error) {
        setErrors((prev) => ({ ...prev, [field]: error }));
      }
    },
    [validateField]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    (onSubmit: (values: T) => void | Promise<void>) =>
      async (e?: React.FormEvent) => {
        if (e) {
          e.preventDefault();
        }

        // Mark all fields as touched
        const allTouched = Object.keys(initialValues).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {} as Partial<Record<keyof T, boolean>>
        );
        setTouched(allTouched);

        // Validate form
        const isFormValid = validateForm();

        if (!isFormValid) {
          return;
        }

        setIsSubmitting(true);

        try {
          await onSubmit(values);
        } catch (error) {
          console.error('Form submission error:', error);
          throw error;
        } finally {
          setIsSubmitting(false);
        }
      },
    [values, validateForm, initialValues]
  );

  // Set field error manually (for server-side validation)
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  // Set field value manually
  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldError,
    setFieldValue,
    resetForm,
    validateField,
    validateForm,
  };
}
