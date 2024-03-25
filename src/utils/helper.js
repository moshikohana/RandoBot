const { createRandoMessage } = require("./functions/createRandoMessage");
const { rando } = require("./functions/rando");

let names = []; // will hold all the names that have plussed in
let currentPlus = 5; // the initial status of the plus


const handleNewCommand = (message) => {
  const author = message.author.globalName; // Or username, adjust according to your setup
  const uid = message.author.id;

  // Check if the user is in the current list of names
  const isUserInList = names.some(user => user.id === uid);

  // Proceed only if the user is in the list or if the list is empty (indicating a new session can start)
  if (isUserInList || names.length === 0) {
    currentPlus = 4;
    // Optionally, you might want to reset the list when starting a new session
    names = [{ name: author, id: uid }]; // This line resets the names for the new session

    let currentPlayers = names.map(user => user.name).join(", ");
    message.channel.send(
      `\`\`\`ansi\n[1;37mNew + started.\n+${currentPlus}\nFollowing players: [0;37m${currentPlayers}.\`\`\``
    );
  } else {
    // If the user is not in the list and the list is not empty, prevent starting a new session
    message.channel.send("You must be part of the current + session to start a new one.");
  }
};

const handleStatusCommand = async (message) => {
  // Recalculate the currentPlus based on the number of participants
  const targetSessionSize = 5; // Define the target size for a full session
  currentPlus = targetSessionSize - names.length; // Adjust currentPlus based on current participants
  currentPlus = Math.max(currentPlus, 0); // Ensure currentPlus does not go below 0

  if (names.length === 0) {
      message.channel.send("```yaml\n+5\n```"); // No participants means the session is fully open
      return;
  }

  // Proceed with fetching usernames for participants with IDs
  const participantDisplayNames = await Promise.all(names.map(async participant => {
      if (participant.id && participant.id.match(/^\d+$/)) { // Check if the participant.id is numeric
          try {
              const user = await message.client.users.fetch(participant.id);
              return user.username; // Use username for display
          } catch (error) {
              console.error("Failed to fetch user for ID:", participant.id);
              return "Unknown User"; // Fallback for failed fetch attempts
          }
      } else {
          return participant.name; // Use the name directly for non-ID participants
      }
  }));

  const participantsList = participantDisplayNames.join(", ");
  message.channel.send(`\`\`\`ansi\n+${currentPlus}\nFollowing players: ${participantsList}\`\`\``);
};



// The main function to handle + commands
const handleUpdateCommand = async (message) => {
  const args = message.content.slice(1).trim().split(' ');
  const plus = parseInt(args[0]);
  let extraName = args.length > 1 ? args.slice(1).join(' ') : null;
  const author = message.author.username; // Adjusted to use username for consistency
  const uid = message.author.id;

  if (plus === 5) {
    names = []; // Clear the participant list
    currentPlus = 5; // Reset the session status to fully open
    message.channel.send("Session is now open (+5). All previous plusses are cleared.");
    return; // Stop further processing
}

  // Validate the plus value to be within the range of 0 to 5
  if (isNaN(plus) || plus > 5 || plus < 0) {
      message.channel.send("Invalid command. Please use a number between +0 and +5 to indicate the + status.");
      return;
  }

  // Handle mentions by converting them to usernames
  if (extraName && extraName.includes('<@') && extraName.includes('>')) {
      const mentionedUserId = extraName.match(/<@!?(\d+)>/)[1]; // Extract the ID from the mention
      try {
          const user = await message.client.users.fetch(mentionedUserId);
          extraName = user.username; // Replace the mention with the fetched username
      } catch (error) {
          console.error("Failed to fetch user:", error);
          message.channel.send("Failed to resolve mentioned user.");
          return;
      }
  }

  // Direct randomization check for +0 without adding another name
  if (plus === 0 && !extraName && names.length >= 5) {
      triggerRandoFunctionality(message);
      return; // Ensure to exit after triggering to avoid sending conflicting messages
  } else if (plus === 0 && !extraName) {
      message.channel.send("Not enough participants for randomization. Need at least 5.");
      return;
  }

  // Logic for adding others or oneself to the session
  if (extraName && extraName.toLowerCase() !== author.toLowerCase()) {
      const isNameAdded = names.some(user => user.name.toLowerCase() === extraName.toLowerCase());
      if (!isNameAdded) {
          names.push({ name: extraName, id: `extra-${Date.now()}` }); // Use a pseudo ID for extra names
          message.react('👍').catch(console.error);
      } else {
          message.channel.send(`${extraName} is already in the session.`);
      }
  } else if (!extraName || extraName.toLowerCase() === author.toLowerCase()) {
      // Adding oneself to the session, ensuring they are not added twice
      const isUserAdded = names.some(user => user.id === uid);
      if (!isUserAdded) {
          names.push({ name: author, id: uid });
          message.react('👍').catch(console.error);
      } else {
          message.channel.send("You can't +in twice!");
      }
  }

  // Re-check for randomization after adding another name with +0
  if (plus === 0 && names.length >= 5) {
      triggerRandoFunctionality(message);
      return;
  }

  // Handle resetting the session with +5
  if (plus === 5) {
      currentPlus = 5;
      names = []; // Clear all names
      message.channel.send("Session is now open (+5). All previous plusses are cleared.");
  }

  // Update currentPlus based on command
  currentPlus = plus;
};

async function triggerRandoFunctionality(message) {
  // Assumes createRandoMessage and rando functions are implemented elsewhere
  const namesForRando = names.map(user => user.name);
  const messageContent = createRandoMessage(rando(namesForRando));
  message.channel.send(messageContent);
  names = []; // Reset after triggering
  currentPlus = 5; // Reset to initial value or according to your logic
  
}


const handleRandoCommand = (message, processedArgs) => {
  const namesFromArgs = processedArgs.map(arg => {
    if (arg.match(/^<@!?([0-9]+)>$/)) {
      const userId = arg.match(/^<@!?([0-9]+)>$/)[1];
      const user = message.guild.members.cache.get(userId);
      return user && user.user ? user.user.globalName : ''; // Use globalName without '@'
    } else {
      // Directly return numeric arguments or other text without changes
      return arg.replace(/^@/, ''); // This ensures leading '@' are removed from non-mention arguments
    }
  }).filter(arg => arg !== ''); // Filter out empty or unresolved names

  const randoArray = rando(namesFromArgs);
  const messageContent = createRandoMessage(randoArray);
  message.channel.send(messageContent);
};
const handleResetCommand = (message) => {
  console.log("im hereeeeeeee");
  // Check if the user is already in the list
  const author = message.author.globalName;
  const uid = message.author.id;
  const isAlreadyAdded = names.some(user => user.id === uid);
  if (message.content === "+5") {
    currentPlus = 5;
    names = [];
    message.react('👍').catch(console.error); // React with a thumbs up emoji
    message.channel.send("Current plus is +5");
    return;
  }
  if (!isAlreadyAdded) {
    // If not already added, add the user to the list
    names.push({ name: author, id: uid });
    console.log(`${author} added to the list.`);
    message.react('👍').catch(console.error); // React with a thumbs up emoji
  } else {
    // If already added, inform the user
    message.channel.send("You can't +in twice!");
  }

  // Reset the + status to +5
  currentPlus = 5;
  message.channel.send(`+ status reset to +${currentPlus}.`);
};


const handleOutCommand = (message) => {
  const args = message.content.split(' ').slice(1); // Assumes command is "+out [name]"
  const nameToRemove = args.join(' ').trim(); // Potential name to remove
  const requesterUid = message.author.id;

  // Check if the requester has the 'Tech Support' role
  const requesterIsTechSupport = message.member.roles.cache.some(role => role.name === 'Tech Support');
  
  let userToRemove;

  // If a name is provided, and the requester is Tech Support, try to find the user
  if (nameToRemove && requesterIsTechSupport) {
    userToRemove = names.find(user => user.name.toLowerCase() === nameToRemove.toLowerCase());
    if (!userToRemove) {
      // If no user is found
      message.channel.send(`${nameToRemove} is not part of the current + session.`);
      return;
    }
  } else if (!nameToRemove) {
    // If no name is provided, assume self-removal
    userToRemove = names.find(user => user.id === requesterUid);
  }

  if (userToRemove) {
    // Remove the user from the list
    names = names.filter(user => user.id !== userToRemove.id);
    message.react('👍').catch(console.error); // Acknowledge the action
    
    if (userToRemove.id === requesterUid) {
      console.log("im here");
      currentPlus = currentPlus + 1;
      // If someone removes themselves, simply report the current status
      message.channel.send(`You have plussed out. Current status is now +${currentPlus}.`);
    } else if (requesterIsTechSupport && userToRemove.id !== requesterUid) {
      // If a Tech Support member removes someone else, increment currentPlus and show who removed whom
      if (currentPlus < 5) { currentPlus += 1; } // Assuming 5 is the maximum value
      message.channel.send(`${userToRemove.name} has been plussed out by ${message.author.globalName}. Current status is now +${currentPlus}.`);
    }
  } else {
    // If the user is not found in the list for some reason
    message.channel.send("Specified user is not part of the current + session or you don't have permission to remove others.");
  }
};


module.exports = {
  handleNewCommand,
  handleStatusCommand,
  handleUpdateCommand,
  handleRandoCommand,
  handleOutCommand,
  handleResetCommand
};
