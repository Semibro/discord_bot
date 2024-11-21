import dotenv from "dotenv"

dotenv.config();

export const env = {
    DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
    GPT_API_KEY: process.env.GPT_API_KEY,
    GPT_MODEL: process.env.GPT_MODEL || "gpt-3.5-turbo",
};