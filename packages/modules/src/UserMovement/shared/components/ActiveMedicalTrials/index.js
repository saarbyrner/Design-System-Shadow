// @flow
import { type ComponentType } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { withNamespaces } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getId } from '@kitman/modules/src/UserMovement/shared/redux/selectors/movementProfileSelectors';
import { getDrawerState } from '@kitman/modules/src/UserMovement/shared/redux/selectors/createMovementSelectors';

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableContainer,
} from '@kitman/playbook/components';
import { KitmanIcon } from '@kitman/playbook/icons';
import { usePostMovementRecordHistoryQuery } from '@kitman/modules/src/UserMovement/shared/redux/services';
import { HistoryMovementRecordRowTranslated as HistoryMovementRecordRow } from '../HistoryMovementRecordRow';

import { TRIAL } from '../../constants';

const ActiveMedicalTrials = (props: I18nProps<{}>) => {
  const userId = useSelector(getId);
  const { isOpen } = useSelector(getDrawerState);

  const {
    data: medicalTrialData,
    isLoading: isMedicalTrialDataLoading,
    isError: isMedicalTrialDataError,
  } = usePostMovementRecordHistoryQuery(
    {
      userId,
      transfer_type: TRIAL,
    },
    { skip: !userId || !isOpen }
  );

  const getTitle = () => {
    return (
      <Typography variant="body1">
        {props.t('Active Medical Trials {{count}}', {
          count: medicalTrialData?.data
            ? `(${medicalTrialData?.data.length})`
            : '',
        })}
      </Typography>
    );
  };

  return (
    <div>
      <Accordion
        disabled={isMedicalTrialDataLoading || isMedicalTrialDataError}
        elevation={0}
      >
        <AccordionSummary
          expandIcon={
            isMedicalTrialDataLoading ? (
              <CircularProgress size={24} />
            ) : (
              <KitmanIcon name="ExpandMore" fontSize="small" />
            )
          }
          aria-controls="medical-data-content"
          id="medical-data-header"
          sx={{ px: 0 }}
        >
          {getTitle()}
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <TableContainer sx={{ pt: 0 }}>
            <Table>
              <TableBody>
                {medicalTrialData.data.map((record) => (
                  <HistoryMovementRecordRow
                    key={record.id}
                    record={record}
                    showMovementType={false}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export const ActiveMedicalTrialsTranslated: ComponentType<{}> =
  withNamespaces()(ActiveMedicalTrials);
export default ActiveMedicalTrials;
