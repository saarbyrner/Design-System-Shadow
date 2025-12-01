// @flow
const getUsersById = (users: Array<{ id: number, name: string }> = []) => {
  return (
    users.length > 0 &&
    users.reduce((hash, user) => {
      // we assume all users are presented only once
      hash[user.id] = user.name; // eslint-disable-line no-param-reassign
      return hash;
    }, {})
  );
};

export default getUsersById;
