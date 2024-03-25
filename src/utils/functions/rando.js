const rando = (data) => {
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const isValidTeam = (newTeam, teams) => {
    for (let i = 0; i < teams.length; i++) {
      for (let j = 0; j < newTeam.length; j++) {
        if (newTeam[j] === teams[i][j]) {
          return false; // The same name is in the same position in another team
        }
      }
    }
    return true;
  };

  const names = data.map((user) => {
    return user.name || user;
  });

  let teams = [];

  // Generate the first team (could be shuffled for randomness)
  teams.push(shuffleArray([...names]));

  // Generate the rest of the teams
  while (teams.length < 5) {
    let attempt = shuffleArray([...names]);
    if (isValidTeam(attempt, teams)) {
      teams.push(attempt);
    }
  }

  return teams;
};

module.exports = { rando };
