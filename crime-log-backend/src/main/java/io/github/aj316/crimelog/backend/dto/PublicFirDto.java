package io.github.aj316.crimelog.backend.dto;

import io.github.aj316.crimelog.backend.model.cases.FIR;
import io.github.aj316.crimelog.backend.model.types.FIR_Type;

import java.time.LocalDateTime;

public record PublicFirDto(
        String firNumber,
        FIR_Type firType,
        LocalDateTime registrationDateTime,
        String accusedName,
        String incidentCity,
        LocalDateTime incidentDateTime
) {
    public static PublicFirDto from(FIR fir) {
        String accusedName = String.join(" ",
                java.util.stream.Stream.of(fir.getAccusedFirstName(), fir.getAccusedMiddleName(), fir.getAccusedLastName())
                        .filter(value -> value != null && !value.isBlank())
                        .toList());

        return new PublicFirDto(
                fir.getFirNumber(),
                fir.getFirType(),
                fir.getRegistrationDateTime(),
                accusedName,
                fir.getIncidentPlace() != null ? fir.getIncidentPlace().getCity() : null,
                fir.getIncidentDateTime()
        );
    }
}
