// @flow

export type CustomEventTypeSquads = Array<{ id: number, name: string }>;
type CustomEventTypeCommon = $Exact<{
  parent_custom_event_type_id: number | null,
  name: string,
  colour?: string,
  shared?: boolean,
  organisation_id: number,
  organisation: { id: number, handle: string, name: string },
  parent_association: null,
  is_archived: boolean,
  is_selectable: boolean,
  parents: Array<{
    id: number,
    name: string,
    parent_custom_event_type_id: number | null,
  }>,
}>;

export type CustomEventTypeResponse = $Exact<{
  id: number,
  squads: CustomEventTypeSquads,
  ...CustomEventTypeCommon,
}>;

export type CustomEventTypeIP = $Exact<{
  id: string,
  squads: Array<number>,
  ...CustomEventTypeCommon,
}>;

export type CustomEventTypeUpdate = {
  id: number,
  squads: Array<number>,
  ...CustomEventTypeCommon,
};

export type NewCustomEventType = {
  parent_custom_event_type_id: number | null,
  name: string,
  squads: Array<number>,
  is_selectable: boolean,
};
