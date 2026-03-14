import type {HTMLInputTypeAttribute} from "react";
import FormInput from "./FormInput.tsx";
import {inputClassName} from "../app/WorkspaceUi.tsx";

interface WorkspaceFormFieldProps<T> {
    id?: string;
    label: string;
    field: keyof T;
    value: string;
    update: <K extends keyof T>(field: K, value: T[K]) => void;
    type?: HTMLInputTypeAttribute;
    description?: string;
    required?: boolean;
}

export default function WorkspaceFormField<T>({
    id,
    label,
    field,
    value,
    update,
    type = "text",
    description,
    required = false
}: WorkspaceFormFieldProps<T>) {
    const fieldId = id ?? String(field);

    return (
        <label className="block text-left" htmlFor={fieldId}>
            <span className="text-sm font-medium text-slate-700">
                {label}
                {required ? <span className="ml-1 text-rose-500">*</span> : null}
            </span>
            <FormInput
                className={inputClassName}
                field={field}
                id={fieldId}
                type={type}
                update={update}
                value={value}
            />
            {description ? <span className="mt-2 block text-sm text-slate-500">{description}</span> : null}
        </label>
    );
}

