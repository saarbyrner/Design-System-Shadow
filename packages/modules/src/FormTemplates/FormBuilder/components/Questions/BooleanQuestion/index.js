// @flow
import { useDispatch } from 'react-redux';

import {
  Box,
  FormControl,
  InputLabel,
  Select,
  TextField,
} from '@kitman/playbook/components';
import { updateQuestionElement } from '@kitman/modules/src/FormTemplates/FormBuilder/utils/helpers';
import { convertPixelsToREM } from '@kitman/common/src/utils/css';
import { colors } from '@kitman/common/src/variables';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import {
  getBooleanQuestionTranslations,
  getStyleOptions,
} from './utils/helpers';

type Props = {
  questionIndex: number,
  questionElement: HumanInputFormElement,
  isChildOfGroup: ?boolean,
  groupIndex: ?number,
};

const BooleanQuestion = ({
  questionIndex,
  questionElement: { config },
  isChildOfGroup,
  groupIndex,
}: Props) => {
  const dispatch = useDispatch();
  const translations = getBooleanQuestionTranslations();
  const inputElementsSx = { maxWidth: convertPixelsToREM(300) };
  const { style = 'toggle' } = config?.custom_params || {};

  const styleOptions = getStyleOptions();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: '1rem',
        '.MuiInputLabel-root.Mui-disabled': { color: colors.grey_300_50 },
        '.MuiFilledInput-input.Mui-disabled': {
          WebkitTextFillColor: colors.grey_300,
        },
      }}
    >
      <FormControl>
        <InputLabel id="select-label-input">{translations.style}</InputLabel>
        <Select
          labelId="select-label-input"
          label={translations.style}
          value={style}
          onChange={({ target: { value } }) => {
            updateQuestionElement(
              {
                questionIndex,
                field: 'config',
                value: {
                  ...config,
                  custom_params: {
                    ...config.custom_params,
                    style: value,
                  },
                },
              },
              dispatch,
              isChildOfGroup,
              groupIndex
            );
          }}
          sx={inputElementsSx}
        >
          {styleOptions}
        </Select>
      </FormControl>
      <TextField
        disabled
        label={translations.option1}
        value={translations.yes}
        sx={inputElementsSx}
      />
      <TextField
        disabled
        label={translations.option2}
        value={translations.no}
        sx={inputElementsSx}
      />
    </Box>
  );
};

export default BooleanQuestion;
