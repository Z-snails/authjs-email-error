import { SvelteKitAuth } from "@auth/sveltekit";
import EmailProvider from "@auth/core/providers/email";
import { Surreal } from "surrealdb.js";
import { env } from "$env/dynamic/private";
import { SurrealDBAdapter } from "@auth/surrealdb-adapter";

const db = new Promise<Surreal>(async (resolve, reject) => {
    try {
        const db = new Surreal();
        await db.connect("ws://localhost:8000/rpc");
        await db.use({ ns: "test", db: "test" });
        return resolve(db);
    } catch (e) {
        return reject(e);
    }
});

export const handle = SvelteKitAuth({
    providers: [EmailProvider({
        server: {
            host: env.EMAIL_SERVER,
            port: Number(env.EMAIL_SERVER_PORT),
            auth: {
                user: env.EMAIL_SERVER_USER,
                pass: env.EMAIL_SERVER_PASS,
            }
        },
        from: env.EMAIL_FROM,
    })],
    trustHost: true,
    adapter: SurrealDBAdapter(db),
    debug: true,
});
