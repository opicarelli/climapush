import dotenv from "dotenv";
// import { resolve } from "path";

dotenv.config({ path: ".env" });

process.env.ENVIRONMENT_NAME = "test";

// const root = resolve(__dirname);

/** @type {import("ts-jest").JestConfigWithTsJest} */
export default {
    testEnvironment: "node",
    clearMocks: true,
    preset: "ts-jest",
    moduleNameMapper: {
        "/opt/nodejs/(.*)": "<rootDir>/src/commons/$1",
        "@usecases/(.*)": "<rootDir>/src/usecases/$1",
    },
    setupFiles: ["dotenv/config"],
    modulePathIgnorePatterns: [
        "<rootDir>/dist/",
        "<rootDir>/node_modules/",
        "<rootDir>/src/",
        "<rootDir>/.aws-sam/",
        "<rootDir>/test/factories/",
    ],
};
