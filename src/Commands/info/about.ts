import { Command } from "../../Structures/Command";
import { EmbedBuilder } from "discord.js";

export default new Command({
    name: "about",
    description: "About this bot",
    run: async( {interaction} ) => {
        const embed = new EmbedBuilder()
    		.setTitle("About this bot")
        	.setDescription(
`
This project is a bot that allows you to track your scrap and items on [AIA](https://www.twitch.tv/the_aia) streams.
                
If you liked this project, please consider supporting it by [staring](https://github.com/Abdallah-Alwarawreh/aia-stream-utils) the repository on GitHub.
Note: This bot isn't affiliated with AIA's Studio it's just a bot that I made for fun.
`
            ).setAuthor({
                name: "Abdallah Alwarawreh",
                iconURL: "https://avatars.githubusercontent.com/u/66683380",
                url: "https://github.com/Abdallah-Alwarawreh"
            }).setFooter({
                text: "Made with ❤️ by Abdallah Alwarawreh"
            }).setTimestamp(Date.now());

        await interaction.editReply({ embeds: [embed] });
    }
});