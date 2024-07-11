import { UpdateUserOptOutRepository } from "./update-user-optout.repository";

export type UpdateUserOptOutRequest = {
    city: string;
    frequency: string;
    optOut: boolean;
};

export class UpdateUserOptOutUsecase {
    constructor(private readonly repository: UpdateUserOptOutRepository) {}

    async handle(nickname: string, data: UpdateUserOptOutRequest): Promise<void> {
        await this.repository.handle(nickname, data);
    }
}
