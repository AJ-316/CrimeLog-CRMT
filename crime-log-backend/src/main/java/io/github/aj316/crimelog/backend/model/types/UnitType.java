package io.github.aj316.crimelog.backend.model.types;

import lombok.Getter;

import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
public enum UnitType {
    POLICE_STATION("PS", true),
    HEADQUARTERS("HQ", true),
    CYBER_CELL("CYB", false),
    CRIMINAL_INVESTIGATION_DEPARTMENT("CID", false),
    SPECIAL_TASK_FORCE("STF", false),
    TRAFFIC("TRAF", true),
    INTELLIGENCE("INT", false);

    private static final Map<String, UnitType> BY_CODE = Arrays.stream(values()).collect(Collectors.toMap(UnitType::getCode, t -> t));
    private final String code;
    private final boolean physicalLocation;

    UnitType(String code, boolean physicalLocation) {
        this.code = code;
        this.physicalLocation = physicalLocation;
    }

    public static UnitType fromCode(String code) {
        UnitType type = BY_CODE.get(code);
        if (type == null) {
            throw new IllegalArgumentException("Invalid unit type code: " + code);
        }
        return type;
    }

    public static boolean isValidCode(String code) {
        return BY_CODE.containsKey(code);
    }
}