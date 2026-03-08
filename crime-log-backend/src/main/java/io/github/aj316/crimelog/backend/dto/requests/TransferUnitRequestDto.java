package io.github.aj316.crimelog.backend.dto.requests;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.Map;

@NoArgsConstructor(force = true)
@AllArgsConstructor
public class TransferUnitRequestDto extends RequestDto {

    private final Long targetUnitId;

    @Override
    protected Map<String, Object> getPayload() {
        if(targetUnitId == null)
            return super.getPayload();

        return Map.of("targetUnitId", targetUnitId);
    }
}
