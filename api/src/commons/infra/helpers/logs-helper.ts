export class Logger {
    /**
     * Log info
     *
     * @param {string} message message to log
     */
    static info(message: string) {
        if (process.env.ENVIRONMENT_NAME === "test") {
            return;
        }

        console.info(message);
    }

    /**
     * Log error
     *
     * @param {string} message message to log
     * @param {Error} error exception
     */
    static error(message: string, error: unknown) {
        if (process.env.ENVIRONMENT_NAME === "test") {
            return;
        }

        console.error(message, error);
    }

    /**
     * Log info
     *
     * @param {string} message message to log
     */
    static debug(message: string) {
        if (process.env.ENVIRONMENT_NAME === "test") {
            return;
        }

        console.debug(message);
    }
}
