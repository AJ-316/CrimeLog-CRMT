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
        <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="text-left text-base font-semibold text-slate-800">{title}</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
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
    );
}

