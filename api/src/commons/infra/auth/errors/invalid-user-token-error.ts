export class InvalidUserTokenError extends Error {
    constructor() {
        super("InvalidUserTokenError");
        this.name = "InvalidUserTokenError";
    }
}
