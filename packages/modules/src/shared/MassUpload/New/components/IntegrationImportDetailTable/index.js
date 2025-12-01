// @flow
import moment from 'moment';
import _uniqueId from 'lodash/uniqueId';

import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Alert,
  AlertTitle,
} from '@kitman/playbook/components';
import { formatJustTime } from '@kitman/common/src/utils/dateFormatter';
import { type IntegrationEvents } from '@kitman/modules/src/shared/MassUpload/services/getIntegrationData';
import i18n from '@kitman/common/src/utils/i18n';
import { chunkArray } from '@kitman/modules/src/shared/MassUpload/New/utils/index';

const IntegrationImportDetailTable = ({
  selectedApiImport,
  integrationEvents,
}: {
  selectedApiImport: string,
  integrationEvents: IntegrationEvents,
}) => {
  const selectedImport = integrationEvents.find(
    (data) => data.event?.unique_identifier === selectedApiImport
  );

  if (!selectedImport) {
    return null;
  }

  return (
    <Box sx={{ margin: '32px' }}>
      <TableContainer>
        <Table
          sx={{
            '.MuiTableCell-root': { borderBottom: 'none', padding: '8px 16px' },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>{i18n.t('Import name')}</TableCell>
              <TableCell>{i18n.t('Time')}</TableCell>
              <TableCell>{i18n.t('Included athletes')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{selectedImport.event?.unique_identifier}</TableCell>
              <TableCell>
                {formatJustTime(moment(selectedImport.event?.datetime))}
              </TableCell>
              <TableCell>
                {selectedImport.athletes.length} /{' '}
                {selectedImport.athletes.length +
                  selectedImport.non_setup_athletes_identifiers.length}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell colSpan={3}>
                <Alert severity="error">
                  <AlertTitle>
                    {i18n.t('Not found: {{nonSetupCount}}', {
                      nonSetupCount:
                        selectedImport.non_setup_athletes_identifiers.length,
                    })}
                  </AlertTitle>
                  {i18n.t(
                    'Check these athlete identifiers are correct within the Manage Athlete area'
                  )}
                </Alert>
              </TableCell>
            </TableRow>

            {chunkArray(selectedImport.non_setup_athletes_identifiers).map(
              (athleteArray) => (
                <TableRow key={_uniqueId('non-setup-athletes-')}>
                  {/* $FlowIgnore[incompatible-type] athleteArray is an array */}
                  {athleteArray.map((athlete) => (
                    <TableCell key={athlete}>{athlete}</TableCell>
                  ))}
                </TableRow>
              )
            )}

            <TableRow>
              <TableCell colSpan={3}>
                <Alert severity="success">
                  <AlertTitle>
                    {i18n.t('Included athletes: {{count}}', {
                      count: selectedImport.athletes.length,
                    })}
                  </AlertTitle>
                </Alert>
              </TableCell>
            </TableRow>

            {chunkArray(selectedImport.athletes).map((athleteArray) => (
              <TableRow key={_uniqueId('setup-athletes-')}>
                {athleteArray.map((athlete) => (
                  // $FlowIgnore[prop-missing] flow thinks this is array of non_setup_athletes_identifiers
                  <TableCell key={athlete.id}>{athlete.fullname}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default IntegrationImportDetailTable;
