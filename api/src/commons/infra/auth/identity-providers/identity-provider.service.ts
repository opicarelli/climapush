export interface IdentityProviderService {
    createUser(
        username: string,
        randomPassword: string,
        attributes:
            | {
                  Name: string | undefined;
                  Value?: string;
              }[]
            | undefined
    );

    verifyUser(username: string, password: string);

    updateAttributes(
        username: string,
        attributes: {
            Name: string;
            Value: string;
        }[]
    );

    deleteUser(username: string);

    updateUserPassword(username: string, newPassword: string);
}
