import express from "express";
import { fabricateCreateUserController } from "@usecases/users/create/create-user.factory";
import ExpressHttpRequestAdapter from "/opt/nodejs/presentation/adapters/express-http-request-adapter";
import ExpressHttpResponseAdapter from "/opt/nodejs/presentation/adapters/express-http-response-adapter";
import { fabricateUpdateUserOptOutController } from "@usecases/users/updateUserOptOut/update-user-optout.factory";
import { fabricateUpdateUserDeviceTokenController } from "@usecases/users/updateDeviceToken/update-user-device-token.factory";

const router = express.Router();

router.post("/", async function (req: express.Request, res: express.Response) {
    const httpRequest = ExpressHttpRequestAdapter.adapt(req);
    const controller = fabricateCreateUserController();
    const result = await controller.handle(httpRequest);
    ExpressHttpResponseAdapter.adapt(result, res);
});
router.patch("/optout", async function (req: express.Request, res: express.Response) {
    const httpRequest = ExpressHttpRequestAdapter.adapt(req);
    const controller = fabricateUpdateUserOptOutController();
    const result = await controller.handle(httpRequest);
    ExpressHttpResponseAdapter.adapt(result, res);
});
router.patch("/devicetoken", async function (req: express.Request, res: express.Response) {
    const httpRequest = ExpressHttpRequestAdapter.adapt(req);
    const controller = fabricateUpdateUserDeviceTokenController();
    const result = await controller.handle(httpRequest);
    ExpressHttpResponseAdapter.adapt(result, res);
});

export default router;
