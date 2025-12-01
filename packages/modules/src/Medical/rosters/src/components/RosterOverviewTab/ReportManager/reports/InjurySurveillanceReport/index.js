// @flow
import moment from 'moment';
import { useState } from 'react';
import {
  TextField,
  DateRangePicker,
  SingleInputDateRangeField,
  Checkbox,
  FormControlLabel,
  Tooltip,
  IconButton,
} from '@kitman/playbook/components';
import { KITMAN_ICON_NAMES, KitmanIcon } from '@kitman/playbook/icons';
import type { ComponentType } from 'react';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { withNamespaces } from 'react-i18next';
import { exportInjurySurveillanceReport } from '@kitman/services';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { determineMedicalLevelAndTab } from '@kitman/common/src/utils/TrackingData/src/data/medical/getMedicalEventData';
import performanceMedicineEventNames from '@kitman/common/src/utils/TrackingData/src/eventNames/performanceMedicine';
import { RulesetsSelectTranslated as RulesetsSelect } from './RulesetsSelect';
import { SquadsSelectTranslated as SquadsSelect } from './SquadsSelect';
import { LayoutReportTranslated as LayoutReport } from './layout';
import styles from './styles';

type Props = {
  isOpen: boolean,
  onClose: () => void,
};

const InjurySurveillanceReport = ({ isOpen, onClose, t }: I18nProps<Props>) => {
  const today = moment().format('YYYY_MM_DD');
  const injurySurveillanceDefaultName = `Logic_Builder_Medical_Report_${today}`;
  const [selectedSquads, setSelectedSquads] = useState([]);
  const [selectedRulesets, setSelectedRulesets] = useState([]);
  const [isAnonymized, setIsAnonymized] = useState(false);
  const [includePastPlayers, setIncludePastPlayers] = useState(false);
  const [reportName, setReportName] = useState(injurySurveillanceDefaultName);
  const [dateRange, setDateRange] = useState<
    [moment.Moment | null, moment.Moment | null]
  >([null, null]);
  const [startTime, endTime] = dateRange;
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { trackEvent } = useEventTracking();

  // eslint-disable-next-line camelcase
  const start_time = startTime
    ? moment(startTime).startOf('day').format(DateFormatter.dateTransferFormat)
    : null;

  // eslint-disable-next-line camelcase
  const end_time = endTime
    ? moment(endTime).endOf('day').format(DateFormatter.dateTransferFormat)
    : null;
  const dateRangeArr = [{ start_time, end_time }];

  const isFormValid =
    reportName &&
    startTime &&
    endTime &&
    selectedSquads.length > 0 &&
    selectedRulesets.length > 0;

  const clearValues = () => {
    setReportName(injurySurveillanceDefaultName);
    setDateRange([null, null]);
    setSelectedSquads([]);
    setSelectedRulesets([]);
    setIsAnonymized(false);
    setIncludePastPlayers(false);
  };

  const handleExport = async () => {
    try {
      const eventToTrack = isAnonymized
        ? performanceMedicineEventNames.exportAnonymizedLogicBuilderMedicalReport
        : performanceMedicineEventNames.exportLogicBuilderMedicalReport;
      trackEvent(eventToTrack, determineMedicalLevelAndTab());
      await exportInjurySurveillanceReport({
        name: reportName,
        squads: selectedSquads.map((squad) => squad.id),
        dateRange: dateRangeArr,
        anonymiseReport: isAnonymized,
        screeningRulesetIds: selectedRulesets.map((ruleset) => ruleset.id),
        format: 'csv',
        includePastPlayers,
      });
      clearValues();
      setIsSuccess(true);
      setIsSnackbarOpen(true);
      onClose();
    } catch (error) {
      setIsSuccess(false);
      setIsSnackbarOpen(true);
    }
  };

  return (
    <LayoutReport
      isOpen={isOpen}
      onClose={onClose}
      title={t('Logic Builder - Medical Report')}
      openSnackbar={isSnackbarOpen}
      isSuccess={isSuccess}
      exportReport={handleExport}
      isExportDisabled={!isFormValid}
    >
      <>
        <TextField
          label={t('File name')}
          variant="standard"
          value={reportName}
          onChange={(event) => {
            setReportName(event.target.value);
          }}
        />
        <DateRangePicker
          slots={{ field: SingleInputDateRangeField }}
          value={dateRange}
          label={t('Date range')}
          onChange={(newDateRange) => setDateRange(newDateRange)}
        />
        <SquadsSelect
          onChange={(selectedSquad) => {
            setSelectedSquads(selectedSquad);
          }}
          selectedSquads={selectedSquads}
        />
        <RulesetsSelect
          isDisabled={selectedSquads.length === 0}
          selectedRulesets={selectedRulesets}
          onChange={(selectedRuleset) => {
            setSelectedRulesets(selectedRuleset);
          }}
        />
        {window.getFlag('pm-logic-builder-export-past-players') && (
          <FormControlLabel
            control={
              <Checkbox
                onChange={() =>
                  setIncludePastPlayers((prevState) => !prevState)
                }
                checked={includePastPlayers}
              />
            }
            label={
              <div>
                <span>{t('Include Past Players')}</span>
                <Tooltip
                  title={t('This option includes past players in the report.')}
                  PopperProps={{
                    sx: styles.tooltip,
                  }}
                >
                  <IconButton>
                    <KitmanIcon name={KITMAN_ICON_NAMES.ErrorOutline} />
                  </IconButton>
                </Tooltip>
              </div>
            }
          />
        )}
        <FormControlLabel
          control={
            <Checkbox
              onChange={() => setIsAnonymized((prevState) => !prevState)}
              checked={isAnonymized}
            />
          }
          label={
            <div>
              <span>{t('Anonymized report')}</span>
              <Tooltip
                title={t(
                  'This option removes identifiable information from report.'
                )}
                PopperProps={{
                  sx: styles.tooltip,
                }}
              >
                <IconButton>
                  <KitmanIcon name={KITMAN_ICON_NAMES.ErrorOutline} />
                </IconButton>
              </Tooltip>
            </div>
          }
        />
      </>
    </LayoutReport>
  );
};

export const InjurySurveillanceReportTranslated: ComponentType<Props> =
  withNamespaces()(InjurySurveillanceReport);
export default InjurySurveillanceReport;
