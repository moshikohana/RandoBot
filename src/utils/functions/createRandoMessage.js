const createRandoMessage = (randoArray) => {
  const teamNames = ["Team 1", "Team 2", "Team 3", "Team 4", "Team 5"]; // team names

  const formatOpen = "```ansi\n";
  const formatClose = "```";
  const redText = "[0;31m";
  const greenText = "[0;32m";
  const yellowText = "[0;33m";
  const blueText = "[0;34m";
  const whiteText = "[1;37m";

  let messageContent = `${formatOpen}${whiteText}5r Ready to go!\n`; // header message

  randoArray.forEach((team, i) => {
    messageContent += `${whiteText}${teamNames[i]}: `;

    team.forEach((member, j) => {
      // Check if the element is a Discord ID (exactly 10 characters)
      if (/^\d{10}$/.test(member) && member.length > 10) {
        // It's a numeric ID, convert to a mention
        member = `<@${member}>`;
      }

      const color = [redText, redText, greenText, yellowText, blueText][j];
      messageContent += `${color}${member}`;

      if (j < team.length - 1) messageContent += `${whiteText} / `;
    });

    messageContent += "\n";
  });

  messageContent += formatClose;

  return messageContent;
};

module.exports = { createRandoMessage };