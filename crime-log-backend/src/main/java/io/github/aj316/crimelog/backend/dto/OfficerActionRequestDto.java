package io.github.aj316.crimelog.backend.dto;

import io.github.aj316.crimelog.backend.model.OfficerActionRequest;
import io.github.aj316.crimelog.backend.model.types.OfficerAction;

public record OfficerActionRequestDto (
        Long caseId,
        OfficerAction action,
        String requestPayload,
        String reason
) implements MapDto<OfficerActionRequest> {

    @Override
    public OfficerActionRequest mapToEntity() {
        OfficerActionRequest request = new OfficerActionRequest();
        request.setCaseId(caseId);
        request.setAction(action);
        request.setRequestPayload(requestPayload);
        request.setReason(reason);
        return request;
    }
}