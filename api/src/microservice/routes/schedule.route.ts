import express from "express";
import ExpressHttpResponseAdapter from "/opt/nodejs/presentation/adapters/express-http-response-adapter";
import { fabricateCheckScheduledNotificationsController } from "@usecases/users/checkScheduledNotifications/check-scheduled-notifications.factory";
import { schedule } from "node-cron";

const router = express.Router();

async function checkScheduleNotificationsHandler() {
    const controller = fabricateCheckScheduledNotificationsController();
    const result = await controller.handle();
    return result;
}

router.get("/", async function (req: express.Request, res: express.Response) {
    const result = await checkScheduleNotificationsHandler();
    ExpressHttpResponseAdapter.adapt(result, res);
});

schedule("*/15 * * * *", checkScheduleNotificationsHandler);

export default router;
