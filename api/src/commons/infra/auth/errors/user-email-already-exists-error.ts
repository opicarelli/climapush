export class UserEmailAlreadyExists extends Error {
    constructor() {
        super("UserEmailAlreadyExistsError");
        this.name = "UserEmailAlreadyExistsError";
    }
}
