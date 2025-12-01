// @flow
import { useSelector, useDispatch } from 'react-redux';
import _get from 'lodash/get';
import type { SelectOption as Option } from '@kitman/components/src/types';
import type { RequestStatus } from '../types';
import { EditTreatmentCardTranslated as EditTreatmentCard } from '../components/TreatmentsTab/components/EditTreatmentCard';
import { useGetTreatmentSessionOptionsQuery } from '../redux/services/medical';
import { useGetAthleteDataQuery } from '../redux/services/medicalShared';
import {
  addTreatmentRow,
  removeAthlete,
  removeTreatmentRow,
  removeAllTreatments,
} from '../redux/actions';
import { formatTreatmentSessionOptionsForSelectComponent } from '../utils';

type Props = {
  athleteId: number,
  isDeleteAthleteDisabled: boolean,
  onClickRemoveAthlete: Function,
  staffUsers: Array<Option>,
};

const EditTreatmentCardContainer = (props: Props) => {
  const dispatch = useDispatch();

  const getEditedAthleteTreatment = (id) => (state) => {
    return _get(state, `treatmentCardList.athleteTreatments.${id}`, {
      athlete_id: null,
      date: '',
      user_id: null,
      start_time: '',
      end_time: '',
      timezone: '',
      title: '',
      treatments_attributes: [],
      annotation_attributes: {
        content: '',
      },
    });
  };
  const editedTreatment = useSelector(
    getEditedAthleteTreatment(props.athleteId)
  );
  const isInvalid = useSelector((state) =>
    state.treatmentCardList.invalidEditTreatmentCards.includes(
      props.athleteId.toString()
    )
  );

  const {
    data: athleteData = null,
    error: getAthleteDataError,
    isLoading: isAthleteDataLoading,
  } = useGetAthleteDataQuery(props.athleteId);

  const {
    data: treatmentSessionOptions = {
      issues_options: [],
      treatable_area_options: [],
      treatment_modality_options: [],
    },
    error: getTreatmentSessionOptionsError,
    isLoading: isTreatmentSessionOptionsLoading,
  } = useGetTreatmentSessionOptionsQuery(props.athleteId);

  const formattedTreatmentSessionOptions =
    formatTreatmentSessionOptionsForSelectComponent(treatmentSessionOptions);

  const getInitialDataRequestStatus = (): RequestStatus => {
    if (getAthleteDataError || getTreatmentSessionOptionsError) {
      return 'FAILURE';
    }
    if (isAthleteDataLoading || isTreatmentSessionOptionsLoading) {
      return 'PENDING';
    }
    return null;
  };

  return (
    <EditTreatmentCard
      {...props}
      athleteId={props.athleteId}
      athleteData={athleteData}
      editedTreatment={editedTreatment}
      initialDataRequestStatus={getInitialDataRequestStatus()}
      isDeleteAthleteDisabled={props.isDeleteAthleteDisabled}
      isInvalid={isInvalid}
      onClickAddTreatment={() => {
        dispatch(addTreatmentRow(props.athleteId));
      }}
      onClickRemoveAthlete={() => {
        props.onClickRemoveAthlete(props.athleteId);
        dispatch(removeAthlete(props.athleteId));
      }}
      onClickRemoveTreatment={(treatmentIndex: number) => {
        dispatch(removeTreatmentRow(props.athleteId, treatmentIndex));
      }}
      onClickRemoveAllTreatments={() => {
        dispatch(removeAllTreatments(props.athleteId));
        dispatch(addTreatmentRow(props.athleteId));
      }}
      staffUsers={props.staffUsers}
      treatmentSessionOptions={formattedTreatmentSessionOptions}
    />
  );
};

export default EditTreatmentCardContainer;
