import type {HTMLInputTypeAttribute} from "react";

export interface SelectOption {
    value: string;
    label: string;
}

type SharedFieldProps = {
    id: string;
    label: string;
    error?: string;
    description?: string;
    required?: boolean;
};

type InputFieldProps = SharedFieldProps & {
    kind?: "input";
    type?: HTMLInputTypeAttribute;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    min?: number | string;
    step?: number | string;
};

type SelectFieldProps = SharedFieldProps & {
    kind: "select";
    value: string;
    onChange: (value: string) => void;
    options: readonly SelectOption[];
    placeholder?: string;
};

type CheckboxFieldProps = SharedFieldProps & {
    kind: "checkbox";
    checked: boolean;
    onChange: (checked: boolean) => void;
};

type RegisterFieldProps = InputFieldProps | SelectFieldProps | CheckboxFieldProps;

const inputClassName = "mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200";

export default function RegisterField(props: RegisterFieldProps) {
    const errorId = `${props.id}-error`;
    const descriptionId = `${props.id}-description`;
    const helperTextId = props.error ? errorId : props.description ? descriptionId : undefined;

    if (props.kind === "checkbox") {
        return (
            <div>
                <label className="flex items-start gap-3 rounded border border-slate-200 px-3 py-3 text-left" htmlFor={props.id}>
                    <input
                        checked={props.checked}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        id={props.id}
                        onChange={(event) => props.onChange(event.target.checked)}
                        type="checkbox"
                    />
                    <span>
                        <span className="block font-medium text-slate-800">{props.label}</span>
                        {props.description ? (
                            <span className="mt-1 block text-sm text-slate-500">{props.description}</span>
                        ) : null}
                    </span>
                </label>
                {props.error ? <p className="mt-1 text-sm text-red-600">{props.error}</p> : null}
            </div>
        );
    }

    return (
        <div>
            <label className="block text-left text-sm font-medium text-slate-700" htmlFor={props.id}>
                {props.label}
                {props.required ? <span className="ml-1 text-red-500">*</span> : null}
            </label>

            {props.kind === "select" ? (
                <select
                    aria-describedby={helperTextId}
                    aria-invalid={Boolean(props.error)}
                    className={inputClassName}
                    id={props.id}
                    onChange={(event) => props.onChange(event.target.value)}
                    value={props.value}
                >
                    <option value="">{props.placeholder ?? `Select ${props.label}`}</option>
                    {props.options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    aria-describedby={helperTextId}
                    aria-invalid={Boolean(props.error)}
                    className={inputClassName}
                    id={props.id}
                    min={props.min}
                    onChange={(event) => props.onChange(event.target.value)}
                    placeholder={props.placeholder}
                    step={props.step}
                    type={props.type ?? "text"}
                    value={props.value}
                />
            )}

            {props.description ? (
                <p className="mt-1 text-sm text-slate-500" id={descriptionId}>
                    {props.description}
                </p>
            ) : null}
            {props.error ? (
                <p className="mt-1 text-sm text-red-600" id={errorId}>
                    {props.error}
                </p>
            ) : null}
        </div>
    );
}

