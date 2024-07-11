import { z } from "zod";

export const schemaBody = z.object({
    deviceToken: z.string(),
});
