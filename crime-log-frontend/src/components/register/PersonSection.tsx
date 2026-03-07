import type {AddressDto} from "../../api/dtos/addressDto.ts";
import type {PersonDto} from "../../api/dtos/personDto.ts";
import {GenderOptions} from "../../api/types.ts";
import AddressSection from "./AddressSection.tsx";
import RegisterField, {type SelectOption} from "./RegisterField.tsx";
import {RegisterRoleOptions, type PersonAddressKey, type PersonScalarFieldKey, type RegisterRole} from "./register-types.ts";

interface PersonSectionProps {
    person: PersonDto;
    role: RegisterRole;
    errors: Record<string, string>;
    onRoleChange: (role: RegisterRole) => void;
    onPersonChange: <K extends PersonScalarFieldKey>(field: K, value: PersonDto[K]) => void;
    onAddressChange: <K extends keyof AddressDto>(section: PersonAddressKey, field: K, value: AddressDto[K]) => void;
}

const roleOptions: SelectOption[] = RegisterRoleOptions.map((role) => ({
    value: role,
    label: role.replace("_", " ")
}));

const genderOptions: SelectOption[] = GenderOptions.map((gender) => ({
    value: gender,
    label: gender.charAt(0) + gender.slice(1).toLowerCase()
}));

export default function PersonSection({
    person,
    role,
    errors,
    onRoleChange,
    onPersonChange,
    onAddressChange
}: PersonSectionProps) {
    return (
        <div className="space-y-5">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">Step 1</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Personal details</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                    Enter your identity, contact details, and addresses so we can set up your account correctly.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <RegisterField
                    error={errors["personDto.nationalId"]}
                    id="nationalId"
                    label="National ID"
                    onChange={(value) => onPersonChange("nationalId", value)}
                    required
                    value={person.nationalId}
                />
                <RegisterField
                    error={errors["personDto.firstName"]}
                    id="firstName"
                    label="First name"
                    onChange={(value) => onPersonChange("firstName", value)}
                    required
                    value={person.firstName}
                />
                <RegisterField
                    error={errors["personDto.middleName"]}
                    id="middleName"
                    label="Middle name"
                    onChange={(value) => onPersonChange("middleName", value)}
                    value={person.middleName}
                />
                <RegisterField
                    error={errors["personDto.lastName"]}
                    id="lastName"
                    label="Last name"
                    onChange={(value) => onPersonChange("lastName", value)}
                    required
                    value={person.lastName}
                />
                <RegisterField
                    description="Optional path or URL to the profile photo."
                    error={errors["personDto.profilePhotoPath"]}
                    id="profilePhotoPath"
                    label="Profile photo path"
                    onChange={(value) => onPersonChange("profilePhotoPath", value)}
                    value={person.profilePhotoPath}
                />
                <RegisterField
                    error={errors["personDto.dateOfBirth"]}
                    id="dateOfBirth"
                    label="Date of birth"
                    onChange={(value) => onPersonChange("dateOfBirth", value)}
                    required
                    type="date"
                    value={person.dateOfBirth}
                />
                <RegisterField
                    error={errors["personDto.gender"]}
                    id="gender"
                    kind="select"
                    label="Gender"
                    onChange={(value) => onPersonChange("gender", value as PersonDto["gender"])}
                    options={genderOptions}
                    required
                    value={person.gender}
                />
                <RegisterField
                    error={errors["role"]}
                    id="role"
                    kind="select"
                    label="Role"
                    onChange={(value) => onRoleChange(value as RegisterRole)}
                    options={roleOptions}
                    required
                    value={role}
                />
                <RegisterField
                    error={errors["personDto.nationalityCode"]}
                    id="nationalityCode"
                    label="Nationality code"
                    onChange={(value) => onPersonChange("nationalityCode", value)}
                    placeholder="US"
                    required
                    value={person.nationalityCode}
                />
                <RegisterField
                    error={errors["personDto.contactPrimary"]}
                    id="contactPrimary"
                    label="Primary contact"
                    onChange={(value) => onPersonChange("contactPrimary", value)}
                    required
                    value={person.contactPrimary}
                />
                <RegisterField
                    error={errors["personDto.contactSecondary"]}
                    id="contactSecondary"
                    label="Secondary contact"
                    onChange={(value) => onPersonChange("contactSecondary", value)}
                    value={person.contactSecondary}
                />
            </div>

            <div className="space-y-4">
                <AddressSection
                    address={person.birthPlace}
                    errors={errors}
                    fieldPrefix="personDto.birthPlace"
                    onChange={(field, value) => onAddressChange("birthPlace", field, value)}
                    title="Birth place"
                />
                <AddressSection
                    address={person.permanentAddress}
                    errors={errors}
                    fieldPrefix="personDto.permanentAddress"
                    onChange={(field, value) => onAddressChange("permanentAddress", field, value)}
                    title="Permanent address"
                />
                <AddressSection
                    address={person.currentAddress}
                    errors={errors}
                    fieldPrefix="personDto.currentAddress"
                    onChange={(field, value) => onAddressChange("currentAddress", field, value)}
                    title="Current address"
                />
            </div>
        </div>
    );
}
