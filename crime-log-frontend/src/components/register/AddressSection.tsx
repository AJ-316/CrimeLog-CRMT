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
                    error={errors[`${fieldPrefix}.street`]}
                    id={`${fieldPrefix}-street`}
                    label="Street"
                    onChange={(value) => onChange("street", value)}
                    required
                    value={address.street}
                />
                <RegisterField
                    error={errors[`${fieldPrefix}.city`]}
                    id={`${fieldPrefix}-city`}
                    label="City"
                    onChange={(value) => onChange("city", value)}
                    required
                    value={address.city}
                />
                <RegisterField
                    error={errors[`${fieldPrefix}.state`]}
                    id={`${fieldPrefix}-state`}
                    label="State"
                    onChange={(value) => onChange("state", value)}
                    required
                    value={address.state}
                />
                <RegisterField
                    error={errors[`${fieldPrefix}.postalCode`]}
                    id={`${fieldPrefix}-postalCode`}
                    label="Postal code"
                    onChange={(value) => onChange("postalCode", value)}
                    required
                    value={address.postalCode}
                />
                <div className="sm:col-span-2 xl:col-span-1">
                    <RegisterField
                        error={errors[`${fieldPrefix}.countryCode`]}
                        id={`${fieldPrefix}-countryCode`}
                        label="Country code"
                        onChange={(value) => onChange("countryCode", value)}
                        placeholder="IN"
                        required
                        value={address.countryCode}
                    />
                </div>
            </div>
        </div>
    );
}
