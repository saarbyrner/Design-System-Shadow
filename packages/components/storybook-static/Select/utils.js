// @flow
/**
 * Maps an array of objects with properties containing id & name
 * to properties with value and name which is consumed by <Select />
 * maps:
 *  - id -> value
 *  - name -> label
 *
 * @param {Array<Object>} data data which you want to map
 * @returns
 */
export const defaultMapToOptions = (data: Object) => {
  return data.map((option) => ({
    label: option.name,
    value: option.id,
    ...option,
  }));
};

export const checkRenderRightSideVisibility = (
  menuRef: Object,
  width: number
) => {
  const EDGE_PADDING = 300;
  const position = menuRef.current.getBoundingClientRect();
  const fromRight = width - position.right;

  // TODO: extract the magic number 768 into a constant.
  return width > 768 ? fromRight >= EDGE_PADDING : true;
};

export const getXBoundary = (menuRef: Object, width: number) => {
  return checkRenderRightSideVisibility(menuRef, width)
    ? menuRef.current.getBoundingClientRect().x +
        // $FlowFixMe offsetWidth is a valid property
        menuRef.current.offsetWidth
    : menuRef.current.getBoundingClientRect().x - 100;
};

export const searchLabel = (label: string, searchValue: string) => {
  return label?.toLowerCase().includes(searchValue?.toLowerCase());
};

export const searchList = (list: any, searchValue: string) => {
  return list?.filter((item) => searchLabel(item.label, searchValue));
};
