# Export Settings

This directory exports a set of reusable components designed to build out the
Export Settings form

## The product use case

Through out the application there is a growing need to configure
reports/printouts before they are downloaded by the user. There is a few
different workflows for this

1. A user clicks cmd + p and the printout is triggered
2. A user clicks a print button and a printout is triggered
3. A user clicks "Print Report" and a settings area is shown on screen, where a
   user can configure what is visible on the printout

This directory helps solve the third use case above by making the building of
the settings area consistent and re-usable.

## The technical workflow

We generally trigger Reports/Exports through out the app using the following
methods

1. PDF Reports within the system are generally rendered on screen as templates
   by the [`@kitman/printing`](packages/printing/README.md) package.

2. We can also generate CSV exports in the system through the
   `@kitman/common/src/hooks/useCSVExport` hook.

3. We can also trigger server exports through endpoint calls.

When specific data is needed for these reports, we can fetch it prior to render
or export.

This settings area should be able to configure user settings for each of these
use cases

## Usage

### `<ExportSettings />`

This is the wrapper for the settings component. This component manages the state
of the form internally, and you can get the updated values when `onSave` is
triggered

**Props**

- `isOpen` | `boolean`

  Determines visibility of component

- `onSave` | `function`

  Triggered when the user clicks Download or Save. This is where you would call
  window.print or fetch data for your report. It supplies 2 args

  - `formState` - an object of the values of each field that you define as
    children
  - `updateStatus(status, text, description)` - This function will open the
    settings toast with your specified text and description.

  See below [example](#example) for more info

- `onCancel` | `function`

  Triggered when the user wishes to dismiss the form without change

- `settingsKey` | `string` - _optional_

  This prop is needed when you have a form with cached fields. Its a unique
  string which the form can be identified by when storing selected values in
  localStorage

### `<ExportSettings.Field />`

A field component that sets and reads the value for the internal form state. It
requires a `defaultValue` and a `fieldKey` to be used. The `fieldKey` supplied
will be used as a reference of the value on the form state. This uses a render
props pattern where the `value` & `onChange` function is supplied in an object
of the first argument when rendering the children. See below example

**Props**

- `fieldKey` | `string`

  Key to be used to reference its corresponding value in the formState passed
  into the `onSave`

- `defaultValue` | `any`

  This is the default value of your field.

- `styles` | `SerializedStyles` - _optional_

  Overrides the default styles of the field

- `shouldResetValueOnClose` | `boolean` - _optional_

  When set to true. Closing the form will reset the value of the field back to
  its default value

- `isCached` | `boolean` - _optional_

  Caches the value in local storage so when a user comes back in a new session,
  their settings persist. Requires the `settingsKey` prop in the
  `<ExportSettings />` component.

### Example

```ts
<ExportSettings
  title="My report"
  onSave={(formState, updateStatus) => {
    console.log(formState);
    /**
     * {
     *    testKey: 'value'
     * }
     */

    // This will trigger a loading toast with the corresponding text and description
    updateStatus('LOADING', 'Loading', 'We are loading data');

    // This will trigger a success toast with the corresponding text and description
    updateStatus('SUCCESS', 'Success', 'We successfully loaded');

    // This will trigger an error toast
    updateStatus('ERROR', 'Error', 'There was an error');

    // This will close the toast
    updateStatus('DONE', '', '');
  }}
  onCancel={() => setIsOpen(false)}
  isOpen={isOpen}
>
  <ExportSettings.Field fieldKey="testKey" defaultValue="">
    {({ value, onChange }) => (
      <input
        data-testid="testInput"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    )}
  </ExportSettings.Field>
</ExportSettings>
```

## Common Fields

Common fields are fields that are built on the [Field](#exportsettingsfield)
component above to be used across multiple places to handle frequently used
cases. Note: each common field accepts the props of the
[Field](#exportsettingsfield) component, as well as additional fields supplied

### `<ExportSettings.CommonFields.Squads />`

This is Select field which uses the Squads data when rendered. You need to
supply a fieldKey and a defaultValue similar to a field but thats all. Usage:

**Additional Props**

- `label` | `string` - _optional_

  Can be used to override the default label of "Squads"

- `isMulti` | `boolean` - _optional_

  When true, the select field will be multi select. Defaults to single select

```ts
<ExportSettings title="My Settings" onSave={onSave} onCancel={() => {}} isOpen>
  <ExportSettings.CommonFields.Squads
    fieldKey="squad_id"
    defaultValue={[] || null}
    label="Custom Label"
    isMulti
  />
</ExportSettings>
```

### `<ExportSettings.CommonFields.CheckboxList />`

This is a CheckboxList field that will render a list of items you supply and
select their values. Example:

**Additional Props**

- `label` | `string`

  Label to be used for the field

- `items` | `CheckboxListItem[]`

  An array of CheckboxListItems which the user can then select from

- `singleSelection` | `boolean` - _optional_

  When true, the list will be single select. Defaults to multi select

```ts
<ExportSettings title="My Settings" onSave={onSave} onCancel={() => {}} isOpen>
  <ExportSettings.CommonFields.CheckboxList
    fieldKey="columns"
    label="Columns"
    items={[
      {
        value: 'injury_name',
        label: 'Injury name',
      },
      {
        value: 'injury_date',
        label: 'Date of injury',
      },
      {
        value: 'side',
        label: 'Body area or side',
      },
      {
        value: 'post_inury_days',
        label: 'Post injury days',
      },
    ]}
  />
</ExportSettings>
```
