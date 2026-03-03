package io.github.aj316.crimelog.backend.model.types;

import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

public enum UnitType {
    POLICE_STATION("PS"),
    HEADQUARTERS("HQ"),
    CYBER_CELL("CYB"),
    CRIMINAL_INVESTIGATION_DEPARTMENT("CID"),
    SPECIAL_TASK_FORCE("STF"),
    TRAFFIC("TRAF"),
    INTELLIGENCE("INT");

    private final String code;
    private static final Map<String, UnitType> BY_CODE = Arrays.stream(values()).collect(Collectors.toMap(UnitType::code, t -> t));

    UnitType(String code) {
        this.code = code;
    }

    public String code() {
        return code;
    }

    public static UnitType fromCode(String code) {
        return BY_CODE.get(code);
    }

    public static boolean isValidCode(String code) {
        return BY_CODE.containsKey(code);
    }
}