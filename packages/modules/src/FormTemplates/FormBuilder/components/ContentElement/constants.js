// @flow

export type Option = {
  id: ?string,
  label: string,
};

export const options: Array<Option> = [
  {
    id: 'html',
    label: 'HTML',
  },
  {
    id: null,
    label: 'Plain',
  },
];
