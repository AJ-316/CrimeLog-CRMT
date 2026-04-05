package io.github.aj316.crimelog.backend.model;

import io.github.aj316.crimelog.backend.model.types.CrimeReportStatus;
import io.github.aj316.crimelog.backend.model.types.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "crime_report_timeline")
public class CrimeReportTimelineEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long timelineId;

    @Column(nullable = false)
    private Long reportId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CrimeReportStatus status;

    @Column(length = 1000)
    private String note;

    @Column(nullable = false)
    private Long changedByUserId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role changedByRole;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
