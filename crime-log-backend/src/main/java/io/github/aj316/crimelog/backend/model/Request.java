package io.github.aj316.crimelog.backend.model;

import io.github.aj316.crimelog.backend.model.types.RequestType;
import io.github.aj316.crimelog.backend.model.types.Status;
import io.github.aj316.crimelog.backend.validation.ValidJsonFormat;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "requests")
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    @Column(nullable = false)
    private RequestType requestType;

    @Column(nullable = false)
    private Long requestedByUserId;

    @Column(nullable = false)
    private Long caseId;

    @Column(nullable = false)
    private Long firId;

    @Column(nullable = false)
    private Status status = Status.PENDING;

    @Column(length = 1000)
    private String reason;

    @ValidJsonFormat
    @Column(nullable = false)
    private String payloadJson;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private LocalDateTime reviewedAt;
    private Long reviewedByUserId;
}
