import { z } from "zod";

const schema = z.object({
    fullName: z.string().min(5).max(70),
    nickname: z
        .string()
        .min(5)
        .max(20)
        .regex(new RegExp(/^[A-Za-z]+$/), "Invalid character, only alphabets letter are available"),
    email: z.string().email(),
    password: z.string().min(6),
});

export default schema;
