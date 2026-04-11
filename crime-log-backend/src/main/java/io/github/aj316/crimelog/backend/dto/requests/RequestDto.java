package io.github.aj316.crimelog.backend.dto.requests;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.aj316.crimelog.backend.dto.MapDto;
import io.github.aj316.crimelog.backend.model.Request;
import io.github.aj316.crimelog.backend.model.types.RequestType;
import io.github.aj316.crimelog.backend.model.types.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Map;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        include = JsonTypeInfo.As.EXISTING_PROPERTY,
        property = "requestType",
        visible = true
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = RequestDto.class, name = "SUBMIT_CHARGE_SHEET"),
        @JsonSubTypes.Type(value = LawyerCaseRequestDto.class, name = "LAWYER_CASE_REQUEST"),
        @JsonSubTypes.Type(value = TransferAgencyRequestDto.class, name = "TRANSFER_AGENCY"),
        @JsonSubTypes.Type(value = TransferUnitRequestDto.class, name = "TRANSFER_UNIT")
})
@Getter
@Setter
@NoArgsConstructor(force = true)
@AllArgsConstructor
public class RequestDto implements MapDto<Request> {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @JsonProperty("requestType")
    private RequestType requestType;
    private Long requestedByUserId;
    private Long caseId;
    private Long firId;
    private Status status;
    private String reason;
    private LocalDateTime reviewedAt;
    private Long reviewedByUserId;

    public Request mapToEntity() {
        Request request = new Request();
        request.setRequestType(this.requestType);
        request.setRequestedByUserId(this.requestedByUserId);
        request.setCaseId(this.caseId);
        request.setFirId(this.firId);
        request.setStatus(this.status);
        request.setReason(this.reason);
        request.setReviewedAt(this.reviewedAt);
        request.setReviewedByUserId(this.reviewedByUserId);
        request.setPayloadJson(getPayloadJson());
        return request;
    }

    private String getPayloadJson() {
        Map<String, Object> map = getPayload();
        if(map.isEmpty()) return "{}";

        try {
            return objectMapper.writeValueAsString(map);
        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            return "{}";
        }
    }

    protected Map<String, Object> getPayload() {
        return Map.of();
    }
}
