export class UnauthorizedUserError extends Error {
    constructor(message: string) {
        super("UnauthorizedUserError");
        this.name = "UnauthorizedUserError";
        this.message = message;
    }
}
