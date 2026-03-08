package io.github.aj316.crimelog.backend.model.people.users;

import io.github.aj316.crimelog.backend.model.people.Person;
import io.github.aj316.crimelog.backend.model.types.Status;
import io.github.aj316.crimelog.backend.model.types.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "users")
public class User {

    @Setter(AccessLevel.NONE)
    @Id
    private Long userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private Person person;

    @Column(length = 60, unique = true, nullable = false)
    private String password;

    @Email
    @Column(length = 255, unique = true, nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.PUBLIC;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status accountStatus = Status.PENDING;
}
