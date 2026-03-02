package io.github.aj316.crimelog.backend.exception;

public class AlreadyExists extends RuntimeException {
    public AlreadyExists(String entity, String value, String field) {
        super(entity + " " + value + " with " + field + " already exists");
    }

    public AlreadyExists(String entity, String value) {
        super(entity + " " + value + " already exists");
    }

    public AlreadyExists(String entity) {
        super(entity + " already exists");
    }

    public AlreadyExists() {
        super("Entity already exists");
    }
}
