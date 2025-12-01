// @flow
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';

import {
  FormControl,
  FormControlLabel,
  Grid2 as Grid,
  Radio,
  RadioGroup,
  TextField,
  Switch,
} from '@kitman/playbook/components';
import Errors from '@kitman/components/src/DocumentSplitter/src/components/Errors';
import {
  POSITIVE_NUMERIC_REGEX,
  SPLIT_OPTIONS_DATA_KEY,
  SPLIT_DOCUMENT_MODES,
} from '@kitman/components/src/DocumentSplitter/src/shared/consts';

// Types
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Data, PartialData, Validation } from './types';

type Props = {
  data: Data,
  validation: Validation,
  handleChange: (data: PartialData) => void,
};

const SplitOptions = ({
  data,
  validation,
  handleChange,
  t,
}: I18nProps<Props>) => {
  const fromInput = (
    <Grid xs={8}>
      <FormControlLabel
        control={
          <TextField
            value={data.splitFrom || ''}
            label={t('Page')}
            onChange={(e) => {
              if (
                e.target.value &&
                !POSITIVE_NUMERIC_REGEX.test(e.target.value)
              ) {
                return;
              }
              const number = parseInt(e.target.value, 10) || null;
              handleChange({
                [SPLIT_OPTIONS_DATA_KEY.splitFrom]: number,
              });
            }}
            margin="none"
            fullWidth
            error={
              !!validation.errors?.[SPLIT_OPTIONS_DATA_KEY.splitFrom]?.length
            }
          />
        }
        sx={{
          margin: 0,
          columnGap: '0.7rem',
        }}
        label={t('From')}
        labelPlacement="start"
      />
    </Grid>
  );

  return (
    <>
      <Errors
        errors={validation.hasErrors ? [t('Invalid document split')] : null}
        wrapInHelperText
      />
      <Grid container spacing={2} my={1} columns={16}>
        <Grid
          xs={8}
          sx={{
            alignContent: 'center',
            minHeight: '64px',
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={
                  data.splitDocument !== SPLIT_DOCUMENT_MODES.noSplitting
                }
                onChange={(event) => {
                  handleChange({
                    [SPLIT_OPTIONS_DATA_KEY.splitDocument]: event.target.checked
                      ? SPLIT_DOCUMENT_MODES.intoSections
                      : SPLIT_DOCUMENT_MODES.noSplitting,
                  });
                }}
              />
            }
            label={t('Split document')}
            labelPlacement="start"
            sx={{
              flexDirection: 'row',
              margin: 0,
            }}
          />
        </Grid>
        <Grid
          xs={16}
          sx={{
            alignContent: 'center',
            minHeight: '64px',
          }}
        >
          {data.splitDocument !== SPLIT_DOCUMENT_MODES.noSplitting && (
            <FormControl>
              <RadioGroup
                row
                defaultValue={SPLIT_DOCUMENT_MODES.intoSections}
                value={data.splitDocument}
                sx={{ marginLeft: '10px' }}
              >
                <FormControlLabel
                  key={SPLIT_DOCUMENT_MODES.intoSections}
                  value={SPLIT_DOCUMENT_MODES.intoSections}
                  control={<Radio />}
                  onClick={() =>
                    handleChange({
                      [SPLIT_OPTIONS_DATA_KEY.splitDocument]:
                        SPLIT_DOCUMENT_MODES.intoSections,
                    })
                  }
                  label={t('into sections')}
                />
                <FormControlLabel
                  key={SPLIT_DOCUMENT_MODES.everyX}
                  value={SPLIT_DOCUMENT_MODES.everyX}
                  control={<Radio />}
                  onClick={() =>
                    handleChange({
                      [SPLIT_OPTIONS_DATA_KEY.splitDocument]:
                        SPLIT_DOCUMENT_MODES.everyX,
                    })
                  }
                  label={t("every 'x' pages")}
                />
              </RadioGroup>
            </FormControl>
          )}
        </Grid>
        {data.splitDocument === SPLIT_DOCUMENT_MODES.intoSections && (
          <>
            <Grid xs={8}>
              <TextField
                value={data.numberOfSections || ''}
                label={t('Number of Sections')}
                onChange={(e) => {
                  if (
                    e.target.value &&
                    !POSITIVE_NUMERIC_REGEX.test(e.target.value)
                  ) {
                    return;
                  }

                  const number = parseInt(e.target.value, 10) || null;
                  handleChange({
                    [SPLIT_OPTIONS_DATA_KEY.numberOfSections]: number,
                  });
                }}
                margin="none"
                fullWidth
                error={
                  !!validation.errors?.[SPLIT_OPTIONS_DATA_KEY.numberOfSections]
                    ?.length
                }
              />
            </Grid>
            {fromInput}
          </>
        )}
        {data.splitDocument === SPLIT_DOCUMENT_MODES.everyX && (
          <>
            <Grid xs={8}>
              <FormControlLabel
                control={
                  <TextField
                    value={data.splitEvery || ''}
                    label={t('Pages')}
                    onChange={(e) => {
                      if (
                        e.target.value &&
                        !POSITIVE_NUMERIC_REGEX.test(e.target.value)
                      ) {
                        return;
                      }
                      const number = parseInt(e.target.value, 10) || null;
                      handleChange({
                        [SPLIT_OPTIONS_DATA_KEY.splitEvery]: number,
                      });
                    }}
                    margin="none"
                    fullWidth
                    error={
                      !!validation.errors?.[SPLIT_OPTIONS_DATA_KEY.splitEvery]
                        ?.length
                    }
                  />
                }
                sx={{
                  margin: 0,
                  columnGap: '0.7rem',
                }}
                label={t('Every')}
                labelPlacement="start"
              />
            </Grid>
            {fromInput}
          </>
        )}
      </Grid>
    </>
  );
};

export const SplitOptionsTranslated: ComponentType<Props> =
  withNamespaces()(SplitOptions);
export default SplitOptions;
