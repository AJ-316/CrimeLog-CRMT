import type {AddressDto} from "../../api/dtos/addressDto.ts";
import {
    ActiveStatusOptions,
    LawyerSpecializationOptions,
    LicenseStatusOptions
} from "../../api/types.ts";
import AddressSection from "./AddressSection.tsx";
import RegisterField, {type SelectOption} from "./RegisterField.tsx";
import type {RegisterLawyerDraft, RegisterOfficerDraft, RegisterRole} from "./register-types.ts";

interface RoleSectionProps {
    role: RegisterRole;
    lawyerProfile: RegisterLawyerDraft;
    officerProfile: RegisterOfficerDraft;
    errors: Record<string, string>;
    onLawyerChange: <K extends keyof RegisterLawyerDraft>(field: K, value: RegisterLawyerDraft[K]) => void;
    onOfficerChange: <K extends keyof RegisterOfficerDraft>(field: K, value: RegisterOfficerDraft[K]) => void;
    onLawyerOfficeAddressChange: <K extends keyof AddressDto>(field: K, value: AddressDto[K]) => void;
}

const formatEnumLabel = (value: string): string =>
    value
        .toLowerCase()
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");

const specializationOptions: SelectOption[] = LawyerSpecializationOptions.map((value) => ({
    value,
    label: formatEnumLabel(value)
}));

const licenseOptions: SelectOption[] = LicenseStatusOptions.map((value) => ({
    value,
    label: formatEnumLabel(value)
}));

const activeStatusOptions: SelectOption[] = ActiveStatusOptions.map((value) => ({
    value,
    label: formatEnumLabel(value)
}));

export default function RoleSection({
    role,
    lawyerProfile,
    officerProfile,
    errors,
    onLawyerChange,
    onOfficerChange,
    onLawyerOfficeAddressChange
}: RoleSectionProps) {
    if (role === "PUBLIC") {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-left">
                <h2 className="text-lg font-semibold text-slate-800">Role info</h2>
                <p className="mt-2 text-sm text-slate-600">
                    Public registrations do not require additional role-specific details. Continue to the final step to set your email and password.
                </p>
            </div>
        );
    }

    if (role === "LAWYER") {
        return (
            <div className="space-y-6">
                <div className="rounded-xl border border-slate-200 p-4">
                    <h2 className="text-left text-lg font-semibold text-slate-800">Lawyer info</h2>
                    <p className="mt-1 text-left text-sm text-slate-500">
                        Fill in the fields required by the lawyer registration DTO.
                    </p>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <RegisterField
                            error={errors["lawyerProfile.barCouncilId"]}
                            id="barCouncilId"
                            label="Bar council ID"
                            min={1}
                            onChange={(value) => onLawyerChange("barCouncilId", value)}
                            required
                            type="number"
                            value={lawyerProfile.barCouncilId}
                        />
                        <RegisterField
                            error={errors["lawyerProfile.barRegistrationNumber"]}
                            id="barRegistrationNumber"
                            label="Bar registration number"
                            onChange={(value) => onLawyerChange("barRegistrationNumber", value)}
                            required
                            value={lawyerProfile.barRegistrationNumber}
                        />
                        <RegisterField
                            error={errors["lawyerProfile.enrollmentDate"]}
                            id="enrollmentDate"
                            label="Enrollment date"
                            onChange={(value) => onLawyerChange("enrollmentDate", value)}
                            required
                            type="date"
                            value={lawyerProfile.enrollmentDate}
                        />
                        <RegisterField
                            error={errors["lawyerProfile.yearsOfExperience"]}
                            id="yearsOfExperience"
                            label="Years of experience"
                            min={0}
                            onChange={(value) => onLawyerChange("yearsOfExperience", value)}
                            required
                            type="number"
                            value={lawyerProfile.yearsOfExperience}
                        />
                        <RegisterField
                            error={errors["lawyerProfile.specialization"]}
                            id="specialization"
                            kind="select"
                            label="Specialization"
                            onChange={(value) => onLawyerChange("specialization", value as RegisterLawyerDraft["specialization"])}
                            options={specializationOptions}
                            required
                            value={lawyerProfile.specialization}
                        />
                        <RegisterField
                            error={errors["lawyerProfile.licenseStatus"]}
                            id="licenseStatus"
                            kind="select"
                            label="License status"
                            onChange={(value) => onLawyerChange("licenseStatus", value as RegisterLawyerDraft["licenseStatus"])}
                            options={licenseOptions}
                            required
                            value={lawyerProfile.licenseStatus}
                        />
                        <RegisterField
                            error={errors["lawyerProfile.firmName"]}
                            id="firmName"
                            label="Firm name"
                            onChange={(value) => onLawyerChange("firmName", value)}
                            required
                            value={lawyerProfile.firmName}
                        />
                        <RegisterField
                            error={errors["lawyerProfile.officialContact"]}
                            id="officialContact"
                            label="Official contact"
                            onChange={(value) => onLawyerChange("officialContact", value)}
                            required
                            value={lawyerProfile.officialContact}
                        />
                    </div>

                    <div className="mt-4">
                        <RegisterField
                            checked={lawyerProfile.isPublicDefender}
                            description="Enable this if the applicant is serving as a public defender."
                            error={errors["lawyerProfile.isPublicDefender"]}
                            id="isPublicDefender"
                            kind="checkbox"
                            label="Public defender"
                            onChange={(checked) => onLawyerChange("isPublicDefender", checked)}
                        />
                    </div>
                </div>

                <AddressSection
                    address={lawyerProfile.officeAddress}
                    errors={errors}
                    fieldPrefix="lawyerProfile.officeAddress"
                    onChange={onLawyerOfficeAddressChange}
                    title="Office address"
                />
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-slate-200 p-4 text-left">
            <h2 className="text-lg font-semibold text-slate-800">Officer info</h2>
            <p className="mt-1 text-sm text-slate-500">
                Fill in the fields required by the officer registration DTO.
            </p>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
                <RegisterField
                    error={errors["officerProfile.badgeNumber"]}
                    id="badgeNumber"
                    label="Badge number"
                    onChange={(value) => onOfficerChange("badgeNumber", value)}
                    required
                    value={officerProfile.badgeNumber}
                />
                <RegisterField
                    description="Use the numeric department unit ID expected by the backend."
                    error={errors["officerProfile.departmentUnitId"]}
                    id="departmentUnitId"
                    label="Department unit ID"
                    min={1}
                    onChange={(value) => onOfficerChange("departmentUnitId", value)}
                    required
                    type="number"
                    value={officerProfile.departmentUnitId}
                />
                <RegisterField
                    error={errors["officerProfile.joiningDate"]}
                    id="joiningDate"
                    label="Joining date"
                    onChange={(value) => onOfficerChange("joiningDate", value)}
                    required
                    type="date"
                    value={officerProfile.joiningDate}
                />
                <RegisterField
                    error={errors["officerProfile.activeStatus"]}
                    id="activeStatus"
                    kind="select"
                    label="Active status"
                    onChange={(value) => onOfficerChange("activeStatus", value as RegisterOfficerDraft["activeStatus"])}
                    options={activeStatusOptions}
                    required
                    value={officerProfile.activeStatus}
                />
            </div>
        </div>
    );
}

