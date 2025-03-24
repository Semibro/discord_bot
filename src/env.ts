import dotenv from "dotenv"

dotenv.config();

export const env = {
    DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
    DISCORD_CHANNEL_ID: process.env.DISCORD_CHANNEL_ID,
    GPT_API_KEY: process.env.GPT_API_KEY,
    GPT_MODEL: process.env.GPT_MODEL || "gpt-3.5-turbo",
};