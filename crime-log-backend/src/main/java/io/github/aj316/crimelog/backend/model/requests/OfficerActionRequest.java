package io.github.aj316.crimelog.backend.model.requests;

import io.github.aj316.crimelog.backend.model.types.OfficerAction;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "officer_action_requests")
public class OfficerActionRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    @Column(nullable = false)
    private Long caseId;

    @Column(nullable = false)
    private OfficerAction action;

    @Column(nullable = false)
    private String requestPayload = "{}";

    @Column(nullable = false, length = 100)
    private String reason;

    @Column(nullable = false)
    private boolean isApproved = false;
}
