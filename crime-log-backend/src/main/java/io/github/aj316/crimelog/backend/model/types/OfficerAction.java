package io.github.aj316.crimelog.backend.model.types;

public enum OfficerAction {
    // Case lifecycle
    CREATE_CASE,
    MODIFY_CASE_DETAILS,
    CLOSE_CASE,
    REOPEN_CASE,

    // Case assignment
    ASSIGN_CASE_TO_OFFICER,
    REQUEST_CASE_TRANSFER,
    TRANSFER_CASE,

    // Evidence & records
    ADD_EVIDENCE,
    REMOVE_EVIDENCE,
    UPDATE_EVIDENCE,

    // Investigation updates
    ADD_CASE_NOTE,
    UPDATE_CASE_STATUS,
    UPDATE_SUSPECT_INFORMATION,

    // Legal escalation
    REQUEST_COURT_CASE_CREATION,
    LINK_COURT_CASE,

    // Administrative
    SEND_EMERGENCY_ALERT,
    UPDATE_REPORT_STATUS
}
