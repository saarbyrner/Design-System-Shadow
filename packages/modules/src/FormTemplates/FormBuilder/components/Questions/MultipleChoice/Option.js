// @flow

import { MuiColorInput, matchIsValidColor } from 'mui-color-input';
import { Box, TextField, IconButton } from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { convertPixelsToREM } from '@kitman/common/src/utils/css';
import type { SelectOption } from '@kitman/modules/src/HumanInput/types/forms';
import { getMultipleChoiceQuestionTranslations } from './utils/helpers';

type Props = {
  variable: ?string,
  choiceIndex: number,
  choice: SelectOption,
  onChangeColor: (color: string) => void,
  onChangeScore: (score: number) => void,
  onChangeOptionName: (name: string) => void,
  onDeleteOption: () => void,
};

const optionInputSx = { maxWidth: convertPixelsToREM(300) };
const weightedScoreInputSx = { maxWidth: convertPixelsToREM(216) };

const Option = ({
  variable,
  choiceIndex,
  choice,
  onChangeColor,
  onChangeScore,
  onChangeOptionName,
  onDeleteOption,
}: Props) => {
  const translations = getMultipleChoiceQuestionTranslations();
  const shouldDisableOption = !!variable;

  return (
    <Box sx={{ display: 'flex', columnGap: '0.5rem', mb: 1 }}>
      <TextField
        disabled={shouldDisableOption}
        label={`${translations.option} ${choiceIndex + 1}`}
        value={choice.label}
        sx={optionInputSx}
        onChange={({ target: { value } }) => {
          onChangeOptionName(value);
        }}
      />
      {typeof choice.score === 'number' && (
        <TextField
          disabled={shouldDisableOption}
          label={translations.weightedScore}
          value={choice.score}
          sx={weightedScoreInputSx}
          onInput={({ target: { value } }) => {
            const numberValue = +value;
            if (Number.isNaN(numberValue)) {
              return;
            }
            onChangeScore(numberValue);
          }}
        />
      )}
      {choice.color && (
        <MuiColorInput
          disabled={shouldDisableOption}
          label={translations.color}
          value={choice.color}
          onChange={(color: string) => {
            if (matchIsValidColor(color)) {
              onChangeColor(color);
            }
          }}
          format="hex"
          isAlphaHidden
        />
      )}
      <IconButton
        aria-label="delete"
        disabled={shouldDisableOption}
        onClick={() => {
          onDeleteOption();
        }}
      >
        <KitmanIcon name={KITMAN_ICON_NAMES.Delete} />
      </IconButton>
    </Box>
  );
};

export default Option;
