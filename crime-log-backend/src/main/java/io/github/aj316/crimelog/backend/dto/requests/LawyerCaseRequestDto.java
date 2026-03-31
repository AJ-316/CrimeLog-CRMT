package io.github.aj316.crimelog.backend.dto.requests;

import io.github.aj316.crimelog.backend.model.types.LawyerRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@NoArgsConstructor(force = true)
@AllArgsConstructor
@Getter
@Setter
public class LawyerCaseRequestDto extends RequestDto {

    private LawyerRole lawyerRole;

    @Override
    protected Map<String, Object> getPayload() {
        if(lawyerRole == null)
            return super.getPayload();

        return Map.of("lawyerRole", lawyerRole);
    }
}
