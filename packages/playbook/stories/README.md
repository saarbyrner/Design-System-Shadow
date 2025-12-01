# Playbook Storybook

This folder holds all the core code and config for Playbooks stories.

## Structure

Stories are stored in this directory as components are gemerally themed
implementations of MUI components, and dont have their own directory.

The directory structure in /stories should mimic the `/playbook` directory
structure. But should also organise stories based on their grouping in the MUI
documentation.

## Adding a Story

Stories are added using the Storybook component format. See more
[here](https://storybook.js.org/docs/react/writing-stories). Add a story using
the following template

```ts
import { COMPONENT_FOR_STORY } from '@kitman/playbook/components';
import { getPage, getDesign } from '../../utils';

const docs = {
  muiLink: 'https://mui.com/material-ui/<LINK TO MUI DOCS>',
  figmaLink: '<LINK TO PLAYBOOK MASTER>',
};

// More on how to set up stories at:
// https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: '{MUI GROUP}/{COMPONENT_NAME}',
  component: COMPONENT_FOR_STORY,
  // Optional render component which gets the args selections and renders whats
  // needed
  render: ({ ...args }) => <COMPONENT_FOR_STORY {...args} />,
  parameters: {
    layout: 'centered',
    docs: {
      page: getPage(docs), // This returns a template for the Docs Page
    },
    design: getDesign(docs), // this returns the design
  },
  tags: ['autodocs'],

  argTypes: {
    // Define arg types based on component props
    // https://storybook.js.org/docs/react/writing-stories/args
  },
};

// More on writing stories with
// args: https://storybook.js.org/docs/react/writing-stories/args
// This is the primary story which will be rendered at the top of the docs,
// and can be changed by all the controls supplied
export const Story = {
  args: {
    // default args
  },
};

// ---
// can optionally add other stories and examples
export const WithSomeOtherArgs = {
  args: {
    // another set of args
  },
};

// Or can add more examples that just render jsx
export const WithRender = () => <div>JSX</div>;
```

## Publishing to chromatic

We publish manually to chromatic for the time being. The plan is to do this
integrated in the CI long term. At the moment its done by

```zsh
npx chromatic --project-token={GET_TOKEN_IN_CHROMATIC}
```
