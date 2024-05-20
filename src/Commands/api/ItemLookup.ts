import { ApplicationCommandOptionType, EmbedBuilder, time, TimestampStyles } from "discord.js";
import { Command } from "../../Structures/Command";
import { Platform, EventType, GetItemData } from "../../Structures/ApiHelper";

export default new Command({
    name: "itemlookup",
    description: "looks up item by its id",
    options: [
        {
            name: "id",
            description: "id of the item to look up",
            type: ApplicationCommandOptionType.String,
            required: true
        },
    ],
    run: async( {interaction} ) => {
        if (interaction.guild === null) return;

        const ID = interaction.options.get("id")?.value as String;
        const data = await GetItemData();

        const item = data.find(d => d.ItemId.toLowerCase().trim() === ID.toLowerCase().trim());
        if (!item) return interaction.editReply({ content: "Item not found" });
        
        const embed = new EmbedBuilder()
            .setTitle(`${item.Address}`)
            .setDescription(`Look up of ${item.Address}`)
            .setFooter({ text: `Item ID: ${item.ItemId}` })
            .setTimestamp(Date.now())
            .setColor("Green")
        		.addFields({ name: "Owner", value: `${item.DisplayName}` },
            					 { name: "Platform", value: `${Platform[item.UserPlatform]}` },
          						 { name: "Event", value: `${EventType[item.EventType]}` },
          						 { name: "Value", value: `${item.EventRedeemValue}` },
            					 { name: "Duration", value: `${Math.floor((item.CreationTick / 60) / 3600)}h:${Math.floor((item.CreationTick / 60) % 3600)}m:${Math.floor((item.CreationTick / 60) % 60)}s` },
          						 { name: "Repaired Time", value: `${item.TimeModifier}` },
          						 { name: "Position", value: `${item.PositionX}, ${item.PositionY}, ${item.PositionZ}` },
          						 { name: "Rotation", value: `${item.RotationX}, ${item.RotationY}, ${item.RotationZ}` },
        							 { name: "Created on", value: `${ConvertToDiscordTimestamp(item.CreationTime)}` }
            );

        
        return interaction.editReply({ embeds: [embed] }); 
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