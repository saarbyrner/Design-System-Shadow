// @flow
import { useEffect, type ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';

import { colors } from '@kitman/common/src/variables';
import { useShowToasts } from '@kitman/common/src/hooks';
import {
  APP_BAR_HEIGHT,
  TITLE_BAR_HEIGHT,
  TABS_HEIGHT,
} from '@kitman/modules/src/HumanInput/shared/constants';
import { useGetAthleteIdFromPath } from '@kitman/modules/src/HumanInput/hooks/helperHooks/useGetAthleteIdFromPath';
import {
  useFetchIntegrationSettingsQuery,
  useUpdateAthleteIntegrationSettingsMutation,
} from '@kitman/services/src/services/humanInput/humanInput';
import { type RequestProps } from '@kitman/services/src/services/humanInput/api/athleteProfile/updateAthleteIntegrationSettings';
import {
  onBuildThirdPartySettingsState,
  onUpdateSettingField,
} from '@kitman/modules/src/AthleteProfile/redux/slices/athleteProfileSlice';
import type { ReduxMutation } from '@kitman/common/src/types/Redux';
import { getThirdPartySettingsState } from '@kitman/modules/src/AthleteProfile/redux/selectors';
import { type IntegrationSettingsResponse } from '@kitman/services/src/services/humanInput/api/athleteProfile/fetchIntegrationSettings';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  Button,
  Typography,
  Box,
  TextField,
  FormControl,
  Grid,
  CircularProgress,
} from '@kitman/playbook/components';

const styles = {
  pageContainer: {
    backgroundColor: colors.white,
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    minHeight: `calc(100vh - ${
      APP_BAR_HEIGHT + TITLE_BAR_HEIGHT + TABS_HEIGHT
    }px)`,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    mb: 2,
  },
};

const ThirdPartySettings = ({ t }: I18nProps<{}>) => {
  const dispatch = useDispatch();
  const athleteId = useGetAthleteIdFromPath();
  const thirdPartySettingsMap = useSelector(getThirdPartySettingsState);
  const THIRD_PARTY_SETTINGS_ERROR_TOAST_ID =
    'THIRD_PARTY_SETTINGS_ERROR_TOAST_ID';
  const THIRD_PARTY_SETTINGS_SUCCESS_TOAST_ID =
    'THIRD_PARTY_SETTINGS_SUCCESS_TOAST_ID';

  const { showErrorToast, showSuccessToast } = useShowToasts({
    errorToastId: THIRD_PARTY_SETTINGS_ERROR_TOAST_ID,
    successToastId: THIRD_PARTY_SETTINGS_SUCCESS_TOAST_ID,
  });
  const {
    isLoading: isFetchIntegrationSettingsLoading,
    isSuccess,
    data: integrationSettingsData = {},
  }: {
    isSuccess: boolean,
    isLoading: boolean,
    data: IntegrationSettingsResponse,
  } = useFetchIntegrationSettingsQuery(athleteId);

  const [
    updateAthleteIntegrationSettings,
    { isLoading: isUpdateAthleteIntegrationSettingsLoading },
  ]: [ReduxMutation<RequestProps, {}>, { isLoading: boolean }] =
    useUpdateAthleteIntegrationSettingsMutation();

  const { inputs, links } = integrationSettingsData;

  useEffect(() => {
    // build hash map to have 0(1) access for field values
    if (isSuccess) {
      dispatch(onBuildThirdPartySettingsState(inputs));
    }
  }, [inputs, isSuccess, dispatch]);

  const handleSaveButtonClick = async () => {
    const requestPayload = {
      athleteId,
      requestBody: {
        inputs: Object.keys(thirdPartySettingsMap).map((inputKey) => ({
          key: inputKey,
          value: thirdPartySettingsMap[inputKey],
        })),
      },
    };

    try {
      unwrapResult(await updateAthleteIntegrationSettings(requestPayload));

      showSuccessToast({
        translatedTitle: t('Successfully updated third party settings'),
      });
    } catch {
      showErrorToast({
        translatedTitle: t(
          'Failed to update third party settings. Please try again'
        ),
      });
    }
  };

  return (
    <Box sx={styles.pageContainer}>
      <Box sx={styles.header}>
        <Typography variant="h6" color={colors.grey_200}>
          {t('Third Party Settings')}
        </Typography>

        <Button
          onClick={handleSaveButtonClick}
          disabled={isUpdateAthleteIntegrationSettingsLoading}
        >
          {t('Save')}
        </Button>
      </Box>
      {isFetchIntegrationSettingsLoading ? (
        <CircularProgress color="inherit" sx={{ alignSelf: 'center' }} />
      ) : (
        <>
          <FormControl>
            <Grid container spacing={3} sx={{ width: '70%' }}>
              {inputs?.map(({ name, key }) => {
                return (
                  <Grid item xs={4}>
                    <TextField
                      value={thirdPartySettingsMap[key]}
                      label={name}
                      onChange={(event) => {
                        dispatch(
                          onUpdateSettingField({
                            [key]: event.target.value,
                          })
                        );
                      }}
                      fullWidth
                    />
                  </Grid>
                );
              })}
            </Grid>
          </FormControl>
          {links.length > 0 && (
            <Grid container spacing={3} sx={{ width: '70%', mt: 2 }}>
              {links.map(({ name, url }) => (
                <Grid item xs={4}>
                  <Button variant="outlined" href={url}>
                    {name}
                  </Button>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Box>
  );
};

export const ThirdPartySettingsTranslated: ComponentType<{}> =
  withNamespaces()(ThirdPartySettings);

export default ThirdPartySettings;
