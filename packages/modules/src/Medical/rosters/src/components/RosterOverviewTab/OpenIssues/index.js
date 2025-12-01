// @flow
import { useEffect, useState, useCallback, useMemo } from 'react';
import moment, { Moment } from 'moment';
import { withNamespaces } from 'react-i18next';

import { TextButton } from '@kitman/components';
import ConfirmationModal from '@kitman/playbook/components/ConfirmationModal';
import { getInjuryStatuses } from '@kitman/services';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import createIssueEvent from '@kitman/services/src/services/medical/createIssueEvent';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { OpenIssue } from '@kitman/modules/src/Medical/rosters/types';
import getOpenIssuesForAthlete from '@kitman/modules/src/Medical/rosters/src/services/getOpenIssuesForAthlete';
import getAthleteIssues from '@kitman/services/src/services/medical/getAthleteIssue';
import type { IssueType } from '@kitman/modules/src/Medical/shared/types';
import { hideToast } from '@kitman/modules/src/vanillaToasts/toast';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import Issue from './Issue';
import EditModeIssueBlock from './EditModeIssueBlock';
import LoadingOverlay from './LoadingOverlay';
import ConfirmationDialogContent from './ConfirmationDialogContent';
import { style } from './style';
import { checkAllUpdatesCompleted } from './utils';

type Props = {
  athleteId: string,
  athleteName: string,
  athleteAvatarUrl: string,
  openIssues: Array<OpenIssue>,
  hasMore: boolean,
  isEditing?: boolean,
  onCancelEdit?: () => void,
  onSaved?: () => void,
};

const OpenIssues = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const { onCancelEdit, t, athleteId, onSaved } = props;
  const [issues, setIssues] = useState(props.openIssues);
  const [hasMore, setHasMore] = useState(props.hasMore);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [injuryStatuses, setInjuryStatuses] = useState([]);
  const [saving, setSaving] = useState(false);
  const [editedStatuses, setEditedStatuses] = useState({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [changeStatuses, setChangeStatuses] = useState({});
  const [changeErrors, setChangeErrors] = useState({});
  const [editedDates, setEditedDates] = useState({});
  const [dateValidationErrors, setDateValidationErrors] = useState({});
  const [detailedInjuries, setDetailedInjuries] = useState({});
  const [loadingDetailedData, setLoadingDetailedData] = useState(false);

  const loadMoreIssues = () => {
    setErrorMessage(undefined);
    setLoading(true);
    getOpenIssuesForAthlete(athleteId)
      .then((data) => {
        setErrorMessage(undefined);
        setIssues(data.issues);
        setHasMore(false);
      })
      .catch(() =>
        setErrorMessage(t('Something went wrong loading athlete issues'))
      )
      .finally(() => setLoading(false));
  };

  const availability = (isUnavailable: boolean): string =>
    isUnavailable ? 'unavailable' : 'available';

  const fetchDetailedInjury = useCallback(
    async (injuryId: number, injuryType: IssueType) => {
      try {
        const response = await getAthleteIssues(
          +athleteId,
          injuryId,
          injuryType
        );
        return response;
      } catch (error) {
        return null;
      }
    },
    [athleteId]
  );

  const getIssueDate = useCallback(
    (openIssue: OpenIssue): ?Moment => {
      const detailedInjury = detailedInjuries[openIssue.id];
      if (detailedInjury && detailedInjury.occurrence_date) {
        return moment(detailedInjury.occurrence_date);
      }
      return null;
    },
    [detailedInjuries]
  );

  const getInjuryIsLockedToOccurrenceDate = useCallback(
    (openIssue: OpenIssue) => {
      const detailedInjury = detailedInjuries[openIssue.id];
      return !detailedInjury?.events || detailedInjury?.events?.length === 0;
    },
    [detailedInjuries]
  );

  const getIsPreliminaryIssue = useCallback((openIssue: OpenIssue) => {
    return !openIssue.preliminary_status_complete;
  }, []);

  const validateDate = (
    issueId: number,
    selectedDate: Moment,
    openIssue: OpenIssue
  ): boolean => {
    // Clear any existing validation error for this issue
    setDateValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[issueId];
      return newErrors;
    });

    if (!selectedDate) {
      return true; // Allow empty dates to be handled by form validation
    }

    const currentInjuryDate = getIssueDate(openIssue);
    const selectedMoment = moment(selectedDate);

    if (
      selectedMoment.isSame(currentInjuryDate, 'day') &&
      !openIssue.preliminary_status_complete
    ) {
      setDateValidationErrors((prev) => ({
        ...prev,
        [issueId]: t(
          'You cannot select the same date as the current injury date'
        ),
      }));
      return false;
    }

    return true;
  };

  const handleStatusChange = useCallback((issueId: number, value: number) => {
    setEditedStatuses((prev) => ({ ...prev, [issueId]: value }));
  }, []);

  const handleDateChange = useCallback((issueId: number, date: Moment) => {
    setEditedDates((prev) => ({ ...prev, [issueId]: date }));
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditedStatuses({});
    setEditedDates({});
    setDateValidationErrors({});
    setDetailedInjuries({});
    setLoadingDetailedData(false);
    if (onCancelEdit) onCancelEdit();
  }, [onCancelEdit]);

  const handleModalCancel = useCallback(() => {
    setIsConfirmOpen(false);
    setChangeStatuses({});
    setChangeErrors({});
  }, []);

  const getIsValidForm = useCallback(() => {
    if (!props.isEditing) return false;

    // Check if any status has been selected
    const statusChanges = Object.keys(editedStatuses).filter((issueId) => {
      return !!editedStatuses[issueId]; // Only include if a status is selected
    });

    if (statusChanges.length === 0) {
      return false;
    }

    // Check if at least one issue is complete and valid
    const hasAtLeastOneValidChange = statusChanges.some((issueId) => {
      const hasStatus = !!editedStatuses[issueId];
      const issue = issues.find((i) => String(i.id) === String(issueId));
      const hasDate =
        !!editedDates[issueId] || (issue && !getIsPreliminaryIssue(issue));
      const hasNoValidationError = !dateValidationErrors[issueId];
      return hasStatus && hasDate && hasNoValidationError;
    });

    return hasAtLeastOneValidChange;
  }, [
    props.isEditing,
    editedStatuses,
    dateValidationErrors,
    editedDates,
    getIsPreliminaryIssue,
    issues,
  ]);

  const getPendingChanges = () => {
    return Object.entries(editedStatuses)
      .map(([issueId, newStatusId]) => {
        if (!newStatusId) return null; // Skip if no status selected

        const issue = issues.find((i) => String(i.id) === String(issueId));
        if (!issue) return null;

        const newStatus = injuryStatuses.find((s) => s.id === newStatusId);
        if (!newStatus) return null;

        let selectedDate;
        if (getIsPreliminaryIssue(issue)) {
          selectedDate = getIssueDate(issue);
        } else {
          selectedDate = editedDates[issueId] || moment();
        }
        const dateLabel = formatStandard({ date: selectedDate });

        return {
          issueId,
          issueName: issue.name,
          previousLabel: issue.status,
          newLabel: newStatus.description,
          dateLabel,
        };
      })
      .filter(Boolean)
      .reduce((acc, change) => {
        const changes = { ...acc };
        if (!changes[change.dateLabel]) changes[change.dateLabel] = [];
        changes[change.dateLabel].push(change);
        return changes;
      }, {});
  };

  const saveRowEdits = useCallback(async () => {
    if (saving) return;

    setSaving(true);

    const changesToMake = Object.entries(editedStatuses)
      // We only want to save changes that have a status selected
      .filter(([, statusId]) => !!statusId)
      .map(([issueOccurrenceId, statusId]) => {
        const found = issues.find(
          (i) => String(i.id) === String(issueOccurrenceId)
        );
        if (!found) return null;
        return {
          issueId: issueOccurrenceId,
          statusId,
          issue: found,
        };
      })
      .filter(Boolean);

    const initialStatuses = {};
    changesToMake.forEach(({ issueId }) => {
      initialStatuses[issueId] = 'PENDING';
    });
    setChangeStatuses(initialStatuses);

    try {
      const updatePromises = changesToMake.map(
        async ({ issueId, statusId, issue }) => {
          try {
            let selectedDate;
            if (getIsPreliminaryIssue(issue)) {
              selectedDate = getIssueDate(issue);
            } else {
              selectedDate = editedDates[issueId] || moment();
            }

            await createIssueEvent({
              issue_occurrence_id: parseInt(String(issueId), 10),
              // $FlowFixMe - issue type is either Injury or Illness
              issue_occurrence_type: issue.issue_type.toLowerCase(),
              issue_status_id: parseInt(String(statusId), 10),
              event_date: moment(selectedDate).format('YYYY-MM-DD'),
            });
            setChangeStatuses((prev) => ({
              ...prev,
              [issueId]: 'SUCCESS',
            }));
            return { issueId, success: true };
          } catch (error) {
            // Hide the toast that is being shown by the global error handler under the confirmation modal
            hideToast();
            const errorMsg =
              error?.response?.data?.data[0]?.message ?? t('Unknown error');

            setChangeErrors((prev) => ({
              ...prev,
              [issueId]: errorMsg,
            }));
            setChangeStatuses((prev) => ({
              ...prev,
              [issueId]: 'FAILURE',
            }));
            return { issueId, success: false, error: errorMsg };
          }
        }
      );

      await Promise.allSettled(updatePromises);

      onSaved?.();
    } finally {
      setSaving(false);
    }
  }, [
    saving,
    editedStatuses,
    issues,
    onSaved,
    getIsPreliminaryIssue,
    getIssueDate,
    editedDates,
    t,
  ]);

  const allCompleted = useMemo(() => {
    return checkAllUpdatesCompleted(changeStatuses);
  }, [changeStatuses]);

  const hasSuccessfulUpdates = useMemo(() => {
    return Object.values(changeStatuses).some((status) => status === 'SUCCESS');
  }, [changeStatuses]);

  const hasValidationErrors = useMemo(() => {
    return Object.keys(changeErrors).length > 0;
  }, [changeErrors]);

  const reloadIssues = useCallback(() => {
    setErrorMessage(undefined);
    setLoading(true);
    getOpenIssuesForAthlete(athleteId)
      .then((data) => {
        setErrorMessage(undefined);
        setIssues(data.issues);
        setHasMore(false);
      })
      .finally(() => setLoading(false));
  }, [athleteId]);

  const handleConfirmModal = useCallback(() => {
    if (allCompleted) {
      if (hasValidationErrors) {
        setIsConfirmOpen(false);
        setChangeStatuses({});
        setChangeErrors({});
      } else {
        setIsConfirmOpen(false);
        setChangeStatuses({});
        setChangeErrors({});
        setEditedStatuses({});
        setEditedDates({});
        setDateValidationErrors({});
        setDetailedInjuries({});
        setLoadingDetailedData(false);

        if (hasSuccessfulUpdates) {
          reloadIssues();
        }
      }
    } else {
      // If not started saving yet, proceed with save
      saveRowEdits();
    }
  }, [
    allCompleted,
    hasValidationErrors,
    saveRowEdits,
    hasSuccessfulUpdates,
    reloadIssues,
  ]);

  // We close the modal if all updates are successful
  useEffect(() => {
    if (!isConfirmOpen) return;
    if (!allCompleted) return;
    if (hasValidationErrors) return;

    setIsConfirmOpen(false);
    setChangeStatuses({});
    setChangeErrors({});
    setEditedStatuses({});
    setEditedDates({});
    setDateValidationErrors({});
    setDetailedInjuries({});
    setLoadingDetailedData(false);

    if (hasSuccessfulUpdates) {
      reloadIssues();
    }
  }, [
    isConfirmOpen,
    allCompleted,
    hasValidationErrors,
    hasSuccessfulUpdates,
    reloadIssues,
  ]);

  const getModalTitle = useCallback(() => {
    return hasValidationErrors
      ? t('Status updates')
      : t('Are you sure you want to update the status?');
  }, [hasValidationErrors, t]);

  const getModalCtaButton = useCallback(() => {
    return hasValidationErrors ? t('OK') : t('Update');
  }, [hasValidationErrors, t]);

  const getModalCancelButton = useCallback(() => {
    return hasValidationErrors ? undefined : t('Cancel');
  }, [hasValidationErrors, t]);

  useEffect(() => {
    if (props.isEditing && injuryStatuses.length === 0) {
      getInjuryStatuses()
        .then(setInjuryStatuses)
        .catch(() => {});
    }
  }, [props.isEditing, injuryStatuses.length]);

  useEffect(() => {
    const shouldFetch =
      props.isEditing &&
      issues.length > 0 &&
      (!detailedInjuries || Object.keys(detailedInjuries).length === 0);

    if (!shouldFetch) return;

    setLoadingDetailedData(true);
    const fetchPromises = issues.map(async (issue) => {
      try {
        const detailed = await fetchDetailedInjury(issue.id, issue.issue_type);
        return { issueId: issue.id, data: detailed };
      } catch (error) {
        return { issueId: issue.id, data: null };
      }
    });

    Promise.all(fetchPromises).then((results) => {
      const detailedData = {};
      results.forEach(({ issueId, data }) => {
        if (!data) return;
        detailedData[issueId] = data;
      });
      setDetailedInjuries(detailedData);
      setLoadingDetailedData(false);
    });
  }, [props.isEditing, issues, detailedInjuries, fetchDetailedInjury]);

  useEffect(() => {
    if (
      detailedInjuries &&
      Object.keys(detailedInjuries).length > 0 &&
      Object.keys(editedDates).length === 0
    ) {
      const initialDates = {};
      issues.forEach((issue) => {
        if (!getIsPreliminaryIssue(issue)) return;
        const issueDate = getIssueDate(issue);
        if (!issueDate) return;
        initialDates[issue.id] = issueDate;
      });
      if (!Object.keys(initialDates).length) return;
      setEditedDates(initialDates);
    }
  }, [
    detailedInjuries,
    getIsPreliminaryIssue,
    getIssueDate,
    issues,
    editedDates,
  ]);

  const getOpenIssueLastEventDate = (openIssue: OpenIssue) => {
    if (!detailedInjuries[openIssue.id]) {
      return null;
    }

    const events = detailedInjuries[openIssue.id]?.events;

    return events?.length ? events[events.length - 1].event_date : null;
  };

  return (
    <div css={style.openIssuesCell}>
      <div
        css={[
          style.issuesContainer,
          props.isEditing
            ? style.issuesContainerEditing
            : style.issuesContainerNormal,
        ]}
      >
        {issues.map((openIssue) =>
          props.isEditing && permissions.medical.issues.canEdit ? (
            <EditModeIssueBlock
              key={openIssue.id}
              openIssueLastEventDate={getOpenIssueLastEventDate(openIssue)}
              openIssue={openIssue}
              injuryStatuses={injuryStatuses}
              editedStatuses={editedStatuses}
              isInjuryLockedToOccurrenceDate={getInjuryIsLockedToOccurrenceDate(
                openIssue
              )}
              saving={saving}
              getIssueDate={getIssueDate}
              dateValidationErrors={dateValidationErrors}
              onStatusChange={handleStatusChange}
              onDateChange={handleDateChange}
              validateDate={validateDate}
              athleteId={props.athleteId}
              isFetchingIssueDetails={loadingDetailedData}
            />
          ) : (
            <Issue
              key={openIssue.id}
              athleteId={props.athleteId}
              openIssue={openIssue}
              issueAvailability={availability(openIssue.causing_unavailability)}
              canViewAvailabilities={!!permissions.medical.availability.canView}
            />
          )
        )}
        {hasMore && !loading && (
          <div>
            <TextButton
              type="textOnly"
              size="small"
              text={t('Show all')}
              onClick={() => loadMoreIssues()}
              kitmanDesignSystem
            />
          </div>
        )}
        {issues.length > props.openIssues.length && (
          <div>
            <TextButton
              type="textOnly"
              size="small"
              text={t('Show less')}
              onClick={() => {
                setIssues(props.openIssues);
                setHasMore(true);
              }}
              kitmanDesignSystem
            />
          </div>
        )}
        {loading && (
          <span css={style.loading}>{t('Loading injury/ illness')}</span>
        )}
        {errorMessage && !loading && (
          <span css={style.error}>{errorMessage}</span>
        )}
        {props.isEditing && loadingDetailedData && <LoadingOverlay t={t} />}
        {props.isEditing && permissions.medical.issues.canEdit && (
          <div css={style.buttonContainer}>
            <TextButton
              text={t('Cancel')}
              type="subtle"
              onClick={handleCancelEdit}
              isDisabled={saving}
              kitmanDesignSystem
            />
            <TextButton
              text={t('Update')}
              type="primary"
              onClick={() => setIsConfirmOpen(true)}
              isDisabled={saving || !getIsValidForm()}
              kitmanDesignSystem
            />
          </div>
        )}
      </div>
      {isConfirmOpen && (
        <ConfirmationModal
          isModalOpen
          isLoading={saving}
          onCancel={allCompleted ? undefined : handleModalCancel}
          onClose={handleModalCancel}
          onConfirm={handleConfirmModal}
          translatedText={{
            title: getModalTitle(),
            actions: {
              ctaButton: getModalCtaButton(),
              cancelButton: getModalCancelButton(),
            },
          }}
          dialogContent={(() => {
            return (
              <ConfirmationDialogContent
                athleteName={props.athleteName}
                athleteAvatarUrl={props.athleteAvatarUrl}
                pendingChanges={getPendingChanges()}
                changeStatuses={changeStatuses}
                changeErrors={changeErrors}
                saving={saving}
              />
            );
          })()}
          fullWidth
          maxWidth="sm"
        />
      )}
    </div>
  );
};

export const OpenIssuesTranslated = withNamespaces()(OpenIssues);
export default OpenIssues;
