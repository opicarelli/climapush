import { z } from "zod";

export const schemaBody = z.object({
    city: z.string(),
    frequency: z.string(),
    optOut: z.boolean(),
});
