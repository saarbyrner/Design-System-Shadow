// @flow

export type ViewType = 'PRESENTATION' | 'EDIT';

type OnsetOption = {
  id: number,
  name: string,
  require_additional_input: boolean,
};
export type OnsetOptions = Array<OnsetOption>;
