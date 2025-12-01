/*
 * Checks each word independently that is over one character
 * i.e if user searches for 4 way ankle this will return all results that contain 'way' and 'ankle' i.e '3 wayward stankle drops'
 */
// @flow
const checkEachWordSeparately = (
  favoriteExerciseName: string,
  requestSearchTerm: string
) => {
  const splitSearchTerm = requestSearchTerm.split(' ');
  const foundFav = splitSearchTerm.every(
    (searchTermWord) =>
      searchTermWord.length <= 1 ||
      favoriteExerciseName.includes(searchTermWord)
  );
  return !!foundFav;
};

const filterFavourites = (
  requestSearchTerm: string,
  favourite: string,
  searchMode: string
) => {
  if (requestSearchTerm != null && requestSearchTerm !== '') {
    const lowerCased = favourite.toLowerCase();
    return searchMode === 'starts_with'
      ? lowerCased.startsWith(requestSearchTerm.toLowerCase())
      : checkEachWordSeparately(lowerCased, requestSearchTerm.toLowerCase());
  }
  return favourite;
};

export default filterFavourites;
