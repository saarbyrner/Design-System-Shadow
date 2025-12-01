// @flow

import { withNamespaces } from 'react-i18next';
import { useDispatch } from 'react-redux';

import {
  Menu,
  MenuItem,
  ListItemText,
  Checkbox,
} from '@kitman/playbook/components';
import { updateQuestionElement } from '@kitman/modules/src/FormTemplates/FormBuilder/utils/helpers';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';

import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  questionElement: HumanInputFormElement,
  questionIndex: number,
  anchorEl: Object,
  isChildOfGroup: ?boolean,
  groupIndex: ?number,
  onCloseMenu: () => void,
};

const QuestionMenuActions = ({
  questionElement,
  questionIndex,
  anchorEl,
  onCloseMenu,
  isChildOfGroup,
  groupIndex,
  t,
}: I18nProps<Props>) => {
  const dispatch = useDispatch();
  const { config }: HumanInputFormElement = questionElement;
  const { items, variable } = config;

  const menuOptions = [
    {
      label: t('Weighted scores'),
      value: 'weighted_scores',
      onClickOption: (isChecked: boolean) => {
        updateQuestionElement(
          {
            questionIndex,
            field: 'config',
            value: {
              ...config,
              items: isChecked
                ? items?.map(({ score, ...restAttrs }) => {
                    return restAttrs;
                  })
                : items?.map((item) => {
                    return { ...item, score: 1 };
                  }),
            },
          },
          dispatch,
          isChildOfGroup,
          groupIndex
        );
      },
    },
    {
      label: t('Assign colours'),
      value: 'colors',
      onClickOption: (isChecked: boolean) => {
        updateQuestionElement(
          {
            questionIndex,
            field: 'config',
            value: {
              ...config,
              items: isChecked
                ? items?.map(({ color, ...restAttrs }) => {
                    return restAttrs;
                  })
                : items?.map((item) => {
                    return { ...item, color: '#abc123' };
                  }),
            },
          },
          dispatch,
          isChildOfGroup,
          groupIndex
        );
      },
    },
  ];

  const isOptionChecked = (value: string) => {
    switch (value) {
      case 'weighted_scores':
        return items?.every((itemOption) => !!itemOption.score) || false;
      case 'colors':
        return items?.every((itemOption) => !!itemOption.color) || false;
      default:
        return false;
    }
  };

  return (
    <Menu
      id="basic-question-menu-actions"
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onCloseMenu}
      slotProps={{ paper: { sx: { minWidth: '16.25rem' } } }}
      MenuListProps={{
        'aria-labelledby': 'question-menu-actions-button',
      }}
    >
      {menuOptions.map(({ value, label, onClickOption }) => {
        const isChecked = isOptionChecked(value);

        return (
          <MenuItem
            disabled={!!variable}
            onClick={() => onClickOption(isChecked)}
            key={value}
          >
            <Checkbox disabled={!!variable} checked={isChecked} />
            <ListItemText>{label}</ListItemText>
          </MenuItem>
        );
      })}
    </Menu>
  );
};

export const QuestionMenuActionsTranslated =
  withNamespaces()(QuestionMenuActions);
export default QuestionMenuActions;
