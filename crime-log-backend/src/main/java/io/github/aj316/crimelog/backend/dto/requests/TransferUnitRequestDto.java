package io.github.aj316.crimelog.backend.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@NoArgsConstructor(force = true)
@AllArgsConstructor
@Getter
@Setter
public class TransferUnitRequestDto extends RequestDto {

    private Long targetUnitId;

    @Override
    protected Map<String, Object> getPayload() {
        if(targetUnitId == null)
            return super.getPayload();

        return Map.of("targetUnitId", targetUnitId);
    }
}
