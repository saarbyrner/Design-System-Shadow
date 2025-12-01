// @flow
export type EventTypePermaId = 'game' | 'session' | 'custom';
export type EventTypeArray = Array<EventTypePermaId>;

export type NewLocation = {
  name: string,
  location_type: string,
  event_types: EventTypeArray,
  active: boolean,
  public: boolean,
};

export type Location = {
  id: string,
  name: string,
  location_type: string,
  event_types: EventTypeArray,
  active: boolean,
  modified?: boolean,
};

export type Locations = Array<Location>;

export type Filters = {
  searchValue: string,
  locationTypes: Array<string>,
  eventTypes: EventTypeArray,
};

export type OnFiltersChange = (
  key: string,
  value: string | Array<string>
) => void;

export type OnChangingArchiveStatus = (
  locationToSend: Location
) => Promise<void>;
