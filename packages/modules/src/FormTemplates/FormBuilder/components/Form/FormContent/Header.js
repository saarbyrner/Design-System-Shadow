// @flow

import { useDispatch } from 'react-redux';

import { colors } from '@kitman/common/src/variables';
import { Box } from '@kitman/playbook/components';
import { EditableInput } from '@kitman/components';
import {
  setCurrentMenuItemTitle,
  setCurrentMenuGroupTitle,
} from '@kitman/modules/src/FormTemplates/redux/slices/formBuilderSlice';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import FORM_CONTENT_HEADER_MAX_LENGTH from '@kitman/modules/src/FormTemplates/FormBuilder/utils/consts';
import { levelEnumLike } from '../Menu/utils/enum-likes';
import { createRenderContent } from './utils/helpers';
import { editableInputStyles } from './utils/styles';
import {
  generateDefaultMenuGroupTitleByIndex,
  generateDefaultMenuItemTitleByIndex,
} from '../utils/helpers';

type Props = {
  currentMenuGroup: HumanInputFormElement,
  currentMenuItem: HumanInputFormElement,
  currentMenuGroupIndex: number,
  currentMenuItemIndex: number,
};

const Header = ({
  currentMenuGroup,
  currentMenuItem,
  currentMenuGroupIndex,
  currentMenuItemIndex,
}: Props) => {
  const dispatch = useDispatch();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: '1rem',
        borderBottom: `2px solid ${colors.neutral_300}`,
        paddingBottom: '1.25rem',
      }}
    >
      <EditableInput
        value={
          currentMenuGroup.config.title ??
          generateDefaultMenuGroupTitleByIndex(currentMenuGroupIndex)
        }
        renderContent={createRenderContent(levelEnumLike.menuGroup)}
        styles={editableInputStyles}
        onSubmit={(newName: string) =>
          dispatch(setCurrentMenuGroupTitle(newName))
        }
        allowSavingEmpty={false}
        maxLength={FORM_CONTENT_HEADER_MAX_LENGTH}
        withMaxLengthCounter
      />
      <EditableInput
        value={
          currentMenuItem?.config.title ??
          generateDefaultMenuItemTitleByIndex({
            menuGroupIndex: currentMenuGroupIndex,
            menuItemIndex: currentMenuItemIndex,
          })
        }
        renderContent={createRenderContent(levelEnumLike.menuItem)}
        styles={editableInputStyles}
        onSubmit={(newName: string) =>
          dispatch(setCurrentMenuItemTitle(newName))
        }
        allowSavingEmpty={false}
        maxLength={FORM_CONTENT_HEADER_MAX_LENGTH}
        withMaxLengthCounter
      />
    </Box>
  );
};

export default Header;
