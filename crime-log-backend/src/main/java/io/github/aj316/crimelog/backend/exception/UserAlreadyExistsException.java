package io.github.aj316.crimelog.backend.exception;

public class UserAlreadyExistsException extends AlreadyExistsException {
    public UserAlreadyExistsException(String user, String field) {
        super("User", user, field);
    }

    public UserAlreadyExistsException(String user) {
        super("User", user);
    }

    public UserAlreadyExistsException() {
        super("User");
    }
}
