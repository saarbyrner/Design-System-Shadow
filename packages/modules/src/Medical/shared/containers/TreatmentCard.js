// @flow
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import type { PatchTreatment } from '@kitman/services/src/services/medical/patchTreatment';
import patchTreatment from '@kitman/services/src/services/medical/patchTreatment';
import type { TreatmentSession, RequestStatus, Treatment } from '../types';
import { TreatmentCardTranslated as TreatmentCard } from '../components/TreatmentsTab/components/TreatmentCard';
import {
  openSelectAthletesSidePanel,
  openAddTreatmentsSidePanel,
} from '../redux/actions';

type Props = {
  onClickReplicateTreatment: Function,
  treatment: TreatmentSession,
  showAthleteInformation: boolean,
};

const TreatmentCardContainer = (props: Props) => {
  const dispatch = useDispatch();
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(null);
  const [localTreatment, setLocalTreatment] = useState(props.treatment);
  const [isEditing, setIsEditing] = useState(false);

  const updateTreatment = (newTreatments: Array<Treatment>) => {
    setLocalTreatment({
      ...props.treatment,
      treatments: newTreatments,
    });
  };

  const handleSaveTreatment = (treatmentToPatch: Array<PatchTreatment>) => {
    setRequestStatus('PENDING');

    const promises = treatmentToPatch.map((treatment) => {
      return patchTreatment(treatment.id, treatment);
    });

    Promise.all(promises).then(
      (response) => {
        updateTreatment(response);
        setRequestStatus(null);
        setIsEditing(false);
      },
      () => {
        setLocalTreatment(props.treatment);
        setRequestStatus('FAILURE');
      }
    );
  };

  return (
    <TreatmentCard
      {...props}
      treatment={localTreatment}
      requestStatus={requestStatus}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      onClickReplicateTreatment={(selectedTreatment) => {
        props.onClickReplicateTreatment(selectedTreatment);
        dispatch(openSelectAthletesSidePanel());
      }}
      onClickDuplicateTreatment={(selectedTreatment) => {
        dispatch(
          openAddTreatmentsSidePanel({
            isAthleteSelectable: true,
            isDuplicatingTreatment: true,
            duplicateTreatment: selectedTreatment,
          })
        );
      }}
      onClickSaveTreatment={handleSaveTreatment}
    />
  );
};

export default TreatmentCardContainer;
