import {useMemo} from "react";
import {getCountryOptions, getStateOptions, getCityOptions} from "../../utils/location-data.ts";
import type {AddressDto} from "../../api/dtos/addressDto.ts";
import RegisterField from "./RegisterField.tsx";

interface AddressSectionProps {
    title: string;
    fieldPrefix: string;
    address: AddressDto;
    errors: Record<string, string>;
    onChange: <K extends keyof AddressDto>(field: K, value: AddressDto[K]) => void;
}

export default function AddressSection({
    title,
    fieldPrefix,
    address,
    errors,
    onChange
}: AddressSectionProps) {
    const countryCode = address.countryCode ?? "";
    const stateCode = address.state ?? "";

    const countries = useMemo(() => getCountryOptions(), []);
    const states = useMemo(() => getStateOptions(countryCode), [countryCode]);
    const cities = useMemo(() => getCityOptions(countryCode, stateCode), [countryCode, stateCode]);

    return (
        <div className="rounded-[24px] border border-white/10 bg-white/4 p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-white">{title}</h3>
                <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">
                    Address
                </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                <RegisterField
                    error={errors[`${fieldPrefix}.countryCode`]}
                    id={`${fieldPrefix}-country`}
                    kind="select"
                    label="Country / Nationality"
                    onChange={(value) => {
                        onChange("countryCode", value);
                        onChange("state", "");
                        onChange("city", "");
                    }}
                    options={countries.map((c) => ({value: c.code, label: c.name}))}
                    required
                    value={countryCode}
                />
                <RegisterField
                    error={errors[`${fieldPrefix}.state`]}
                    disabled={!countryCode}
                    id={`${fieldPrefix}-state`}
                    kind="select"
                    label="State / Province"
                    onChange={(value) => {
                        onChange("state", value);
                        onChange("city", "");
                    }}
                    options={states.map((state) => ({value: state.code, label: state.name}))}
                    required
                    value={stateCode}
                />
                <RegisterField
                    error={errors[`${fieldPrefix}.city`]}
                    disabled={!stateCode}
                    id={`${fieldPrefix}-city`}
                    kind="select"
                    label="City"
                    onChange={(value) => onChange("city", value)}
                    options={cities.map((city) => ({value: city.name, label: city.name}))}
                    required
                    value={address.city ?? ""}
                />
                <RegisterField
                    error={errors[`${fieldPrefix}.street`]}
                    id={`${fieldPrefix}-street`}
                    label="Street"
                    onChange={(value) => onChange("street", value)}
                    required
                    value={address.street ?? ""}
                />
                <RegisterField
                    error={errors[`${fieldPrefix}.postalCode`]}
                    id={`${fieldPrefix}-postalCode`}
                    label="Postal code"
                    onChange={(value) => onChange("postalCode", value)}
                    required
                    value={address.postalCode ?? ""}
                />
            </div>
        </div>
    );
}
