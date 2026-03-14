import type {HTMLInputTypeAttribute} from "react";

interface FormInputProps<T> {
    className?: string
    id?: string
    type?: HTMLInputTypeAttribute
    value: string
    field: keyof T
    update: <K extends keyof T>(field: K, value: T[K]) => void
    placeholder?: string
    pattern?: string
    title?: string
    required?: boolean
    disabled?: boolean
}

export default function FormInput<T>({
                                      className,
                                      id,
                                      type = "text",
                                      value,
                                      field,
                                      update,
                                      placeholder,
                                      pattern,
                                      title,
                                      required,
                                      disabled
                                  }: FormInputProps<T>) {
    return (
        <input
            className={className}
            id={id ?? String(field)}
            name={String(field)}
            type={type}
            value={value}
            placeholder={placeholder}
            pattern={pattern}
            title={title}
            required={required}
            disabled={disabled}
            onChange={(e) => update(field, e.target.value as T[keyof T])}
        />
    )
}