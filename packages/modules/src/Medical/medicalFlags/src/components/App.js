// @flow
import { useState, useEffect, useRef, useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import type { ComponentType } from 'react';

import { AppStatus, DelayedLoadingFeedback, TabBar } from '@kitman/components';
import { getAthleteData } from '@kitman/services';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import { usePermissions } from '@kitman/common/src/contexts/PermissionsContext';
import useHistoryGo from '@kitman/common/src/hooks/useHistoryGo';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { useMedicalFlag } from '@kitman/modules/src/Medical/shared/contexts/MedicalFlagContext';
import type { RequestStatus } from '@kitman/modules/src/Medical/shared/types';
import Toasts from '@kitman/modules/src/Medical/shared/containers/Toasts';
import ArchiveMedicalFlagContainer from '@kitman/modules/src/Medical/shared/components/AllergiesTab/components/ArchiveMedicalFlagModal/ArchiveMedicalFlagContainer';
import MedicalFlagOverviewTab from '@kitman/modules/src/Medical/medicalFlags/src/components/MedicalFlagOverviewTab';
import { AppHeaderTranslated as AppHeader } from '@kitman/modules/src/Medical/medicalFlags/src/components/AppHeader';

type Props = {};

const App = (props: I18nProps<Props>) => {
  const { medicalFlag } = useMedicalFlag();
  const { permissions } = usePermissions();
  const historyGo = useHistoryGo();

  const [requestStatus, setRequestStatus] = useState<RequestStatus>('PENDING');
  const [athleteData, setAthleteData] = useState<AthleteData>({});
  const [archiveModalOpen, setArchiveModalOpen] = useState<boolean>(false);

  useEffect(() => {
    getAthleteData(medicalFlag.athlete_id).then(
      (fetchedAthleteData) => {
        setAthleteData(fetchedAthleteData);
        setRequestStatus('SUCCESS');
      },
      () => setRequestStatus('FAILURE')
    );
  }, []);

  const archiveRedirect = () => {
    // Im assuming this is desired behavior.
    // We could also try to update the request status state of MedicalFlagDetails to show its loading?
    setTimeout(() => historyGo(-1), 3000);
  };

  const tabPanes = useMemo(() =>
    [
      {
        title: props.t('Overview'),
        content: <MedicalFlagOverviewTab />,
        tabHash: '#medical_flag_overview',
        visible:
          permissions.medical.allergies.canView ||
          permissions.medical.alerts.canView,
      },
    ]
      .filter((tab) => tab.visible)
      .map((tab, index) => ({ ...tab, tabKey: index.toString() }))
  );

  // On first render, show the tab associated to the location hash
  const initialTab = useRef(
    tabPanes.find((tabPane) => tabPane.tabHash === window.location.hash)
      ?.tabKey || '0'
  );

  if (requestStatus === 'PENDING') {
    return <DelayedLoadingFeedback />;
  }

  if (requestStatus === 'FAILURE') {
    return <AppStatus status="error" />;
  }

  return (
    <div className="medicalFlag__medicalProfile">
      <AppHeader
        athleteData={athleteData}
        medicalFlag={medicalFlag}
        archiveMedicalFlag={() => {
          setArchiveModalOpen(true);
        }}
      />
      <TabBar
        customStyles=".rc-tabs-bar { padding: 0 24px; background-color:#ffffff }, .rc-tabs-tabpane { position: relative }"
        tabPanes={tabPanes.map((tabPane) => ({
          title: tabPane.title,
          content: tabPane.content,
        }))}
        initialTab={initialTab.current}
        kitmanDesignSystem
      />
      <Toasts />
      <ArchiveMedicalFlagContainer
        {...props}
        isOpen={archiveModalOpen}
        selectedMedicalFlag={medicalFlag}
        onClose={() => setArchiveModalOpen(false)}
        onPressEscape={() => setArchiveModalOpen(false)}
        setRequestStatus={setRequestStatus}
        enableReloadData={archiveRedirect}
      />
    </div>
  );
};

export const AppTranslated: ComponentType<Props> = withNamespaces()(App);
export default App;
