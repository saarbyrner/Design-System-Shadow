# Input Components

Import from: `@saarbyrne/playbook`

## Button

Use `<Button>` for primary and secondary actions.

**When to use:**
- Primary actions (submit forms, confirm dialogs)
- Secondary actions (cancel, go back)
- Call-to-action buttons

**Default props:**
- `variant="contained"` for primary buttons
- `variant="outlined"` for secondary buttons
- `variant="text"` for tertiary/low-emphasis actions

**Example:**
```jsx
<Button variant="contained" color="primary">Submit</Button>
<Button variant="outlined">Cancel</Button>
```

## IconButton

Use `<IconButton>` for toolbar actions and compact interfaces.

**When to use:**
- Toolbar actions
- Icon-only interactions (delete, edit, close)
- Space-constrained layouts

**Example:**
```jsx
<IconButton><DeleteIcon /></IconButton>
```

## FloatingActionButton

Use `<Fab>` for primary floating actions.

**When to use:**
- Primary screen action that floats above content
- Adding new items
- Common actions on mobile

## TextField

Use `<TextField>` for single-line text input.

**When to use:**
- Form inputs (name, email, search)
- Single-line text entry
- Number inputs with validation

**Props:**
- `variant="outlined"` (default)
- `fullWidth` for form layouts
- `required` for required fields
- `type` for specific inputs (email, password, number)

**Example:**
```jsx
<TextField 
  label="Email" 
  type="email" 
  required 
  fullWidth 
/>
```

## Autocomplete

Use `<Autocomplete>` for searchable dropdowns and multi-select.

**When to use:**
- Large lists of options that need search
- Multi-select scenarios
- Async data loading

**Example:**
```jsx
<Autocomplete
  options={options}
  getOptionLabel={(option) => option.label}
  renderInput={(params) => <TextField {...params} label="Select option" />}
/>
```

## Select

Use `<Select>` for simple dropdown selections.

**When to use:**
- Small, fixed list of options (< 10 items)
- Single selection from predefined options
- Simpler than Autocomplete when search isn't needed

## Checkbox

Use `<Checkbox>` for boolean selections and multi-select lists.

**When to use:**
- Yes/No options
- Multiple selections from a list
- Toggle features on/off

## RadioGroup

Use `<RadioGroup>` with `<Radio>` for mutually exclusive options.

**When to use:**
- Single selection from 2-5 visible options
- When all options should be visible
- Mutually exclusive choices

## Switch

Use `<Switch>` for on/off toggles.

**When to use:**
- Enable/disable features
- Settings toggles
- Immediate effect toggles (don't require save)

## Slider

Use `<Slider>` for selecting a value from a range.

**When to use:**
- Volume, brightness controls
- Numeric ranges with visual feedback
- Filter ranges (price, date)

## Rating

Use `<Rating>` for star ratings and feedback.

**When to use:**
- Product ratings
- Review systems
- Quality feedback
