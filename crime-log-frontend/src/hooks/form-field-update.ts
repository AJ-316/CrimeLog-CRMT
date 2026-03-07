import {useState} from "react";

export function useFormState<T>(initialState: T) {
    const [form, setForm] = useState<T>(initialState);

    const updateField = <K extends keyof T>(field: K, value: T[K]) => {
        setForm((previousForm) => ({
            ...previousForm,
            [field]: value
        }));
    };

    return {form, setForm, updateField};
}