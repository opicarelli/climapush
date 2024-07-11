import { fabricateCheckScheduledNotificationsController } from "./check-scheduled-notifications.factory";

const controller = fabricateCheckScheduledNotificationsController();

export const handler = async () => {
    return await controller.handle();
};
