package io.github.aj316.crimelog.backend.model;

import io.github.aj316.crimelog.backend.model.types.CrimeReportStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "crime_reports")
public class CrimeReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportId;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 4000)
    private String description;

    @Column(nullable = false, length = 255)
    private String location;

    private LocalDateTime incidentDateTime;

    @Column(nullable = false)
    private Long reporterUserId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CrimeReportStatus status = CrimeReportStatus.SENT_TO_POLICE;

    @Column(nullable = false)
    private Boolean publicBroadcasted = false;

    private LocalDateTime acknowledgedAt;
    private Long acknowledgedByUserId;

    private LocalDateTime publicBroadcastedAt;
    private Long publicBroadcastedByUserId;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
