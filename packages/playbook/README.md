# Playbook

[Playbook](https://sites.google.com/kitmanlabs.com/playbook/home) is the Kitman
Labs design system which is built on top of [MUI](https://mui.com/).

This package contains the the code that Kitman layers on top of Material UI to
build playbook. Based off the designs in the
[Playbook Master](https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=39%3A85905&mode=design&t=75GNXmc2kJ73q18i-1)
figma file.

🚧 _Note: These docs are a WIP as Playbook is being rolled out accross the
product see see the project resources below_ 🚧

## Usage

As a starting point, the Material UI components are themed using a global theme
we define in this package which is outlined by the design team.

Playbook is built using the following `@mui` packages

- `@mui/base`
- `@mui/icons-material`
- `@mui/lab`
- `@mui/material`
- `@mui/x-data-grid-pro`
- `@mui/x-date-pickers-pro`

API documentation for all components are found
[here](https://mui.com/material-ui/getting-started/)

It is not recommended to import material components directly from MUI. This
gives playbook the flexibility to add wrapper components to suit Kitman labs
needs, or to create universal components whos styles have been
[overrided](https://mui.com/material-ui/customization/how-to-customize/#2-reusable-component).
See [contribution guidelines](#contribution)

Example, MUI docs would suggest:

```ts
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { DataGrid } from '@mui/x-data-grid';
```

But it is reccomended to import via playbook so consistent usage is maintained

```ts
import {
  Stack,
  Button,
  DataGrid
} from `@kitman/playbook/components`
```

### Themes

TODO - when the default theme is built, outline how it works here

### Components

`@kitman/playbook/components` houses all the components for:

- `@mui/material`
- `@mui/x-data-grid-pro`
- `@mui/x-date-pickers-pro`

### Hooks

This houses utility hooks exported from `@mui/material`.

### Icons

`@kitman/playbook/icons` is a wrapper for material icons. Usage guidlines are
outlined by material ui [here](https://mui.com/material-ui/icons/). All icons
[here](https://mui.com/material-ui/material-icons/) are available through
playbook icons.

Imports can be done via:

```ts
import { AccessAlarm, ThreeDRotation } from '@kitman/playbook/icons';
```

## Contribution

The Playbook package is managed by a governance team that spans front-end
engineering and design.

### Documentation

Playbook uses storybook to document components. Storybook can be run locally or
visited on our hosted chromatic instance. See [Documentation](stories/README.md)

## Resources

- [Jira board](https://kitmanlabs.atlassian.net/jira/software/projects/MUR/boards/47)
- [Slack Channel - #material-ui-eng](https://app.slack.com/client/TU0TUAY6N/C05M4H5JXPF)
- [Playbook Master Figma](https://www.figma.com/file/VgFMXAuaLKSWTvEbjXHhnc/The-Playbook-Master?type=design&node-id=39%3A85905&mode=design&t=75GNXmc2kJ73q18i-1)
