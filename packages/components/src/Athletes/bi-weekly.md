---
marp: true
---

---

This doc is a list of notes from presenting this in the FE bi-weekly on 30th Mar
2022

---

# `<AthleteSelect />`

---

# Context

- Needed a Squad based Athlete Selector for the table builder
- Design system based, with room to expand
- Previously explored by Hugo for Medical section
- Scoped in [#17231](https://github.com/KitmanLabs/projects/issues/17231)
- Designs
  [here](https://www.figma.com/design/7VG51RENiXwPZrSMvQGmkL/MUI-for-Figma-Material-UI-v5.16.0?node-id=11838-7926&m=dev)

---

# Planning/Analysis

One of two options:

- Using `<Select />` & Modifying to suit our needs

OR

- Build the whole thing from scratch from scratch

---

## Using `<Select />`

## Pros

- Has the existing components & logic

## Cons

- The component is overflowing with functionality as is. It handles too much
  already
- Could be a nightmare to maintain

---

# Build from scratch

## Pros

- Can build it to support composability
- Full control of implementations

## Cons

- ANOTHER implementation of a dropdown
- Devil is in the detail:
  - building all the little components/overlays. e.g. React select handles fixed
    positioning, and is smart exnough to know when its near the edge of a page
    etc..

---

# Solution

Went somewhere in the middle

- Split up React Select into its own bits: `Components` &
  `ReactSelectOverrides`.
- Used that to render the dropdown etc..
- Then went reasonably greenfield for the rest.

---

# Demo

---

# Usage

Straightforward AthleteSelect component

```ts
export const Basic = () => {
  const [value, setValue] = useState([]);

  return (
    <AthleteSelect
      squadAthletes={squadAthletes}
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
      }}
    />
  );
};
```

---

# Props: `squadAthletes`:

Object used in the response from
[`/ui/squad_athletes`](http://admin.injuryprofiler.test:8081/ui/squad_athletes)

```json
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
```

---

# Props: `value`

array of objects the shape of existing `SquadAthletesSelection` type:

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

\*\* new `context_squads` attribute, which passes the id of the squad which the
user selected under

---

# Props: `onChange`

Callback that passes the new value after a user selection:

```ts
      onChange={newValue => {
        setValue(newValue);
      }}
```

---

# Other Usage: Outside of Select

Using the `AthleteContextProvider` & the `AthletesBySquadSelector` we can drop
this into any component

```ts
export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState([]);

  return (
    <AthleteContextProvider
      squadAthletes={squadAthletes}
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
      }}
    >
      <AthletesBySquadSelector searchValue="" />
    </AthleteContextProvider>
  );
};
```

---

# Todos

- Naming?
- Integration tests
- Multi-select
- Docs & Stories
- Using this in the wild
