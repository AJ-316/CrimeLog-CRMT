import type {AddressDto} from "../../api/dtos/addressDto.ts";
import type {RegisterFormDraft} from "./register-types.ts";

export type ValidationErrors = Record<string, string>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isBlank = (value: string): boolean => value.trim().length === 0;

const addRequired = (errors: ValidationErrors, key: string, label: string, value: string): void => {
    if (isBlank(value)) {
        errors[key] = `${label} is required.`;
    }
};

const addPositiveInteger = (errors: ValidationErrors, key: string, label: string, value: string): void => {
    if (isBlank(value)) {
        errors[key] = `${label} is required.`;
        return;
    }

    const parsedValue = Number(value);
    if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
        errors[key] = `${label} must be a positive whole number.`;
    }
};

const addNonNegativeInteger = (errors: ValidationErrors, key: string, label: string, value: string): void => {
    if (isBlank(value)) {
        errors[key] = `${label} is required.`;
        return;
    }

    const parsedValue = Number(value);
    if (!Number.isInteger(parsedValue) || parsedValue < 0) {
        errors[key] = `${label} must be zero or a positive whole number.`;
    }
};

const validateAddress = (errors: ValidationErrors, prefix: string, label: string, address: AddressDto): void => {
    addRequired(errors, `${prefix}.street`, `${label} street`, address.street ?? "");
    addRequired(errors, `${prefix}.city`, `${label} city`, address.city ?? "");
    addRequired(errors, `${prefix}.state`, `${label} state`, address.state ?? "");
    addRequired(errors, `${prefix}.postalCode`, `${label} postal code`, address.postalCode ?? "");
    addRequired(errors, `${prefix}.countryCode`, `${label} country`, address.countryCode ?? "");
};

export const validateBasicInfo = (form: RegisterFormDraft): ValidationErrors => {
    const errors: ValidationErrors = {};
    const person = form.personDto;

    addRequired(errors, "personDto.nationalId", "National ID", person.nationalId);
    addRequired(errors, "personDto.firstName", "First name", person.firstName);
    addRequired(errors, "personDto.lastName", "Last name", person.lastName);
    addRequired(errors, "personDto.dateOfBirth", "Date of birth", person.dateOfBirth);
    addRequired(errors, "personDto.nationalityCode", "Country / Nationality", person.nationalityCode);
    addRequired(errors, "personDto.contactPrimary", "Primary contact", person.contactPrimary);
    addRequired(errors, "personDto.contactSecondary", "Secondary contact", person.contactSecondary);

    validateAddress(errors, "personDto.birthPlace", "Birth place", person.birthPlace);
    validateAddress(errors, "personDto.permanentAddress", "Permanent address", person.permanentAddress);
    validateAddress(errors, "personDto.currentAddress", "Current address", person.currentAddress);

    if (person.dateOfBirth && person.dateOfBirth > new Date().toISOString().slice(0, 10)) {
        errors["personDto.dateOfBirth"] = "Date of birth cannot be in the future.";
    }

    return errors;
};

export const validateRoleInfo = (form: RegisterFormDraft): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (form.role === "LAWYER") {
        const lawyer = form.lawyerProfile;

        addPositiveInteger(errors, "lawyerProfile.barCouncilId", "Bar council ID", lawyer.barCouncilId);
        addRequired(errors, "lawyerProfile.barRegistrationNumber", "Bar registration number", lawyer.barRegistrationNumber);
        addRequired(errors, "lawyerProfile.enrollmentDate", "Enrollment date", lawyer.enrollmentDate);
        addNonNegativeInteger(errors, "lawyerProfile.yearsOfExperience", "Years of experience", lawyer.yearsOfExperience);
        addRequired(errors, "lawyerProfile.specialization", "Specialization", lawyer.specialization);
        addRequired(errors, "lawyerProfile.licenseStatus", "License status", lawyer.licenseStatus);
        addRequired(errors, "lawyerProfile.firmName", "Firm name", lawyer.firmName);
        addRequired(errors, "lawyerProfile.officialContact", "Official contact", lawyer.officialContact);
        validateAddress(errors, "lawyerProfile.officeAddress", "Office address", lawyer.officeAddress);

        if (lawyer.enrollmentDate && lawyer.enrollmentDate > new Date().toISOString().slice(0, 10)) {
            errors["lawyerProfile.enrollmentDate"] = "Enrollment date cannot be in the future.";
        }
    }

    if (form.role === "OFFICER") {
        const officer = form.officerProfile;

        addRequired(errors, "officerProfile.badgeNumber", "Badge number", officer.badgeNumber);
        addPositiveInteger(errors, "officerProfile.departmentUnitId", "Department unit ID", officer.departmentUnitId);
        addRequired(errors, "officerProfile.joiningDate", "Joining date", officer.joiningDate);
        addRequired(errors, "officerProfile.activeStatus", "Active status", officer.activeStatus);

        if (officer.joiningDate && officer.joiningDate > new Date().toISOString().slice(0, 10)) {
            errors["officerProfile.joiningDate"] = "Joining date cannot be in the future.";
        }
    }

    return errors;
};

export const validateCredentials = (form: RegisterFormDraft): ValidationErrors => {
    const errors: ValidationErrors = {};

    addRequired(errors, "email", "Email", form.email);
    addRequired(errors, "password", "Password", form.password);
    addRequired(errors, "confirmPassword", "Confirm password", form.confirmPassword);

    if (form.email && !emailPattern.test(form.email.trim())) {
        errors.email = "Please enter a valid email address.";
    }

    if (form.password && form.password.length < 8) {
        errors.password = "Password must be at least 8 characters long.";
    }

    if (form.confirmPassword && form.password !== form.confirmPassword) {
        errors.confirmPassword = "Passwords do not match.";
    }

    return errors;
};
