// @flow
import { useState, useEffect, useMemo, useCallback } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';
import { AppStatus, DelayedLoadingFeedback } from '@kitman/components';
import { getAthleteData } from '@kitman/services';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { TabBar } from '@kitman/playbook/components';
import { MedicalNotesTabTranslated as MedicalNotesTab } from '@kitman/modules/src/Medical/shared/components/MedicalNotesTab';
import { useDiagnostic } from '@kitman/modules/src/Medical/shared/contexts/DiagnosticContext';
import Toasts from '@kitman/modules/src/Medical/shared/containers/Toasts';
import type { RequestStatus } from '@kitman/modules/src/Medical/shared/types';
import {
  TRIAL_ATHLETE_HIDDEN_ELEMENTS,
  SQUADS_FILTER,
} from '@kitman/modules/src/Medical/shared/constants/elementTags';
import DiagnosticOverviewTab from '@kitman/modules/src/Medical/diagnostics/src/components/DiagnosticOverviewTab';
import { AppHeaderTranslated as AppHeader } from '@kitman/modules/src/Medical/diagnostics/src/components/AppHeader';

type Props = {};

const App = (props: I18nProps<Props>) => {
  const { permissions } = usePermissions();
  const { diagnostic } = useDiagnostic();

  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');
  const [athleteData, setAthleteData] = useState<AthleteData>({});
  const [reloadNotes, setReloadNotes] = useState(false);
  const [tabHash, setTabHash] = useState(window.location.hash);

  useEffect(() => {
    setReloadNotes(tabHash === '#medical_notes');
  }, [tabHash]);

  useEffect(() => {
    getAthleteData(diagnostic.athlete.id).then(
      (fetchedAthleteData) => {
        setAthleteData(fetchedAthleteData);
        setRequestStatus('SUCCESS');
      },
      () => setRequestStatus('FAILURE')
    );
  }, []);

  const getHiddenFilters = useCallback(
    (tabSpecificHiddenFilters: Array<string>) => {
      const hiddenFilters = [...tabSpecificHiddenFilters];
      if (athleteData?.constraints?.organisation_status === 'TRIAL_ATHLETE') {
        return hiddenFilters.concat(TRIAL_ATHLETE_HIDDEN_ELEMENTS);
      }
      return hiddenFilters;
    },
    [athleteData]
  );

  const tabPanes = useMemo(() =>
    [
      {
        title: props.t('Diagnostic Overview'),
        content: <DiagnosticOverviewTab hiddenFilters={getHiddenFilters([])} />,
        tabHash: '#diagnostic_overview',
        visible: permissions.medical.diagnostics.canView,
      },
      {
        title: props.t('Notes'),
        content: (
          <MedicalNotesTab
            athleteId={diagnostic.athlete.id}
            reloadData={reloadNotes}
            hiddenFilters={getHiddenFilters([SQUADS_FILTER])}
          />
        ),
        tabHash: '#medical_notes',
        visible: permissions.medical.notes.canView,
      },
    ]
      .filter((tab) => tab.visible)
      .map((tab, index) => ({ ...tab, tabKey: index.toString() }))
  );

  if (requestStatus === 'PENDING') {
    return <DelayedLoadingFeedback />;
  }

  if (requestStatus === 'FAILURE') {
    return <AppStatus status="error" />;
  }

  return (
    <div className="diagnosticMedicalProfile">
      <AppHeader
        athleteData={athleteData}
        diagnosticId={diagnostic.id}
        diagnosticType={diagnostic.type}
      />
      <TabBar
        variant="scrollable"
        tabs={tabPanes}
        value={tabHash || tabPanes[0]?.tabHash}
        onChange={(value) => {
          window.location.replace(value);
          setTabHash(value);
        }}
        customStyles={{
          tabPanelRoot: {
            position: 'relative',
          },
          tabPanel: {
            position: 'relative',
          },
        }}
      />
      <Toasts />
    </div>
  );
};

export const AppTranslated: ComponentType<Props> = withNamespaces()(App);
export default App;
