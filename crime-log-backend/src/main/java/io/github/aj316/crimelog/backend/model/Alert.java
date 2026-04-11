package io.github.aj316.crimelog.backend.model;

import io.github.aj316.crimelog.backend.model.types.AlertSeverity;
import io.github.aj316.crimelog.backend.model.types.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "alerts")
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long alertId;

    @Column(nullable = false, length = 1000)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AlertSeverity severity;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(nullable = false)
    private Long createdByUserId;

    private Long sourceReportId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role createdByRole;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
