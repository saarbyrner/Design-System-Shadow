// @flow
export const buildMenuItem = (title: string, index: number): Object => {
  return {
    key: title,
    index,
    title,
    element_type: 'Forms::Elements::Layouts::MenuItem',
    fields: [],
  };
};

export const buildMenuGroup = (
  title: string,
  index: number,
  itemCount: number
): Object => {
  return {
    key: title,
    index,
    title,
    element_type: 'Forms::Elements::Layouts::MenuGroup',
    items: Array(itemCount)
      .fill()
      .map((item, idx) => buildMenuItem(`${title} MenuItem ${idx}`, idx)),
    fields: [],
  };
};
