// @flow
import moment from 'moment';
import { useState, useEffect } from 'react';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import { TextButton, DatePicker, SegmentedControl } from '@kitman/components';
import { withNamespaces } from 'react-i18next';
import { colors } from '@kitman/common/src/variables';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';

import { useResolveChronicIssueQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import {
  formatStandard,
  dateTransferFormat,
} from '@kitman/common/src/utils/dateFormatter';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { IssueHeaderTranslated as IssueHeader } from '../IssueHeader';
import { IssueDetailsTranslated as IssueDetails } from '../IssueDetails';
import { EventDetailsTranslated as EventDetails } from '../EventDetails';
import { ChronicOccurrencesTranslated as ChronicOccurrences } from '../ChronicOccurrences';
import { WorkersCompTranslated as WorkersComp } from '../WorkersComp';
import { OshaCardTranslated as OshaCard } from '../OshaCard';
import { useIssue } from '../../../../shared/contexts/IssueContext';
import MedicalSidePanels from '../../../../shared/containers/MedicalSidePanels';

const style = {
  issueTab: {
    display: 'flex',
  },
  mainContent: {
    flex: 1,
    marginRight: '1.14em',

    '> section': {
      marginBottom: '1.14em',
    },
  },
  sidebar: {
    maxWidth: '31em',
    minWidth: '31em',
  },
  sectionLoader: {
    top: 0,
    height: '0.28em',
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    width: '100%',
  },
  section: {
    backgroundColor: colors.white,
    border: `0.071em solid ${colors.neutral_300}`,
    borderRadius: '0.21em',
    padding: '1.7em',
    marginBottom: '1.14em',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1.14em',
    h2: {
      color: colors.grey_300,
      fontWeight: 600,
      fontSize: '1.42em',
      lineHeight: '1.7em',
    },
  },
  list: {
    listStyleType: 'none',
    padding: 0,
    marginBottom: 0,
    marginTop: '1.7em',
  },
  chronicIssueStatusInfo: {
    h6: {
      fontSize: '0.85em',
      color: colors.grey_100,
    },
  },
  actions: {
    display: 'flex',
    button: {
      '&:not(:last-of-type)': {
        marginRight: '0.33em',
      },
    },
  },
  datePicker: {
    marginTop: '1.2em',
    padding: '1em',
    border: `0.07em solid ${colors.neutral_400}`,
    borderRight: 'none',
    borderLeft: `0.15em solid ${colors.neutral_400}`,
    fontWeight: 600,
    color: colors.grey_100,
  },
};

type Props = {
  athleteId: number,
  athleteData: AthleteData,
  reloadData: (boolean) => void,
  issueId: string | null,
  isMedicalFilePanelOpen: boolean,
  setIsMedicalFilePanelOpen: (boolean) => void,
};

const getCurrentStatus = (resolvedDate) => {
  return !resolvedDate ? 'active' : 'resolved';
};

const ChronicIssueTab = (props: I18nProps<Props>) => {
  const { issue, updateIssue, isReadOnly } = useIssue();
  const { permissions } = usePermissions();
  const [inEditMode, setInEditMode] = useState(false);
  const [currentStatusButton, setCurrentStatusButton] = useState<
    'active' | 'resolved'
  >(getCurrentStatus(issue.resolved_date));
  const [resolutionDate, setResolutionDate] = useState(
    issue.resolved_date || null
  );
  const [resolveChronicIssue, setResolveChronicIssue] = useState(false);

  const {
    data: resolveChronicIssueData = null,
    isLoading: isResolveChronicIssueLoading,
  } = useResolveChronicIssueQuery(
    {
      athleteId: issue.athlete_id,
      issueId: issue.id,
      resolving: currentStatusButton === 'resolved',
      resolved_date: moment(resolutionDate).format(dateTransferFormat),
    },
    {
      skip: !resolveChronicIssue,
    }
  );

  useEffect(() => {
    if (resolveChronicIssueData) {
      setInEditMode(false);
      setResolveChronicIssue(false);
      updateIssue({
        ...issue,
        resolved_date: resolveChronicIssueData.resolved_date,
        resolved_at: resolveChronicIssueData.resolved_at,
        resolved_by: resolveChronicIssueData.resolved_by,
      });
      if (currentStatusButton === 'active') {
        setResolutionDate(null);
      }
    }
  }, [resolveChronicIssueData]);

  const onDiscardChanges = () => {
    setInEditMode(false);
    setCurrentStatusButton(getCurrentStatus(issue.resolved_date));
    setResolutionDate(issue.resolved_date);
  };

  const getActionButtons = () => {
    if (!permissions.medical.issues.canEdit || isReadOnly) {
      return null;
    }

    return inEditMode ? (
      <div css={style.actions} data-testid="AddAvailabilityEventsForm|Actions">
        <TextButton
          text={props.t('Discard changes')}
          type="subtle"
          onClick={onDiscardChanges}
          kitmanDesignSystem
        />

        <TextButton
          text={props.t('Save')}
          type="primary"
          onClick={() => {
            setResolveChronicIssue(true);
          }}
          isLoading={isResolveChronicIssueLoading}
          isDisabled={
            (currentStatusButton === 'resolved' && resolutionDate === null) ||
            currentStatusButton === getCurrentStatus(issue.resolved_date)
          }
          kitmanDesignSystem
        />
      </div>
    ) : (
      <TextButton
        text={props.t('Edit')}
        onClick={() => setInEditMode(true)}
        testId="edit-status-btn"
        type="secondary"
        kitmanDesignSystem
      />
    );
  };

  const getChronicIssueStatusInfo = () => {
    return inEditMode ? (
      <div css={style.chronicIssueStatusInfo}>
        <h6>{props.t('Current status')}</h6>
        <SegmentedControl
          buttons={[
            { name: props.t('Active'), value: 'active' },
            { name: props.t('Resolved'), value: 'resolved' },
          ]}
          maxWidth={130}
          onClickButton={(id) => {
            setCurrentStatusButton(id);
            setResolutionDate(null);
          }}
          color={colors.grey_200}
          selectedButton={currentStatusButton}
        />
        {currentStatusButton === 'resolved' && (
          <div id="resolution-date" css={style.datePicker}>
            <DatePicker
              label={props.t('Date of resolution')}
              value={resolutionDate}
              minDate={issue.occurrence_date}
              onDateChange={(value) => setResolutionDate(value)}
              invalid={
                currentStatusButton === 'resolved' && resolutionDate === null
              }
              kitmanDesignSystem
            />
          </div>
        )}
      </div>
    ) : (
      <ul css={style.list}>
        <li key="status">
          <strong>{props.t('Current status')}:</strong>{' '}
          {getCurrentStatus(issue.resolved_date) === 'resolved'
            ? props.t('Resolved')
            : props.t('Active')}
        </li>
        {getCurrentStatus(issue.resolved_date) === 'resolved' && (
          <>
            <li key="resolution-date">
              <strong>{props.t('Date of resolution')}:</strong>{' '}
              {formatStandard({ date: moment(issue.resolved_date) })}
            </li>
          </>
        )}
        {issue.resolved_at && (
          <li key="updated-date">
            <strong>{props.t('Updated on')}:</strong>{' '}
            {formatStandard({ date: moment(issue.resolved_at) })}
          </li>
        )}
        {issue.resolved_by && (
          <li key="updated-by">
            <strong>{props.t('Updated by')}:</strong>{' '}
            {issue.resolved_by.fullname}
          </li>
        )}
      </ul>
    );
  };

  const renderStatusPane = () => (
    <section css={style.section} data-testid="ChronicIssueStatus">
      <header css={style.header}>
        <h2>{props.t('Status')}</h2>
        {getActionButtons()}
      </header>
      {getChronicIssueStatusInfo()}
    </section>
  );

  return (
    <div css={style.issueTab}>
      <div css={style.mainContent}>
        <IssueHeader onEnterEditMode={() => {}} editActionDisabled={false} />
        <IssueDetails onEnterEditMode={() => {}} editActionDisabled={false} />
        <EventDetails onEnterEditMode={() => {}} editActionDisabled={false} />
      </div>
      <div css={style.sidebar}>
        {(window.featureFlags['workers-comp'] ||
          window.getFlag('pm-mls-emr-demo-froi')) &&
          issue.workers_comp &&
          permissions.medical.workersComp.canView && <WorkersComp />}
        {window.featureFlags['osha-form'] &&
          issue.osha &&
          permissions.medical.osha.canView && <OshaCard />}
        {window.featureFlags['chronic-conditions-resolution'] &&
          permissions.medical.issues.canView &&
          renderStatusPane()}
        <ChronicOccurrences />
        <MedicalSidePanels
          athleteId={props.athleteId}
          athleteData={props.athleteData}
          issueId={props.issueId}
          reloadAthleteData={props.reloadData}
          isMedicalFilePanelOpen={props.isMedicalFilePanelOpen}
          setIsMedicalFilePanelOpen={props.setIsMedicalFilePanelOpen}
        />
      </div>
    </div>
  );
};

export default ChronicIssueTab;
export const ChronicIssueTabTranslated = withNamespaces()(ChronicIssueTab);
