import { GetStreamData } from "../../Structures/ApiHelper";
import { Command } from "../../Structures/Command";
import { EmbedBuilder } from "discord.js";

export default new Command({
    name: "aiastats",
    description: "Sends AIA Twitch statistics",
    run: async( {interaction} ) => {
      	const data = await GetStreamData();
      	
        const embed = new EmbedBuilder()
    			.setTitle("the_aia's Stream Statistics")
					.addFields(
            { name: "Rank", value: data.rank.toString(), inline: true },
            { name: "Minutes Streamed", value: data.minutes_streamed.toString(), inline: true },
            { name: "Avg Viewers", value: data.avg_viewers.toString(), inline: true },
            { name: "Max Viewers", value: data.max_viewers.toString(), inline: true },
            { name: "Hours Watched", value: data.hours_watched.toString(), inline: true },
            { name: "Followers", value: data.followers.toString(), inline: true },
            { name: "Followers Total", value: data.followers_total.toString(), inline: true }
          )
      		.setColor("Green")
      		.setTimestamp(Date.now());

        await interaction.editReply({ embeds: [embed] });
    }
});
