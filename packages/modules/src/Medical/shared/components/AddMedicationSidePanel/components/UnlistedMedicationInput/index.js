// @flow
import { withNamespaces } from 'react-i18next';

import {
  Autocomplete,
  Box,
  Button,
  Collapse,
  Stack,
  TextField,
  Typography,
  Grid2 as Grid,
} from '@kitman/playbook/components';
import { renderInput } from '@kitman/playbook/utils/Autocomplete';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import { useGetCountriesQuery } from '@kitman/common/src/redux/global/services/globalApi';
import {
  useGetDrugFormsQuery,
  useGetMedStrengthUnitsQuery,
} from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { getFlagFrom2DigitCountryCode } from '@kitman/common/src/utils/localeHelpers';
import styles from '@kitman/modules/src/Medical/shared/components/AddMedicationSidePanel/components/UnlistedMedicationInput/styles';

// Types
import type { ComponentType } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { CustomDrugFormData } from '@kitman/modules/src/Medical/shared/types/medical/Medications';
import type { FormAction } from '@kitman/modules/src/Medical/shared/components/AddMedicationSidePanel/hooks/useMedicationForm';

type Props = {
  isOpen: boolean,
  isDisabled: boolean,
  isValidationCheckAllowed: boolean,
  unlistedMed: CustomDrugFormData,
  toggleOpen: () => void,
  updateUnlistedMed: (FormAction) => void,
};

const UnlistedMedicationInput = ({
  isOpen,
  isDisabled,
  isValidationCheckAllowed,
  unlistedMed,
  toggleOpen,
  updateUnlistedMed,
  t,
}: I18nProps<Props>) => {
  const {
    data: countriesData = null,
    isLoading: areCountriesLoading,
    isError: hasCountryError,
  } = useGetCountriesQuery(null, {
    skip: !isOpen,
  });

  const countryOptions =
    countriesData?.countries.map((country) => ({
      id: country.alpha2,
      label: country.name,
      flag: getFlagFrom2DigitCountryCode(country.alpha2),
    })) || [];

  const {
    data: drugFormOptions = [],
    error: hasDrugFormOptionsError,
    isLoading: areDrugFormOptionsLoading,
  } = useGetDrugFormsQuery({ skip: !isOpen });

  const {
    data: unitOptions = [],
    error: hasUnitOptionsError,
    isLoading: areUnitOptionsLoading,
  } = useGetMedStrengthUnitsQuery({ skip: !isOpen });

  return (
    <Box>
      <Collapse in={!isOpen}>
        <Button
          startIcon={<KitmanIcon name={KITMAN_ICON_NAMES.Add} />}
          variant="text"
          disabled={isDisabled}
          onClick={() => {
            toggleOpen();
          }}
        >
          {t('Unlisted Medication')}
        </Button>
      </Collapse>
      <Collapse in={isOpen}>
        <Box pb={1} pl="16px" sx={{ borderLeft: styles.borderIndent }}>
          <Box
            display="flex"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              sx={styles.subtitle}
            >
              {t('Unlisted medication')}
            </Typography>
            <Button
              variant="text"
              disabled={isDisabled}
              onClick={() => {
                toggleOpen();
              }}
            >
              {t('Cancel')}
            </Button>
          </Box>
          <Stack
            direction="column"
            gap={1}
            alignItems="left"
            justifyContent="space-between"
          >
            <TextField
              label={t('Brand name')}
              value={unlistedMed.brand_name || ''}
              onChange={(e) => {
                updateUnlistedMed({
                  type: 'SET_UNLISTED_MED_BRAND_NAME',
                  brandName: e.target.value,
                });
              }}
              fullWidth
              margin="none"
              disabled={isDisabled}
              sx={{ width: '100%' }}
            />
            <TextField
              label={t('Drug/Generic name')}
              value={unlistedMed.name || ''}
              onChange={(e) => {
                updateUnlistedMed({
                  type: 'SET_UNLISTED_MED_NAME',
                  name: e.target.value,
                });
              }}
              fullWidth
              required
              margin="none"
              disabled={isDisabled}
              sx={{ width: '100%' }}
              error={isValidationCheckAllowed && !unlistedMed.name?.trim()}
            />

            <Autocomplete
              disableClearable
              disabled={isDisabled || areDrugFormOptionsLoading}
              fullWidth
              size="small"
              loading={areDrugFormOptionsLoading}
              value={
                unlistedMed.drug_form
                  ? drugFormOptions.find(
                      (option) => option.label === unlistedMed.drug_form
                    )
                  : null
              }
              onChange={(e, value) => {
                updateUnlistedMed({
                  type: 'SET_UNLISTED_MED_DRUG_FORM',
                  drugForm: value.label,
                });
              }}
              options={drugFormOptions}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              groupBy={(option) => option.group}
              renderInput={(renderInputParams: Object) =>
                renderInput({
                  params: { ...renderInputParams, required: true },
                  label: t('Drug form'),
                  error:
                    hasDrugFormOptionsError ||
                    (isValidationCheckAllowed && !unlistedMed.drug_form),
                })
              }
              getOptionLabel={(option) => option.label}
              noOptionsText={t('No match found')}
              sx={styles.inputBackgroundStyle}
            />
            <Grid container columns={12} columnSpacing={1}>
              <Grid xs={3}>
                <TextField
                  label={t('Strength')}
                  value={unlistedMed.med_strength || ''}
                  onChange={(e) => {
                    updateUnlistedMed({
                      type: 'SET_UNLISTED_MED_STRENGTH',
                      strength: e.target.value,
                    });
                  }}
                  fullWidth
                  margin="none"
                  disabled={isDisabled}
                  error={
                    isValidationCheckAllowed &&
                    !unlistedMed.med_strength?.trim()
                  }
                  required
                />
              </Grid>
              <Grid xs={5}>
                <Autocomplete
                  disableClearable
                  disabled={isDisabled || areUnitOptionsLoading}
                  fullWidth
                  size="small"
                  loading={areUnitOptionsLoading}
                  value={
                    unlistedMed.med_strength_unit
                      ? unitOptions.find(
                          (option) =>
                            option.value === unlistedMed.med_strength_unit
                        )
                      : null
                  }
                  onChange={(e, value) => {
                    updateUnlistedMed({
                      type: 'SET_UNLISTED_MED_STRENGTH_UNIT',
                      unit: value.value,
                    });
                  }}
                  options={unitOptions}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  groupBy={(option) => option.group}
                  renderInput={(renderInputParams: Object) =>
                    renderInput({
                      params: { ...renderInputParams, required: true },
                      label: t('unit'),
                      required: true,
                      error:
                        hasUnitOptionsError ||
                        (isValidationCheckAllowed &&
                          !unlistedMed.med_strength_unit),
                    })
                  }
                  getOptionLabel={(option) => option.label}
                  noOptionsText={t('No match found')}
                  sx={styles.inputBackgroundStyle}
                />
              </Grid>
              {unlistedMed.med_strength_unit === 'other' && (
                <Grid xs={5}>
                  <TextField
                    label={t('Other unit')}
                    value={unlistedMed.med_strength_other_unit || ''}
                    onChange={(e) => {
                      updateUnlistedMed({
                        type: 'SET_UNLISTED_MED_OTHER_UNIT',
                        unit: e.target.value,
                      });
                    }}
                    fullWidth
                    margin="none"
                    disabled={isDisabled}
                    error={
                      isValidationCheckAllowed &&
                      !unlistedMed.med_strength_other_unit?.trim()
                    }
                    required
                  />
                </Grid>
              )}
            </Grid>
            <Autocomplete
              disabled={areCountriesLoading || isDisabled}
              fullWidth
              size="small"
              loading={areCountriesLoading}
              value={
                unlistedMed.country
                  ? countryOptions.find(
                      (option) => option.id === unlistedMed.country
                    )
                  : null
              }
              onChange={(e, value) => {
                updateUnlistedMed({
                  type: 'SET_UNLISTED_MED_COUNTRY',
                  country: value.id,
                });
              }}
              options={countryOptions}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              groupBy={(option) => option.group}
              renderOption={(renderProps, option) => (
                <Box
                  {...renderProps}
                  component="li"
                  sx={{ '& > span': { mr: 2 } }}
                  key={`${option.id}`}
                >
                  <span>{option.flag}</span>
                  {option.label}
                </Box>
              )}
              renderInput={(renderInputParams: Object) =>
                renderInput({
                  params: renderInputParams,
                  label: t('Country'),
                  loading: areCountriesLoading,
                  error: hasCountryError,
                })
              }
              getOptionLabel={(option) => option.label}
              noOptionsText={t('No match found')}
              sx={styles.inputBackgroundStyle}
            />
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
};

export const UnlistedMedicationInputTranslated: ComponentType<Props> =
  withNamespaces()(UnlistedMedicationInput);
export default UnlistedMedicationInput;
