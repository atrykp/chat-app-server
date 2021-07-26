const addUser = (userId, socketId, usersArray) =>
  !usersArray.some((user) => user.userId === userId)
    ? [...usersArray, { userId, socketId }]
    : usersArray;
const removeUser = (socketId, usersArray) =>
  usersArray.filter((element) => element.socketId !== socketId);

module.exports.addUser = addUser;
module.exports.removeUser = removeUser;
