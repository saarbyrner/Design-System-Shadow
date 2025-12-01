// @flow

export type Athlete = {|
  key: string,
  id: number,
  name: string,
  position?: string,
  squadId?: string,
  squadName?: string,
  status?: string,
  avatarUrl?: string,
  tags?: string[],
|};

export type Group = {|
  key: string,
  title: string,
  subtitle?: string,
  athletes?: Athlete[],
  children: Group[],
|};

export type DataGrouping = {
  options: Array<{ label: string, value: string }>,
  current: string,
  setCurrent: (value: string) => void,
};

export type UseDataResult = {
  isLoading: boolean,
  groups: Group[],
  athletes: Athlete[],
  error: string | null,
  grouping?: DataGrouping,
};

export type AthleteSelectorVariant = 'dropdown';

export type TriggerProps = {
  isOpen: boolean,
  isLoading: boolean,
  onOpen: () => void,
  onClose: () => void,
  athletes: Athlete[],
  selectedIds: Set<number>,
  setSelectedIds: (ids: Set<number>) => void,
};

export type AthleteSelectorRootProps = {|
  initialIds?: Array<number>,
  variant: AthleteSelectorVariant,
  onDone?: (ids: number[]) => void,
  useData: () => UseDataResult,
  Trigger?: (props: TriggerProps) => React$Element<any>,
|};
