// @flow
export const getFromLocalStorage = (key: string): any => {
  if (!localStorage) return undefined;

  let data;
  try {
    data = localStorage.getItem(key);
  } catch {
    return undefined;
  }
  if (!data) return undefined;

  let parsedData;
  try {
    parsedData = JSON.parse(data);
  } catch {
    return data;
  }
  return parsedData;
};

export const setInLocalStorage = (key: string, value: any) => {
  if (!localStorage) return;

  let stringifiedData;
  try {
    stringifiedData = JSON.stringify(value);
  } catch (e) {
    console.error(e);
    return;
  }

  try {
    localStorage.setItem(key, stringifiedData);
  } catch (e) {
    console.error(e);
  }
};
