// @flow
export const searchListByKey = (
  searchText: string,
  list: Array<Object>,
  key: string
): Array<Object> => {
  return list.filter((option) => {
    if (searchText && searchText === '') {
      return true;
    }
    const value = option[key].toUpperCase();
    const filter = searchText?.toUpperCase() || '';

    return value.toUpperCase().indexOf(filter) > -1;
  });
};
