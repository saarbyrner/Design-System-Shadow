// @flow
import { useDispatch } from 'react-redux';
import type { AthleteData } from '@kitman/services/src/services/getAthleteData';
import { openAddDiagnosticSidePanel } from '@kitman/modules/src/Medical/shared/redux/actions';
import { DiagnosticsTabTranslated as DiagnosticsTab } from '../components/DiagnosticsTab';
import { useGetDiagnosticReasonsQuery } from '../redux/services/medical';
import {
  openAddDiagnosticAttachmentSidePanel,
  openAddDiagnosticLinkSidePanel,
} from '../redux/actions/index';

type Props = {
  reloadData: boolean,
  athleteExternalId?: string,
  athleteData?: AthleteData,
  contentLoaded?: boolean,
  hiddenFilters?: ?Array<string>,
  athleteId?: number,
};

const DiagnosticTabContainer = (props: Props) => {
  const dispatch = useDispatch();

  const {
    data: diagnosticReasons = { diagnostic_reasons: [] },
    error: diagnosticReasonsError,
    isLoading: diagnosticReasonsLoading,
  } = useGetDiagnosticReasonsQuery('diagnostic');

  const sortedReasons: Array<{
    value: number,
    label: string,
    isInjuryIllness: boolean,
  }> = diagnosticReasons?.diagnostic_reasons
    ?.map(({ id, name, injury_illness_required: isInjuryIllness }) => ({
      value: id,
      label: name,
      isInjuryIllness,
    }))
    .sort((a, b) => {
      const lowercaseA = a.label.toLowerCase();
      const lowercaseB = b.label.toLowerCase();
      return lowercaseA.localeCompare(lowercaseB);
    });
  const getInitialDataRequestStatus = () => {
    if (diagnosticReasonsError) {
      return 'FAILURE';
    }
    if (diagnosticReasonsLoading) {
      return 'PENDING';
    }
    return null;
  };

  return (
    <DiagnosticsTab
      {...props}
      initialDataRequestStatus={getInitialDataRequestStatus()}
      diagnosticReasons={sortedReasons}
      openAddDiagnosticAttachmentSidePanel={({ diagnosticId, athleteId }) => {
        dispatch(
          openAddDiagnosticAttachmentSidePanel({ diagnosticId, athleteId })
        );
      }}
      openAddDiagnosticLinkSidePanel={({ diagnosticId, athleteId }) => {
        dispatch(openAddDiagnosticLinkSidePanel({ diagnosticId, athleteId }));
      }}
      openAddDiagnosticSidePanel={({
        diagnosticId,
        isAthleteSelectable,
        athleteId,
      }) => {
        dispatch(
          openAddDiagnosticSidePanel({
            isAthleteSelectable,
            diagnosticId,
            athleteId,
          })
        );
      }}
    />
  );
};

export default DiagnosticTabContainer;
