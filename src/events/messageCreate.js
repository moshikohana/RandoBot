module.exports = (client) => {
  console.log("inside the receiveMessages");

  client.on("messageCreate", (message) => {
    if (message.author.bot) {
      console.log("message was a bot");
      return;
    }

    const commands = require("../utils/helper");

    if (message.content.startsWith("!5r")) {
      const args = message.content.split(' ').slice(1);
      if (args.length === 5) {
        commands.handleRandoCommand(message, args);
      } else {
        message.channel.send("Please provide exactly 5 names or IDs.");
      }
    } else if (message.content.startsWith("+")) {
      if (message.content.startsWith("+new")) {
        commands.handleNewCommand(message);
      } else if (message.content.startsWith("+out")) {
        commands.handleOutCommand(message);
      } else if (message.content.startsWith("+?")) {
        commands.handleStatusCommand(message);
      } else if (message.content.startsWith("+5")) { // Handle +5 command
        commands.handleResetCommand(message);
      } else {
        const plusMatch = message.content.match(/^\+(\d+)/);
        if (plusMatch) {
          commands.handleUpdateCommand(message);
        } else {
          console.log("not a recognized + command");
        }
      }
    } else if (message.content.startsWith("!info")) {
      message.channel.send(`
      \`\`\`yaml
      Quick Commands:
        !5r: Shuffle 5 names.
        +new: Start a new session.
        +out: Leave or remove (Techcan remove others).
        +?: Show session status.
        +5: no players in session (+5 status).
      
      Rules & Tips:
        +In/Out: Adjust with +1/-1.
        Full Session: Auto-randomize when +0.
      \`\`\`
      `);
      
      
    }
  });
};
