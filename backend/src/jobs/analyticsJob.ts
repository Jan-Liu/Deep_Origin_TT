import { Queue, Worker } from "bullmq";
import { Url } from "../models/Url";

const analyticsQueue = new Queue("analytics", {
    connection: {
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT) || 6379,
    },
});

new Worker(
    "analytics",
    async (job) => {
        const { slug, ip, userAgent, timestamp } = job.data;

        const url = await Url.findOne({ slug });
        if (url) {
            url.visitors.push({ ip, userAgent, timestamp });
            await url.save();
        }
    },
    {
        connection: {
            host: process.env.REDIS_HOST || "localhost",
            port: Number(process.env.REDIS_PORT) || 6379,
        },
    }
);

export default analyticsQueue;
