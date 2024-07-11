export class User {
    readonly fullName: string;
    readonly nickname: string;
    readonly email: string;

    constructor(fullName: string, nickname: string, email: string) {
        this.fullName = fullName;
        this.nickname = nickname;
        this.email = email;
    }
}
