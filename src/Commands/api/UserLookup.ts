import { ApplicationCommandOptionType, EmbedBuilder, time, TimestampStyles } from "discord.js";
import { Command } from "../../Structures/Command";
import { GetScrapData, GetItemData } from "../../Structures/ApiHelper";

export default new Command({
    name: "userlookup",
    description: "looks up user scrap/items by their display name",
    options: [
        {
            name: "nameorid",
            description: "display name or id to look up",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "type",
            description: "look up for scrap or items",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: "scrap", value: "scrap" },
                { name: "items", value: "items" }
            ]
        },
        {
            name: "platform",
            description: "platform to look up for",
            type: ApplicationCommandOptionType.Integer,
            required: true,
            choices: [
                { name: "twitch", value: 0 },
                { name: "youtube", value: 1 }
            ]
        }
    ],
    run: async( {interaction} ) => {
        if (interaction.guild === null) return;

        const NameOrID = interaction.options.get("nameorid")?.value as String;
        const LookupType = interaction.options.get("type")?.value as String;
		const Platform = interaction.options.get("platform")?.value as number;
        
        if (LookupType === "scrap"){
            const data = await GetScrapData();

            const user = data.find(user => (user.DisplayName.toLowerCase() === NameOrID.toLowerCase() || user.UserId === NameOrID) && user.Platform === Platform);
            if (user === undefined) return interaction.editReply({ content: "User not found" });
			
            const embed = new EmbedBuilder()
                .setTitle(`${user.DisplayName}'s Scrap`)
                .addFields({
                    name: "Scrap Total",
                    value: `${user.ScrapTotal}`,
                })
            	.addFields({
                    name: "Scrap Current",
                    value: `${user.ScrapCurrent}`,
                })
            	.setDescription(`Look up of ${user.DisplayName}`)
				.setFooter({ text: `User ID: ${user.UserId}` })
            	.setTimestamp(Date.now())
            	.setColor("Green");

            return interaction.editReply({ embeds: [embed] });
        }else {
            const data = await GetItemData();

            const items = data.filter(user => (user.DisplayName.toLowerCase() === NameOrID.toLowerCase() || user.UserId === NameOrID) && user.UserPlatform === Platform);
            if (items.length == 0) return interaction.editReply({ content: "User not found" });
			
            const embed = new EmbedBuilder()
                .setTitle(`${items[0].DisplayName}'s Items`)
            	.setDescription(`Look up of ${items[0].DisplayName}`)
				.setFooter({ text: `User ID: ${items[0].UserId}` })
            	.setTimestamp(Date.now())
            	.setColor("Green");

            for (const item of items) {
                embed.addFields({
                    name: `${item.Address} (${item.ItemId})`,
                    value: `Created on ${ConvertToDiscordTimestamp(item.CreationTime)}`,
                })
            }

            return interaction.editReply({ embeds: [embed] }); 
        }
    }
});

function ConvertToDiscordTimestamp(isoTimestamp: string): string | null {
  try {
    // Parse the ISO 8601 timestamp with UTC timezone
    const dt = new Date(isoTimestamp);
    return time(dt, TimestampStyles.LongDateTime)
  } catch (error) {
    // Handle invalid ISO 8601 timestamp format
    return null;
  }
}