import { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ApplicationCommandOptionType } from "discord.js";
import { Command } from "../../Structures/Command";
import { APIScrap, GetScrapData } from "../../Structures/ApiHelper";

const ROWSPERPAGE = 5;

export default new Command({
    name: "leaderboard",
    description: "Shows the leaderboard for scrap",
    options: [
        {
            name: "sortby",
            description: "Sort by the leaderboard",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: "Total scrap", value: "total" },
                { name: "Current scrap", value: "current" },
                { name: "Display name", value: "name" },
                { name: "User id", value: "id" },
                { name: "Platform", value: "platform" }
            ]
        },
    ],
    run: async( {interaction} ) => {
        if (interaction.guild === null) return;
        const sortby = interaction.options.get("sortby")?.value as String;
        
        const data = await GetScrapData();
        let sortedData: APIScrap[] = [];
		if (sortby === "total") sortedData = data.sort((a, b) => b.ScrapTotal - a.ScrapTotal)
		else if (sortby === "current") sortedData = data.sort((a, b) => b.ScrapCurrent - a.ScrapCurrent)
        else if (sortby === "name") sortedData = data.sort((a, b) => a.DisplayName.localeCompare(b.DisplayName))
        else if (sortby === "id") sortedData = data.sort((a, b) => a.UserId.localeCompare(b.UserId))
        else if (sortby === "platform") sortedData = data.sort((a, b) => a.Platform - b.Platform)
        
        const TotalPages = Math.ceil(sortedData.length / ROWSPERPAGE);
        let currentPage = 1;
        const startIndex = (currentPage - 1) * ROWSPERPAGE;
        const endIndex = startIndex + ROWSPERPAGE;
    	const pageData = sortedData.slice(startIndex, endIndex);
        
        const embed = new EmbedBuilder()
        	.setTitle("Scrap Leaderboard")
        	.setDescription(`Showing page ${currentPage} of ${TotalPages}`)
        	.setFooter({ text: `Total Scrap: ${sortedData.reduce((acc, curr) => acc + curr.ScrapTotal, 0)}` })
        	.setTimestamp(Date.now())
        	.setColor("Green");

		for (const item of pageData) {
            embed.addFields({
                name: `${item.DisplayName} (${item.UserId})`,
                value: `Total Scrap: ${item.ScrapTotal}\nCurrent Scrap: ${item.ScrapCurrent}`,
            })
        }
        
        const previousButton = new ButtonBuilder()
        	.setCustomId("previous")
        	.setLabel("Previous")
        	.setStyle(ButtonStyle.Primary)
        	.setEmoji("◀️")
        	.setDisabled(currentPage === 1);

        const nextButton = new ButtonBuilder()
        	.setCustomId("next")
        	.setLabel("Next")
        	.setStyle(ButtonStyle.Primary)
        	.setEmoji("▶️")
        	.setDisabled(currentPage === TotalPages);

        const row = new ActionRowBuilder<ButtonBuilder>()
        	.addComponents(previousButton, nextButton);

        const message = await interaction.editReply({ embeds: [embed], components: [row] });

        const filter = (i: any) => i.user.id === interaction.user.id;
        const collector = message.createMessageComponentCollector({ filter, time: 60000 });
        
        collector.on("collect", async(i) => {
            if (i.customId === "previous") {
                currentPage--;
            } else if (i.customId === "next") {
                currentPage++;
            }

            const startIndex = (currentPage - 1) * ROWSPERPAGE;
            const endIndex = startIndex + ROWSPERPAGE;
            const pageData = sortedData.slice(startIndex, endIndex);

            const embed = new EmbedBuilder()
            	.setTitle("Scrap Leaderboard")
            	.setDescription(`Showing page ${currentPage} of ${TotalPages}`)
            	.setFooter({ text: `Total Scrap: ${sortedData.reduce((acc, curr) => acc + curr.ScrapTotal, 0)}` })
            	.setTimestamp(Date.now())
            	.setColor("Green");

            for (const item of pageData) {
                embed.addFields({
                    name: `${item.DisplayName} (${item.UserId})`,
                    value: `Total Scrap: ${item.ScrapTotal}\nCurrent Scrap: ${item.ScrapCurrent}`,
                })
            }

            const previousButton = new ButtonBuilder()
            	.setCustomId("previous")
            	.setLabel("Previous")
            	.setStyle(ButtonStyle.Primary)
            	.setEmoji("◀️")
            	.setDisabled(currentPage === 1);
            
            const nextButton = new ButtonBuilder()
            	.setCustomId("next")
            	.setLabel("Next")
            	.setStyle(ButtonStyle.Primary)
            	.setEmoji("▶️")
            	.setDisabled(currentPage === TotalPages);

            const row = new ActionRowBuilder<ButtonBuilder>()
            	.addComponents(previousButton, nextButton);

            await i.update({ embeds: [embed], components: [row] });
            
        })
    }
});