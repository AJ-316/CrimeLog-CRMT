package io.github.aj316.crimelog.backend.model.institutes;

import io.github.aj316.crimelog.backend.model.Address;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "courts")
public class Court {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long courtId;

    @Column(nullable = false, length = 100)
    private String courtName;

    @Embedded
    @Valid
    private Address location;
}
