// @flow
import { colors } from '@kitman/common/src/variables';

const removeNewEventButtonMeasurements = '2rem';
const rowColumnGap = '0.5rem';
const colorPickerWidth = '3.0625rem';
const nonNewRowElementWidth = `calc((100% - 2 * ${rowColumnGap}) / 2)`;

type GetRowStyles = {
  isNewRow?: boolean,
  isWithColorPicker?: boolean,
};

export const textCellStyles = {
  width: 'calc((100% - 6rem) / 2)',
};

export const getRowStyles = (
  { isNewRow = false, isWithColorPicker = false }: GetRowStyles = {
    isNewRow: false,
    isWithColorPicker: false,
  }
) => {
  let inputTextWidth = '50%';

  if (!window.featureFlags['squad-scoped-custom-events']) {
    inputTextWidth = isNewRow ? `calc(100% - ${colorPickerWidth})` : '100%';
  }

  return {
    display: 'flex',
    flexDirection: 'row',
    columnGap: rowColumnGap,
    '.inputText--kitmanDesignSystem': {
      width: inputTextWidth,
      '&:first-of-type': {
        minWidth: '50%',
      },
    },
    '> .kitmanReactSelect': {
      width: isNewRow
        ? `calc(${inputTextWidth} - ${rowColumnGap} * 2 - ${colorPickerWidth})`
        : nonNewRowElementWidth,
      ...(isWithColorPicker && {
        maxWidth: `calc(${inputTextWidth} - ${rowColumnGap} * 2 - ${colorPickerWidth} - ${
          isNewRow ? removeNewEventButtonMeasurements : '0px'
        })`,
      }),
      '.kitmanReactSelect__menuListActions': {
        justifyContent: 'flex-start',
      },
    },
    '> button': {
      height: removeNewEventButtonMeasurements,
      width: removeNewEventButtonMeasurements,
      minWidth: removeNewEventButtonMeasurements,
    },
    label: {
      '&:first-of-type': {
        minWidth: '50%',
      },
      '&:nth-of-type(2)': {
        ...(isWithColorPicker && {
          maxWidth: `calc(${inputTextWidth} - ${rowColumnGap} * 2 - ${colorPickerWidth})`,
        }),
      },
    },
  };
};

export default {
  group: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0.75rem 0',
    borderBottom: `1px solid ${colors.neutral_200}`,
    'div:has(input.km-error) + div:not(.kitmanReactSelect, div[data-testid="ColorPicker"])':
      {
        marginTop: '1.25rem',
      },
  },
  eventsTypeLabel: {
    color: colors.grey_100,
    marginTop: '0.5rem',
    marginBottom: '0',
    width: nonNewRowElementWidth,
    fontSize: '12px',
  },
  addEventButtonContainer: {
    width: '9.5rem',
  },
  addEventsAndGroupsButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: '1rem',
    justifyContent: 'end',
    columnGap: '0.25rem',
  },
};
