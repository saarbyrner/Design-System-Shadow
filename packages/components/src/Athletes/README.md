# Athletes

This houses the cross squad selector as specced in
[#projects#17231](https://github.com/KitmanLabs/projects/issues/17231). Its
primary use case is to be used within a dropdown, but the internal components
can be used in isolation for other parts of the products (i.e. in a sidebar)

## Core props

### `squadAthletes`

This is the data source for your athlete selector. At present this component
does no data fetching. An array of squads which lists their `position_groups`,
`positions` & `athletes` in a tree structure. Matches the object used in the
response from
[`/ui/squad_athletes`](http://admin.injuryprofiler.test:8081/ui/squad_athletes)
(Links to LDE admin endpoint)

```json
[
  {
    "id": 8,
    "name": "International Squad",
    "position_groups": [
      {
        "id": 25,
        "name": "Forward",
        "order": 1,
        "positions": [
          {
            "id": 72,
            "name": "Loose-head Prop",
            "order": 1,
            "athletes": [
              {
                "id": 33196,
                "firstname": "Test",
                "lastname": "Welcome Process",
                "fullname": "Test Welcome Process",
                "shortname": "T Welcome Process",
                "user_id": 37463
              }
            ]
          }
        ]
      }
    ]
  }
]
```

### `value`

This is an array of objects, and matches a common selection structure in the
system for population selections.

```typescript
export type SquadAthletesSelection = {
  applies_to_squad: boolean;
  all_squads: boolean;
  position_groups: Array<ID>;
  positions: Array<ID>;
  athletes: Array<ID>;
  squads: Array<ID>;
  context_squads: Array<ID>;
};
```

An example value, with position id of 4 selected and athlete 2 selected

```json
[
  {
    "applies_to_squad": false,
    "all_squads": false,
    "position_groups": [],
    "positions": [4],
    "athletes": [2],
    "squads": [],
    "context_squads": []
  }
]
```

The component's value is stateless, and does not maintain an internal `value`
selection. Meaning that you have to store this value in a parent.

### `onChange`

A callback which passes the new value after user selection. Depending on the
value of the `isMulti` prop, this will give a new value with what the user has
clicked or append to the existing `value`. (See below for `isMulti`)

```ts
      onChange={newValue => {
        setValue(newValue);
      }}
```

## Use Cases

### Basic usage

The most common use case for this component will be a single select, dropdown.

```ts
export const Basic = () => {
  // Managing the state in the parent
  const [value, setValue] = useState([]);

  return (
    <AthleteSelect
      squadAthletes={squadAthletes} // where squadAthletes was fetched from server
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
      }}
    />
  );
};
```

Multi-select is available through the `isMulti` Prop

```ts
export const Basic = () => {
  // Managing the state in the parent
  const [value, setValue] = useState([]);

  return (
    <AthleteSelect
      squadAthletes={squadAthletes} // where squadAthletes was fetched from server
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
      }}
      isMulti
    />
  );
};
```

All groups selection using Select and clear all is available through the
`enableAllGroupSelection` Prop.

NOTE: This is limited to athletes selection only unless passed, but using this
prop will return all selection ids.

This will also work fine with `hiddenTypes` props, e.g. will not return
`position_groups` if included `hiddenTypes`.

```ts
export const Basic = () => {
  // Managing the state in the parent
  const [value, setValue] = useState([]);

  return (
    <AthleteSelect
      squadAthletes={squadAthletes} // where squadAthletes was fetched from server
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
      }}
      isMulti
      enableAllGroupSelection
    />
  );
};
```

You can use search input to retrieve all the group selections (athletes,
positions etc.)

NOTE: This is limited to position and position_groups selection only unless
passed, but using this prop will return all types.

This will also work fine with `hiddenTypes` props, e.g. will not return
`position_groups` if included `hiddenTypes`.

```ts
export const Basic = () => {
  // Managing the state in the parent
  const [value, setValue] = useState([]);

  return (
    <AthleteSelect
      searchAllLevels
      squadAthletes={squadAthletes} // where squadAthletes was fetched from server
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
      }}
    />
  );
};
```

### Default selected squad

You can force the dropdown to open on a selected squad by default by setting the
`defaultSelectedSquadId`. This way when the user opens the dropdown, it will
open by default on squad with the id of 8, provided its available in the list of
squadAthletes.

```ts
<AthleteSelect
  squadAthletes={squadAthletes} // where squadAthletes was fetched from server
  value={value}
  onChange={(newValue) => {
    setValue(newValue);
  }}
  defaultSelectedSquadId={8}
/>
```

### Single squad (Using only athletes)

When the `squadAthletes` only has a single item in the array. Then it will not
render the squad list, and assume that this squad is selected, rendering its
athletes only.

### Using outside of Select

The components used within the select dropdown context can be imported and used
anywhere provided it's wrapped in the `AthleteProvider`. The gotchas with this:

- The `searchValue`, & `selectedSquadId` are controlled props and need to be
  managed in a parent state
- It must be nested in a component with a defined height, either by fixed means
  or using flexbox

```ts
export const Sidebar = () => {
  const [value, setValue] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedSquadId, setSelectedSquadId] = useState(8);

  return (
    <>
      <input type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)}>
      <div style={{ height: 'calc(100% - 20px)' }}>
        <AthleteProvider
          squadAthletes={squadAthletes}
          value={value}
          onChange={newValue => {
            setValue(newValue);
          }}
        >
          <AthletesBySquadSelector
            searchValue={searchValue}
            selectedSquadId={selectedSquadId}
            onSquadClick={setSelectedSquadId}
          />
        </AthleteProvider>
      </div>
    </>
  );
};
```

### Context Squads

By default, when `isMulti` is active in the Athletes selector. Every selection
is global accross all squads. i.e. if a user navigates to "International Squad"
and selects athlete "John Doe", then if that athlete is present in other squads
he is selected there also.

Setting the `includeContextSquads` prop makes a selection unique to that squad.
This is represented through the `context_squads` attribute of the `value`.

**Example** If a user navigates to squad id 2 and selects athlete 3 & 5, then
the value looks like:

```json
[
  {
    "applies_to_squad": false,
    "all_squads": false,
    "position_groups": [],
    "positions": [],
    "athletes": [3, 5],
    "squads": [],
    "context_squads": [2]
  }
]
```

Then if he navigates to squad 3 and selects athlete 4 and 6. The value will look
like:

```json
[
  {
    "applies_to_squad": false,
    "all_squads": false,
    "position_groups": [],
    "positions": [],
    "athletes": [3, 5],
    "squads": [],
    "context_squads": [2]
  },
  {
    "applies_to_squad": false,
    "all_squads": false,
    "position_groups": [],
    "positions": [],
    "athletes": [4, 6],
    "squads": [],
    "context_squads": [3]
  }
]
```

### Fully controlled multi select

There is a series of callback props available if you do not wish to use the
default selection behaviour above. `isSelected`, `onOptionClick`,
`onSelectAllClick` & `onClearAllClick`. See the below api docs for more
information.

## Api Reference

### Common Types

```typescript
export type ID = string | number;

export type Athlete = {
  id: ID;
  fullname: string;
  firstname: string;
  lastname: string;
  user_id: ID;
  avatar_url?: string;
};

export type Position = {
  id: ID;
  name: string;
  athletes: Array<Athlete>;
};

export type PositionGroup = {
  id: ID;
  name: string;
  order: number;
  positions: Array<Position>;
};

export type SquadAthlete = {
  id: ID;
  name: string;
  position_groups: Array<PositionGroup>;
};

export type SquadAthletes = Array<SquadAthlete>;

export type Squad = {
  id: ID;
  name: string;
};

export type SquadAthletesSelection = {
  applies_to_squad: boolean;
  all_squads: boolean;
  position_groups: Array<ID>;
  positions: Array<ID>;
  athletes: Array<ID>;
  squads: Array<ID>;
  context_squads: Array<ID>;
};

export type OptionType =
  | 'athletes'
  | 'position_groups'
  | 'positions'
  | 'squads';

export type SelectorOption = {
  type: OptionType;
  id: ID;
  name: string;

  // Optional fields for when type === 'athlete'
  fullname?: string;
  firstname?: string;
  lastname?: string;
  position?: Position;
  positionGroup?: PositionGroup;
  avatar_url?: string;
};
```

### `<AthleteSelect />`

This component on its own will render the Athlete selector within a Select
dropdown

#### `value`: Array<SquadAthletesSelection>,

[See above](#core-props)

#### `squadAthletes`: SquadAthletes,

[See above](#core-props)

#### `onChange`: Function,

[See above](#core-props)

#### `isMulti`: `boolean`,

Boolean to toggle multi select on and off for the Athlete Select

#### `includeContextSquad`: `boolean`,

Boolean to toggle whether to include context squad in the value passed into the
onChange function. [See above](#context-squads).

#### `defaultSelectedSquadId?`: `number`

Optional prop which will open the select dropdown on a squad by default.

#### `isDisabled?`: `boolean`,

Disables the dropdown if true

#### `isLoading?`: `boolean`,

Toggles the loading state of the dropdown

#### `label?`: `string`,

Label rendered above the dropdown

#### `hiddenTypes?`: `Array<OptionType>`

Allows you to hide different option types in the multi select.

#### `placeholder?`: `string`,

Placeholder thats rendered when there is nothing selected

#### `renderItemLeft?`: `Function`,

Render function that is used to render markup to the left of an
athlete/position/position group label. Passes the following arg:

- `option` - `SelectorOption` - See [Common Types](#common-types) above

#### `isSelected?` : `Function`

Callback that is used to determine if an option is selected or not. Not required
and when not supplied, default selection logic is used based on the value you
supply. Passes the following args:

- `id` - `number | string` - the entity id
- `type` - `'athletes' | 'position_groups' | 'positions' | 'squads'` - the
  entity type
- `squadId` - `number | string` - the squadId that the option was clicked within

#### `onOptionClick?`: `Function`

Optional callback that is triggered when an option is clicked. When supplied it
will not modify the value or call `onChange`. Passes the following args:

- `id` - `number | string` - the entity id
- `type` - `'athletes' | 'position_groups' | 'positions' | 'squads'` - the
  entity type
- `squadId` - `number | string` - the squadId that the option was clicked within

#### `onSelectAllClick?`: `Function`,

Optional callback that is triggered when an the select all button is clicked.
When supplied it will not modify the value or call `onChange`. Passes the
following args:

- `options` - `Array<SelctorOption>` - An array of the options that were in
  context of the select all click. See [Common Types](#common-types) for shape
  of object
- `squadID` - `ID` - The squad that was in context for when the select all
  button was clicked

#### `onClearAllClick?`: `Function`,

Optional callback that is triggered when an option is clicked. When supplied it
will not modify the value or call `onChange`. Passes the following args:

- `options` - `Array<SelctorOption>` - An array of the options that were in
  context of the select all click. See [Common Types](#common-types) for shape
  of object
- `squadID` - `ID` - The squad that was in context for when the select all
  button was clicked

### `<AthleteProvider />`

The athlete provider needs to be added to the root of any usage outside of the
Select dropdown. For a little bit more info see
[above](#using-outside-of-select)

#### `value`: Array<SquadAthletesSelection>,

[See above](#core-props)

#### `squadAthletes`: SquadAthletes,

[See above](#core-props)

#### `onChange`: Function,

[See above](#core-props)

#### `isMulti`: `boolean`,

Boolean to toggle multi select on and off for the Athlete Select

#### `includeContextSquad`: `boolean`,

Boolean to toggle whether to include context squad in the value passed into the
onChange function. [See above](#context-squads).

#### `isSelected?` : `Function`

Callback that is used to determine if an option is selected or not. Not required
and when not supplied, default selection logic is used based on the value you
supply. Passes the following args:

- `id` - `number | string` - the entity id
- `type` - `'athletes' | 'position_groups' | 'positions' | 'squads'` - the
  entity type
- `squadId` - `number | string` - the squadId that the option was clicked within

#### `onOptionClick?`: `Function`

Optional callback that is triggered when an option is clicked. When supplied it
will not modify the value or call `onChange`. Passes the following args:

- `id` - `number | string` - the entity id
- `type` - `'athletes' | 'position_groups' | 'positions' | 'squads'` - the
  entity type
- `squadId` - `number | string` - the squadId that the option was clicked within

#### `onSelectAllClick?`: `Function`,

Optional callback that is triggered when an the select all button is clicked.
When supplied it will not modify the value or call `onChange`. Passes the
following args:

- `options` - `Array<SelctorOption>` - An array of the options that were in
  context of the select all click. See [Common Types](#common-types) for shape
  of object
- `squadID` - `ID` - The squad that was in context for when the select all
  button was clicked

#### `onClearAllClick?`: `Function`,

Optional callback that is triggered when an option is clicked. When supplied it
will not modify the value or call `onChange`. Passes the following args:

- `options` - `Array<SelctorOption>` - An array of the options that were in
  context of the select all click. See [Common Types](#common-types) for shape
  of object
- `squadID` - `ID` - The squad that was in context for when the select all
  button was clicked

### `<AthleteBySquadSelector />`

This is the UI for the squad list that transitions to an positions/athlete list
based on the `selectedSquadId` that you supply. The search input is not part of
this component and will need to be rendered separately

#### `searchValue`: `string`

Passing this search value will render a list of search results based on the
string you supply.

#### `selectedSquadId`: `?ID`

When this is null it will render the squad list in the dropdown, but supplying a
selected squad ID here will render the athletes list for that squad

#### `onSquadClick`: `Function`,

Callback triggered when a squad is clicked in the squad list. This will pass the
`squadId` of the clicked squad as the first arg.

#### `renderItemLeft?`: `Function`,

Render function that is used to render markup to the left of an
athlete/position/position group label. Passes the following arg:

- `option` - `SelectorOption` - See [Common Types](#common-types) above

#### `hiddenTypes?`: `Array<OptionType>`

Allows you to hide different option types in the multi select
