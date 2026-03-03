package io.github.aj316.crimelog.backend.exception;

public class AlreadyExistsException extends RuntimeException {
    public AlreadyExistsException(String entity, String value, String field) {
        super(entity + " " + value + " with " + field + " already exists");
    }

    public AlreadyExistsException(String entity, String value) {
        super(entity + " " + value + " already exists");
    }

    public AlreadyExistsException(String entity) {
        super(entity + " already exists");
    }

    public AlreadyExistsException() {
        super("Entity already exists");
    }
}
