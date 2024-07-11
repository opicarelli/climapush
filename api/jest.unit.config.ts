import jestConfig from "./jest.config";

export default {
    ...jestConfig,
    displayName: "unit",
    testMatch: ["**/test/unit/**/*.spec.ts"],
    collectCoverageFrom: ["src/**/*.{ts,js}", "!**/*.builder.ts", "!**/*.repository.ts", "!**/commons/**"],
    // coverageThreshold: {
    //     global: {
    //         statements: 75,
    //         branches: 75,
    //         functions: 75,
    //         lines: 75,
    //     },
    // },
    transform: {
        "^.+\\.(t|j)s$": ["ts-jest", { isolatedModules: true }],
    },
};
