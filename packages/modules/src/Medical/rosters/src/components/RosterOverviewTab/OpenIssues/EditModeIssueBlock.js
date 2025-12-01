// @flow
import { withNamespaces } from 'react-i18next';
import moment, { Moment } from 'moment';
import { Select } from '@kitman/components';
import MovementAwareDatePicker from '@kitman/playbook/components/wrappers/MovementAwareDatePicker';
import type { Translation } from '@kitman/common/src/types/i18n';
import type { OpenIssue } from '@kitman/modules/src/Medical/rosters/types';
import type { InjuryStatus } from '@kitman/services/src/services/getInjuryStatuses';
import type { SelectOption } from '@kitman/components/src/types';
import { style } from './style';
import { getStatusOptions, getDefaultStatusId } from './utils';

type Props = {
  openIssue: OpenIssue,
  injuryStatuses: Array<InjuryStatus>,
  editedStatuses: { [issueId: number]: number },
  saving: boolean,
  dateValidationErrors: { [issueId: number]: string },
  athleteId: string,
  isInjuryLockedToOccurrenceDate: boolean,
  isFetchingIssueDetails: boolean,
  getIssueDate: (openIssue: OpenIssue) => ?Moment,
  onStatusChange: (issueId: number, value: number) => void,
  onDateChange: (issueId: number, date: Moment) => void,
  openIssueLastEventDate: ?string,
  validateDate: (
    issueId: number,
    date: Moment,
    openIssue: OpenIssue
  ) => boolean,
  t: Translation,
};

const EditModeIssueBlock = ({
  openIssue,
  openIssueLastEventDate,
  injuryStatuses,
  editedStatuses,
  saving,
  dateValidationErrors,
  isInjuryLockedToOccurrenceDate,
  isFetchingIssueDetails,
  getIssueDate,
  onStatusChange,
  onDateChange,
  validateDate,
  t,
  athleteId,
}: Props) => {
  const isPreliminaryIssue = !openIssue.preliminary_status_complete;

  const getIsOptionWanted = (option: SelectOption) => {
    // User can't select the a status that an injury is already in
    if (option.value === getDefaultStatusId(openIssue, injuryStatuses)) {
      return false;
    }

    const status = injuryStatuses.find((item) => item.id === option.value);

    // User can't resolve a preliminary injury
    if (isPreliminaryIssue && status?.is_resolver) {
      return false;
    }

    return true;
  };

  return (
    <div key={openIssue.id} css={[style.issue, style.issueBlock]}>
      <div css={[style.issueName, { marginLeft: 0 }]}>{openIssue.name}</div>
      <div css={style.editContainer}>
        <div css={style.datePickerContainer}>
          <MovementAwareDatePicker
            athleteId={athleteId}
            value={
              isInjuryLockedToOccurrenceDate ? getIssueDate(openIssue) : null
            }
            onChange={(date: Moment) => {
              onDateChange(openIssue.id, date);
              validateDate(openIssue.id, date, openIssue);
            }}
            disabled={saving || isInjuryLockedToOccurrenceDate}
            disableFuture
            kitmanDesignSystem
            inputLabel=""
            placeholder={t('Date')}
            minDate={
              openIssueLastEventDate ? moment(openIssueLastEventDate) : null
            }
            inclundeAncillaryRanges
          />
        </div>
        <div css={style.statusSelectContainer}>
          <Select
            appendToBody
            placeholder={t('Select status')}
            options={getStatusOptions(injuryStatuses).filter(getIsOptionWanted)}
            value={editedStatuses[openIssue.id] || ''}
            onChange={(value: number) => onStatusChange(openIssue.id, value)}
            isDisabled={saving}
          />
        </div>
      </div>
      {dateValidationErrors[openIssue.id] && (
        <div css={style.validationError}>
          {dateValidationErrors[openIssue.id]}
        </div>
      )}
      {isInjuryLockedToOccurrenceDate && !isFetchingIssueDetails && (
        <div css={style.lockMessage}>
          {t('Date locked to injury occurrence')}
        </div>
      )}
    </div>
  );
};

const EditModeIssueBlockTranslated = withNamespaces()(EditModeIssueBlock);
export default EditModeIssueBlockTranslated;
