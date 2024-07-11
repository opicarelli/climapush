export class UserNicknameAlreadyExists extends Error {
    constructor() {
        super("UserNicknameAlreadyExistsError");
        this.name = "UserNicknameAlreadyExistsError";
    }
}
