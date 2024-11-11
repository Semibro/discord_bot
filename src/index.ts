import { Events } from "discord.js";
import { env } from "./env";
import { client } from "./discord";

client.on("messageCreate", (message) => {
   if (message.content.split("!")[0] === "준형봇") {
       message.reply("삐빅! 아직 무엇을 만들지 고민하고 있습니다.");
   }
});

client.once(Events.ClientReady, readyClient => {
    console.log("⚡️ 준형 봇이 준비되었습니다!");
});

client.login(env.DISCORD_BOT_TOKEN);