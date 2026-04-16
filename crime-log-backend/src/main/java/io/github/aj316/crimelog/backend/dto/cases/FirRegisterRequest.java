package io.github.aj316.crimelog.backend.dto.cases;

import io.github.aj316.crimelog.backend.dto.AddressDto;
import io.github.aj316.crimelog.backend.dto.MapDto;
import io.github.aj316.crimelog.backend.model.cases.FIR;
import io.github.aj316.crimelog.backend.model.types.FIR_Type;

import java.time.LocalDateTime;

public record FirRegisterRequest(
        String firNumber,
        FIR_Type firType,
        LocalDateTime registrationDateTime,

        String accusedFirstName,
        String accusedMiddleName,
        String accusedLastName,
        String accusedContact,
        String accusedDescription,
        AddressDto accusedAddress,

        Long initialInvestigatingUnitId,
        Long officerIdCreatedBy, // current logged in officer's id

        AddressDto incidentPlace,
        LocalDateTime incidentDateTime,
        String incidentDescription
) implements MapDto<FIR> {

    @Override
    public FIR mapToEntity() {
        FIR fir = new FIR();
        fir.setFirNumber(firNumber != null ? firNumber.trim() : null);
        fir.setFirType(firType);
        fir.setRegistrationDateTime(registrationDateTime);
        fir.setAccusedFirstName(accusedFirstName != null ? accusedFirstName.trim() : null);
        fir.setAccusedMiddleName(accusedMiddleName != null && !accusedMiddleName.isBlank() ? accusedMiddleName.trim() : null);
        fir.setAccusedLastName(accusedLastName != null ? accusedLastName.trim() : null);
        fir.setAccusedContact(accusedContact != null && !accusedContact.isBlank() ? accusedContact.trim() : null);
        fir.setAccusedAddress(accusedAddress != null ? accusedAddress.mapToEntity() : null);
        fir.setIncidentPlace(incidentPlace != null ? incidentPlace.mapToEntity() : null);
        fir.setIncidentDateTime(incidentDateTime);
        fir.setIncidentDescription(incidentDescription != null && !incidentDescription.isBlank() ? incidentDescription.trim() : null);
        return fir;
    }
}
