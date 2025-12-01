// @flow
import { useEffect } from 'react';
import { getClinicalImpressionsBodyAreas } from '@kitman/services';
import type { Dispatch } from '@kitman/common/src/types';
import type { BodyArea } from '@kitman/services/src/services/medical/clinicalImpressions';
import type { SetState } from '@kitman/common/src/types/react';
import type { RemirrorSetContent } from '@kitman/components/src/richTextEditorAlt';
import { emptyHTMLeditorAltContent } from '@kitman/modules/src/Medical/shared/utils';
import type { FormAction } from './useDiagnosticForm';

type Params = {
  isOpen: boolean,
  athleteId: ?number,
  fetchCurrentUser: () => Promise<void>,
  fetchAthleteData: (athleteId: number) => Promise<void>,
  setBodyAreas: SetState<Array<BodyArea>>,
  dispatch: Dispatch<FormAction>,
  editorRefs: { current: Array<{ setContent: RemirrorSetContent }> },
  setIsValidationCheckAllowed: SetState<boolean>,
};

const useInitSidePanelEffect = ({
  isOpen,
  athleteId,
  fetchCurrentUser,
  fetchAthleteData,
  setBodyAreas,
  dispatch,
  editorRefs,
  setIsValidationCheckAllowed,
}: Params) => {
  useEffect(() => {
    if (isOpen) {
      fetchCurrentUser();
      getClinicalImpressionsBodyAreas().then((bodyAreaData) => {
        setBodyAreas(bodyAreaData);
      });
      dispatch({ type: 'ADD_ANOTHER_BILLABLE_ITEM' });
    }
    if (athleteId) {
      dispatch({ type: 'SET_ATHLETE_ID', athleteId });
      if (isOpen) fetchAthleteData(athleteId);
    }
    if (!isOpen) {
      editorRefs.current?.forEach((ref) => {
        ref?.setContent?.(emptyHTMLeditorAltContent);
      });
      setIsValidationCheckAllowed(false);
      dispatch({ type: 'CLEAR_FORM' });
    }
  }, [athleteId, isOpen]);
};

export default useInitSidePanelEffect;
