// @flow
import { useState } from 'react';

import { TextButton } from '@kitman/components';
import TooltipMenu from '.';

const CONTROL_LABELS = {
  numLevels: 'Number of levels',
  subMenuAlignment: 'Submenu Alignment',
  canSelect: 'Is Selectable',
};

export default {
  title: 'TooltipMenu',
  component: TooltipMenu,

  argTypes: {
    kitmanDesignSystem: { control: { type: 'boolean' } },
    placement: {
      control: {
        type: 'select',
        options: [
          'bottom-start',
          'bottom-end',
          'bottom',
          'top-start',
          'top-end',
          'top',
          'right-end',
        ],
      },
    },
    offsetX: { control: { type: 'number' } },
    offsetY: { control: { type: 'number' } },

    icons: {
      control: {
        type: 'check',
        options: ['None', 'Main Menu', 'First Submenu', 'Second Submenu'],
      },
    },
    [CONTROL_LABELS.numLevels]: {
      control: {
        type: 'radio',
        options: ['One', 'Two', 'Three'],
      },
    },
    [CONTROL_LABELS.subMenuAlignment]: {
      control: {
        type: 'select',
        options: ['left', 'right'],
      },
    },
    [CONTROL_LABELS.canSelect]: {
      control: {
        type: 'boolean',
      },
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/7VG51RENiXwPZrSMvQGmkL/MUI-for-Figma-Material-UI-v5.16.0?node-id=11838-7926&m=dev',
    },
  },
};

export const Basic = (inputArgs: any) => {
  const hasIcon = (key) => inputArgs.icons.includes(key);
  const [selectedItem, setSelectedItem] = useState();

  const getSelectedConfig = (path, blockSelect = false) => {
    const canSelect = !blockSelect && inputArgs[CONTROL_LABELS.canSelect];
    const isSelected = canSelect && selectedItem === path;

    return {
      isSelected: canSelect && selectedItem === path,
      onClick: () => {
        if (isSelected) {
          setSelectedItem('');
        } else if (canSelect) {
          setSelectedItem(path);
        }
      },
    };
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <TooltipMenu
        menuItems={[
          {
            icon: hasIcon('Main Menu') ? 'icon-bar-graph' : null,
            description: 'Item 1',
            ...getSelectedConfig('[0]'),
          },
          {
            icon: hasIcon('Main Menu') ? 'icon-nav-activity' : null,
            description: 'Item 2',
            ...getSelectedConfig('[1]'),
          },
          {
            icon: hasIcon('Main Menu') ? 'icon-table' : null,
            description: 'Item 3',
            ...getSelectedConfig(
              '[2]',
              inputArgs[CONTROL_LABELS.numLevels] === 'Two' ||
                inputArgs[CONTROL_LABELS.numLevels] === 'Three'
            ),
            subMenuAlignment: inputArgs[CONTROL_LABELS.subMenuAlignment],
            subMenuItems:
              inputArgs[CONTROL_LABELS.numLevels] === 'Two' ||
              inputArgs[CONTROL_LABELS.numLevels] === 'Three'
                ? [
                    {
                      icon: hasIcon('First Submenu') ? 'icon-athletes' : null,
                      description: 'First Submenu Item',
                      ...getSelectedConfig('[2][0]'),
                    },
                    {
                      icon: hasIcon('First Submenu') ? 'icon-dashboard' : null,
                      description: 'First Submenu Item 2',
                      ...getSelectedConfig('[2][1]'),
                    },
                    {
                      icon: hasIcon('First Submenu') ? 'icon-mail' : null,
                      description: 'First Submenu Item 3',
                      ...getSelectedConfig(
                        '[2][2]',
                        inputArgs[CONTROL_LABELS.numLevels] === 'Three'
                      ),
                      subMenuAlignment:
                        inputArgs[CONTROL_LABELS.subMenuAlignment],
                      subMenuItems:
                        inputArgs[CONTROL_LABELS.numLevels] === 'Three'
                          ? [
                              {
                                icon: hasIcon('Second Submenu')
                                  ? 'icon-expand'
                                  : null,
                                ...getSelectedConfig('[2][2][0]'),
                                description: 'Second Submenu Item',
                              },
                              {
                                icon: hasIcon('Second Submenu')
                                  ? 'icon-edit-name'
                                  : null,
                                ...getSelectedConfig('[2][2][1]'),
                                description: 'Second Submenu Item 2',
                              },
                              {
                                icon: hasIcon('Second Submenu')
                                  ? 'icon-calendar'
                                  : null,
                                ...getSelectedConfig('[2][2][2]'),
                                description: 'Second Submenu Item 3',
                              },
                            ]
                          : [],
                    },
                  ]
                : [],
          },
        ]}
        tooltipTriggerElement={
          <TextButton
            text="Click to show TooltipMenu"
            type="primary"
            kitmanDesignSystem={inputArgs.kitmanDesignSystem}
          />
        }
        offset={[inputArgs.offsetX, inputArgs.offsetY]}
        {...inputArgs}
      />
    </div>
  );
};
Basic.args = {
  kitmanDesignSystem: true,
  placement: 'bottom-start',
  offsetX: 0,
  offsetY: 8,
  icons: ['None'],
  [CONTROL_LABELS.numLevels]: 'One',
  [CONTROL_LABELS.subMenuAlignment]: 'right',
  [CONTROL_LABELS.canSelect]: false,
};
