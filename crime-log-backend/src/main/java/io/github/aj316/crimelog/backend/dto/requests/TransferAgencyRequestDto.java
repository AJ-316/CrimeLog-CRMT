package io.github.aj316.crimelog.backend.dto.requests;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.Map;

@NoArgsConstructor(force = true)
@AllArgsConstructor
public class TransferAgencyRequestDto extends RequestDto {

    private final Long targetAgencyId;

    @Override
    protected Map<String, Object> getPayload() {
        if(targetAgencyId == null)
            return super.getPayload();
        return Map.of("targetAgencyId", targetAgencyId);
    }
}
