import type {AddressDto} from "../api/dtos/addressDto.ts";
import type {CaseParticipantType} from "../api/types.ts";

export const formatEnumLabel = (value: string | null | undefined): string => {
    if (!value) {
        return "Not set";
    }

    return value
        .toLowerCase()
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
};

export const formatDate = (value: string | null | undefined): string => {
    if (!value) {
        return "Not set";
    }

    return new Date(value).toLocaleDateString();
};

export const formatDateTime = (value: string | null | undefined): string => {
    if (!value) {
        return "Not set";
    }

    return new Date(value).toLocaleString();
};

export const formatAddress = (address: AddressDto | null | undefined): string => {
    if (!address) {
        return "Not set";
    }

    return [address.street, address.city, address.state, address.postalCode, address.countryCode]
        .filter(Boolean)
        .join(", ");
};

export const formatParticipantRole = (value: CaseParticipantType): string => {
    if (value === "SUSPECT") {
        return "Accused";
    }

    return formatEnumLabel(value);
};

