package io.github.aj316.crimelog.backend.model.cases;

import io.github.aj316.crimelog.backend.model.people.users.LawyerProfile;
import io.github.aj316.crimelog.backend.model.types.LawyerRole;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "case_lawyers")
@NoArgsConstructor
public class CaseLawyer {

    public CaseLawyer(Case caseEntity, LawyerProfile lawyer, LawyerRole role) {
        this.caseEntity = caseEntity;
        this.lawyer = lawyer;
        this.role = role;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long caseLawyerId;

    @ManyToOne
    @JoinColumn(name = "case_id", nullable = false)
    private Case caseEntity;

    @ManyToOne
    @JoinColumn(name = "lawyer_id", nullable = false)
    private LawyerProfile lawyer;

    @Enumerated(EnumType.STRING)
    private LawyerRole role;

    @CreationTimestamp
    private LocalDateTime assignedAt;
}