// @flow
import { useEffect } from 'react';
import { capitalize } from 'lodash';
import moment from 'moment';

import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Radio,
  Typography,
  Tooltip,
  LinearProgress,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import {
  formatJustTime,
  formatShort,
} from '@kitman/common/src/utils/dateFormatter';
import colors from '@kitman/common/src/variables/colors';
import i18n from '@kitman/common/src/utils/i18n';
import { getIntegrationImageMapping } from '@kitman/modules/src/shared/MassUpload/New/utils';
import getStyles from '@kitman/modules/src/shared/MassUpload/New/components/Uploader/styles';
import { type IntegrationEvents } from '@kitman/modules/src/shared/MassUpload/services/getIntegrationData';

const IntegrationImportsTable = ({
  selectedIntegration,
  integrationEvents,
  selectedApiImport,
  setSelectedApiImport,
  resetState,
  eventType,
  eventTime,
}: {
  selectedIntegration: {
    id: number | string,
    name: string,
    sourceIdentifier: string,
  },
  integrationEvents: IntegrationEvents | null,
  selectedApiImport: string | null,
  setSelectedApiImport: (value: string | null) => void,
  resetState: () => void,
  eventType: string,
  eventTime: Date,
}) => {
  useEffect(() => {
    if (
      integrationEvents &&
      integrationEvents.length > 0 &&
      !selectedApiImport
    ) {
      const importThatMatchesEventTime = integrationEvents.find(
        (integrationEvent) => {
          return (
            formatShort(moment(integrationEvent.event.datetime)) ===
            formatShort(moment(eventTime))
          );
        }
      );
      if (importThatMatchesEventTime) {
        setSelectedApiImport(
          importThatMatchesEventTime.event.unique_identifier
        );
      }
    }
  }, [integrationEvents]);

  if (!integrationEvents) {
    return (
      <Box
        sx={{
          width: '300px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '64px auto',
        }}
      >
        <img
          src={`${
            getIntegrationImageMapping()[selectedIntegration.sourceIdentifier]
          }?w=200&h=100`}
          alt={i18n.t('{{integrationName}} logo', {
            integrationName: selectedIntegration.name,
          })}
          css={
            getStyles({
              headerHeight: 0,
              parseState: 'DORMANT',
              isIntegrationSelected: false,
            }).integrationImg
          }
        />
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 600,
            color: colors.grey_300,
            marginBottom: '16px',
          }}
        >
          {i18n.t('Connecting to API...')}
        </Typography>
        <LinearProgress sx={{ width: '140px', borderRadius: '4px' }} />
      </Box>
    );
  }

  if (integrationEvents.length === 0) {
    resetState();
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{i18n.t('Date')}</TableCell>
            <TableCell>{capitalize(selectedIntegration.name)} name</TableCell>
            <TableCell>{i18n.t('Duration')}</TableCell>
            <TableCell>
              {i18n.t('{{eventType}} time', {
                eventType,
              })}
            </TableCell>
            <TableCell>{i18n.t('Participants')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ borderTop: '1px solid #ddd' }}>
          {integrationEvents.map((integrationEvent) => (
            <TableRow key={integrationEvent.event.unique_identifier}>
              <TableCell>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  <Radio
                    checked={
                      selectedApiImport ===
                      integrationEvent.event.unique_identifier
                    }
                    disabled={integrationEvent.athletes.length === 0}
                    value={integrationEvent.event.unique_identifier}
                    onChange={(e) => setSelectedApiImport(e.target.value)}
                  />
                  {moment(integrationEvent.event.integration_date).format(
                    'D MMM YYYY'
                  )}
                </Box>
              </TableCell>
              <TableCell>{integrationEvent.event.type}</TableCell>
              <TableCell>
                {i18n.t('{{eventDuration}} mins', {
                  eventDuration: integrationEvent.event.duration,
                }) ?? '-'}
              </TableCell>
              <TableCell>
                {formatJustTime(moment(integrationEvent.event.datetime))}
              </TableCell>
              <TableCell>
                {integrationEvent.athletes.length > 0 ? (
                  integrationEvent.athletes.length
                ) : (
                  <Tooltip
                    placement="bottom-end"
                    title={i18n.t(
                      'Check athlete identifiers are correct in the Manage Athlete area'
                    )}
                    componentsProps={{
                      tooltip: {
                        sx: {
                          bgcolor: colors.red_200,
                        },
                      },
                    }}
                    slotProps={{
                      popper: {
                        modifiers: [
                          {
                            name: 'offset',
                            options: {
                              offset: [0, -8],
                            },
                          },
                        ],
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                        gap: 0.5,
                      }}
                    >
                      <KitmanIcon
                        name={KITMAN_ICON_NAMES.ErrorOutline}
                        sx={{ color: colors.red_100 }}
                      />
                      <Typography variant="body" sx={{ color: colors.red_100 }}>
                        {i18n.t('No participants found')}
                      </Typography>
                    </Box>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default IntegrationImportsTable;
