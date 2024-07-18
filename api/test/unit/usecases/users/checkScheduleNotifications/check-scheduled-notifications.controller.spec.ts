import { CognitoIdTokenPayload } from "aws-jwt-verify/jwt-model";
import { CheckScheduledNotificationsBuilder } from "./check-scheduled-notifications.builder";
import { AuthContext } from "/opt/nodejs/infra/auth/context";

describe("Check Scheduled Notifications Controller", () => {
    let builder: CheckScheduledNotificationsBuilder;

    beforeEach(() => {
        jest.spyOn(AuthContext.prototype, "verifyToken").mockImplementation(() => {
            return Promise.resolve({} as CognitoIdTokenPayload);
        });
        builder = new CheckScheduledNotificationsBuilder();
    });

    it("test response check scheduled notifications success", async () => {
        builder.setWeatherCityForecast({});
        const result = await builder.controllerResponseSuccess();

        expect(result).toHaveProperty("statusCode", 200);
        expect(result).toHaveProperty("body");
        expect(builder.aRepositoryCheckScheduledNotifications().handle).toHaveBeenCalledTimes(1);
    });
});
