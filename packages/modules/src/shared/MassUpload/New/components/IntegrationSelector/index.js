// @flow
import moment from 'moment';

import {
  Button,
  Typography,
  Box,
  Alert,
  AlertTitle,
} from '@kitman/playbook/components';
import colors from '@kitman/common/src/variables/colors';
import getStyles from '@kitman/modules/src/shared/MassUpload/New/components/Uploader/styles';
import i18n from '@kitman/common/src/utils/i18n';
import { getIntegrationImageMapping } from '@kitman/modules/src/shared/MassUpload/New/utils';
import { KitmanIcon, KITMAN_ICON_NAMES } from '@kitman/playbook/icons';
import { type SetState } from '@kitman/common/src/types/react';
import { type ParseState } from '@kitman/modules/src/shared/MassUpload/types';
import { type SourceFormDataResponse } from '@kitman/modules/src/shared/MassUpload/services/getSourceFormData';
import { type IntegrationEvents } from '@kitman/modules/src/shared/MassUpload/services/getIntegrationData';

const IntegrationSelector = ({
  integrationData,
  selectedIntegration,
  setSelectedIntegration,
  headerHeight,
  parseState,
  hasErrors,
  eventTime,
  integrationEvents,
}: {
  selectedIntegration: { id: number | string, name: string },
  setSelectedIntegration: SetState<{ id: number | string, name: string }>,
  integrationData: SourceFormDataResponse,
  headerHeight: number,
  parseState: ParseState,
  hasErrors: boolean,
  eventTime: Date,
  integrationEvents: IntegrationEvents,
}) => {
  const getAlertText = () => ({
    title: integrationEvents
      ? i18n.t(
          'No data found on device for date of session or game: {{eventDate}}.',
          { eventDate: moment(eventTime).format('D MMM YYYY') }
        )
      : i18n.t('Could not load data.'),
    description: integrationEvents
      ? i18n.t(
          'Change the date of the session or game or select a different data source.'
        )
      : i18n.t('API failed to fetch data. Try again.'),
  });

  return (
    <Box
      css={
        getStyles({
          headerHeight,
          parseState,
          isIntegrationSelected: selectedIntegration.name === 'CSV',
        }).integrationButtonContainer
      }
    >
      {hasErrors && (
        <Alert
          severity="error"
          sx={{ width: '100%', '.MuiAlert-message': { textAlign: 'left' } }}
        >
          <AlertTitle>{getAlertText().title}</AlertTitle>
          <Typography>{getAlertText().description}</Typography>
        </Alert>
      )}

      <Button
        variant="outlined"
        sx={
          getStyles({
            headerHeight,
            parseState,
            isIntegrationSelected: selectedIntegration.name === 'CSV',
          }).integrationButton
        }
        onClick={() => setSelectedIntegration({ id: 'CSV', name: 'CSV' })}
      >
        <Box
          css={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color:
              selectedIntegration.name === 'CSV'
                ? colors.white
                : colors.grey_200,
          }}
        >
          <KitmanIcon
            name={KITMAN_ICON_NAMES.NoteOutlined}
            fontSize="large"
            sx={{
              color:
                selectedIntegration.name === 'CSV'
                  ? colors.white
                  : colors.grey_200,
            }}
          />
          {i18n.t('CSV file')}
        </Box>
      </Button>
      {integrationData?.integrations?.map((integration) => (
        <Button
          variant="outlined"
          sx={
            getStyles({
              headerHeight,
              parseState,
              isIntegrationSelected: hasErrors
                ? false
                : selectedIntegration.id === integration.id,
              hasIntegrationErrored:
                hasErrors && selectedIntegration.id === integration.id,
            }).integrationButton
          }
          onClick={() =>
            setSelectedIntegration({
              id: integration.id,
              name: integration.source_identifier,
              sourceIdentifier: integration.source_identifier,
            })
          }
          key={integration.source_identifier}
        >
          {getIntegrationImageMapping()[integration.source_identifier] ? (
            <img
              src={`${
                getIntegrationImageMapping()[integration.source_identifier]
              }?w=200&h=100`}
              alt={i18n.t('{{integrationName}} logo', {
                integrationName: integration.name,
              })}
              css={
                getStyles({
                  headerHeight,
                  parseState,
                  isIntegrationSelected: hasErrors
                    ? false
                    : selectedIntegration.id === integration.id,
                  hasIntegrationErrored:
                    hasErrors && selectedIntegration.id === integration.id,
                }).integrationImg
              }
            />
          ) : (
            <Typography>{integration.name}</Typography>
          )}
        </Button>
      ))}
    </Box>
  );
};

export default IntegrationSelector;
