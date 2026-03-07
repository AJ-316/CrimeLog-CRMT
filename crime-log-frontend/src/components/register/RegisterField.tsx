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

const inputClassName = "mt-2 w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:bg-white/10 focus:ring-4 focus:ring-cyan-400/10";
const selectClassName = `${inputClassName} appearance-none pr-12`;

export default function RegisterField(props: RegisterFieldProps) {
    const errorId = `${props.id}-error`;
    const descriptionId = `${props.id}-description`;
    const helperTextId = props.error ? errorId : props.description ? descriptionId : undefined;

    if (props.kind === "checkbox") {
        return (
            <div>
                <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left" htmlFor={props.id}>
                    <input
                        checked={props.checked}
                        className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent text-cyan-300 focus:ring-cyan-400"
                        id={props.id}
                        onChange={(event) => props.onChange(event.target.checked)}
                        type="checkbox"
                    />
                    <span>
                        <span className="block font-medium text-white">{props.label}</span>
                        {props.description ? (
                            <span className="mt-1 block text-sm text-slate-400">{props.description}</span>
                        ) : null}
                    </span>
                </label>
                {props.error ? <p className="mt-2 text-sm text-red-200">{props.error}</p> : null}
            </div>
        );
    }

    return (
        <div>
            <label className="block text-left text-sm font-medium text-slate-200" htmlFor={props.id}>
                {props.label}
                {props.required ? <span className="ml-1 text-red-300">*</span> : null}
            </label>

            {props.kind === "select" ? (
                <div className="relative mt-2">
                    <select
                        aria-describedby={helperTextId}
                        aria-invalid={Boolean(props.error)}
                        className={selectClassName}
                        id={props.id}
                        onChange={(event) => props.onChange(event.target.value)}
                        value={props.value}
                    >
                        <option className="bg-slate-900 text-slate-200" value="">
                            {props.placeholder ?? `Select ${props.label}`}
                        </option>
                        {props.options.map((option) => (
                            <option className="bg-slate-900 text-white" key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                        <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                        </svg>
                    </span>
                </div>
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
                <p className="mt-2 text-sm text-slate-400" id={descriptionId}>
                    {props.description}
                </p>
            ) : null}
            {props.error ? (
                <p className="mt-2 text-sm text-red-200" id={errorId}>
                    {props.error}
                </p>
            ) : null}
        </div>
    );
}
