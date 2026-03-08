package io.github.aj316.crimelog.backend.model.people.users;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "ranks")
public class Rank {

    @Id
    private Long rankId;

    @Column(nullable = false, unique = true, length = 50)
    private String rankName;

    @Column(nullable = false)
    private Integer hierarchyLevel;

    @Column(length = 255)
    private String description;
}
