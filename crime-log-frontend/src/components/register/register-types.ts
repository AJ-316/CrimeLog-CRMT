import type {AddressDto} from "../../api/dtos/addressDto.ts";
import type {
    RegisterLawyerRequest,
    RegisterOfficerRequest,
    RegisterRequest,
    RegisterUserRequest
} from "../../api/dtos/auth.ts";
import type {PersonDto} from "../../api/dtos/personDto.ts";
import type {ActiveStatus, LawyerSpecialization, LicenseStatus, Role} from "../../api/types.ts";

export type RegisterRole = Exclude<Role, "ADMIN">;
export type PersonAddressKey = "birthPlace" | "permanentAddress" | "currentAddress";
export type PersonScalarFieldKey = Exclude<keyof PersonDto, PersonAddressKey>;
export type CredentialFieldKey = "email" | "password" | "confirmPassword";

export interface RegisterLawyerDraft {
    barCouncilId: string;
    barRegistrationNumber: string;
    enrollmentDate: string;
    yearsOfExperience: string;
    specialization: LawyerSpecialization | "";
    licenseStatus: LicenseStatus | "";
    firmName: string;
    officeAddress: AddressDto;
    officialContact: string;
    isPublicDefender: boolean;
}

export interface RegisterOfficerDraft {
    badgeNumber: string;
    departmentUnitId: string;
    joiningDate: string;
    activeStatus: ActiveStatus | "";
}

export interface RegisterFormDraft {
    role: RegisterRole;
    personDto: PersonDto;
    lawyerProfile: RegisterLawyerDraft;
    officerProfile: RegisterOfficerDraft;
    email: string;
    password: string;
    confirmPassword: string;
}

export const RegisterRoleOptions = ["PUBLIC", "LAWYER", "OFFICER"] as const satisfies readonly RegisterRole[];

export const createEmptyAddress = (): AddressDto => ({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    countryCode: ""
});

export const createEmptyPerson = (): PersonDto => ({
    nationalId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    profilePhotoPath: "",
    dateOfBirth: "",
    gender: "MALE",
    nationalityCode: "",
    birthPlace: createEmptyAddress(),
    permanentAddress: createEmptyAddress(),
    currentAddress: createEmptyAddress(),
    contactPrimary: "",
    contactSecondary: ""
});

export const createInitialRegisterForm = (): RegisterFormDraft => ({
    role: "PUBLIC",
    personDto: createEmptyPerson(),
    lawyerProfile: {
        barCouncilId: "",
        barRegistrationNumber: "",
        enrollmentDate: "",
        yearsOfExperience: "",
        specialization: "",
        licenseStatus: "",
        firmName: "",
        officeAddress: createEmptyAddress(),
        officialContact: "",
        isPublicDefender: false
    },
    officerProfile: {
        badgeNumber: "",
        departmentUnitId: "",
        joiningDate: "",
        activeStatus: ""
    },
    email: "",
    password: "",
    confirmPassword: ""
});

const normalizeAddress = (address: AddressDto): AddressDto => ({
    street: address.street?.trim(),
    city: address.city?.trim(),
    state: address.state?.trim(),
    postalCode: address.postalCode?.trim(),
    countryCode: address.countryCode?.trim()
});

const normalizePerson = (person: PersonDto): PersonDto => ({
    nationalId: person.nationalId.trim(),
    firstName: person.firstName.trim(),
    middleName: person.middleName.trim(),
    lastName: person.lastName.trim(),
    profilePhotoPath: person.profilePhotoPath.trim(),
    dateOfBirth: person.dateOfBirth,
    gender: person.gender,
    nationalityCode: person.nationalityCode.trim(),
    birthPlace: normalizeAddress(person.birthPlace),
    permanentAddress: normalizeAddress(person.permanentAddress),
    currentAddress: normalizeAddress(person.currentAddress),
    contactPrimary: person.contactPrimary.trim(),
    contactSecondary: person.contactSecondary.trim()
});

const requireLawyerSpecialization = (value: RegisterLawyerDraft["specialization"]): LawyerSpecialization => {
    if (!value) {
        throw new Error("Lawyer specialization is required.");
    }

    return value;
};

const requireLicenseStatus = (value: RegisterLawyerDraft["licenseStatus"]): LicenseStatus => {
    if (!value) {
        throw new Error("License status is required.");
    }

    return value;
};

const requireActiveStatus = (value: RegisterOfficerDraft["activeStatus"]): ActiveStatus => {
    if (!value) {
        throw new Error("Active status is required.");
    }

    return value;
};

export const buildRegisterRequest = (form: RegisterFormDraft): RegisterRequest => {
    const baseRequest = {
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        personDto: normalizePerson(form.personDto)
    };

    switch (form.role) {
        case "LAWYER": {
            const lawyerRequest: RegisterLawyerRequest = {
                ...baseRequest,
                role: "LAWYER",
                barCouncilId: Number(form.lawyerProfile.barCouncilId),
                barRegistrationNumber: form.lawyerProfile.barRegistrationNumber.trim(),
                enrollmentDate: form.lawyerProfile.enrollmentDate,
                yearsOfExperience: Number(form.lawyerProfile.yearsOfExperience),
                specialization: requireLawyerSpecialization(form.lawyerProfile.specialization),
                licenseStatus: requireLicenseStatus(form.lawyerProfile.licenseStatus),
                firmName: form.lawyerProfile.firmName.trim(),
                officeAddress: normalizeAddress(form.lawyerProfile.officeAddress),
                officialContact: form.lawyerProfile.officialContact.trim(),
                isPublicDefender: form.lawyerProfile.isPublicDefender
            };

            return lawyerRequest;
        }
        case "OFFICER": {
            const officerRequest: RegisterOfficerRequest = {
                ...baseRequest,
                role: "OFFICER",
                badgeNumber: form.officerProfile.badgeNumber.trim(),
                departmentUnitId: Number(form.officerProfile.departmentUnitId),
                joiningDate: form.officerProfile.joiningDate,
                activeStatus: requireActiveStatus(form.officerProfile.activeStatus)
            };

            return officerRequest;
        }
        default: {
            const publicRequest: RegisterUserRequest = {
                ...baseRequest,
                role: "PUBLIC"
            };

            return publicRequest;
        }
    }
};
