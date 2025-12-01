// @flow
import { useSelector, useDispatch } from 'react-redux';
import {
  closeAddConcussionTestResultsSidePanel,
  addToast,
  updateToast,
  removeToast,
} from '../redux/actions';
import { AddConcussionTestResultsSidePanelTranslated as AddConcussionTestResultsSidePanel } from '../components/AddConcussionTestResultsSidePanel';
import {
  useGetSquadAthletesQuery,
  useGetExaminerUsersQuery,
  useGetConcussionFormTypesQuery,
} from '../redux/services/medical';
import useSquadAthletesSelectOptions from '../hooks/useSquadAthletesSelectOptions';

type Props = {
  athleteId: ?number,
  onAssessmentAdded?: Function,
};

const AddConcussionTestResultsSidePanelContainer = (props: Props) => {
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (state) => state.addConcussionTestResultsSidePanel.isOpen
  );
  const isAthleteSelectable = useSelector((state) => {
    return state.addConcussionTestResultsSidePanel.initialInfo
      .isAthleteSelectable;
  });

  const testProtocol = useSelector((state) => {
    return state.addConcussionTestResultsSidePanel.initialInfo.testProtocol;
  });

  const {
    data: squadAthletes = { squads: [] },
    error: squadAthletesError,
    isLoading: isSquadAthletesLoading,
  } = useGetSquadAthletesQuery(
    { athleteList: true }, // Can use minimal athlete data
    { skip: !isOpen }
  );

  const formGroup = testProtocol === 'KING-DEVICK' ? 'king_devick' : 'npc';

  const {
    data: examinerUsers = [],
    error: examinerUsersError,
    isLoading: isExaminerUsersLoading,
  } = useGetExaminerUsersQuery(formGroup, { skip: !isOpen });

  const {
    data: formTypes = [],
    error: formTypesError,
    isLoading: isFormTypesLoading,
  } = useGetConcussionFormTypesQuery({ group: formGroup }, { skip: !isOpen });

  const athletesSelectOptions = useSquadAthletesSelectOptions({
    isAthleteSelectable,
    squadAthletes,
  });

  const getInitialDataRequestStatus = () => {
    if (squadAthletesError || examinerUsersError || formTypesError) {
      return 'FAILURE';
    }
    if (
      isSquadAthletesLoading ||
      isExaminerUsersLoading ||
      isFormTypesLoading
    ) {
      return 'PENDING';
    }
    return 'SUCCESS';
  };

  return (
    <AddConcussionTestResultsSidePanel
      athleteId={props.athleteId}
      isOpen={isOpen}
      testProtocol={testProtocol}
      formTypes={formTypes
        .filter((formType) => formType.enabled === true)
        ?.map((formType) => ({
          name: formType.name,
          value: formType.key,
        }))}
      examiners={examinerUsers.map((user) => ({
        label: user.fullname,
        value: user.id,
      }))}
      isAthleteSelectable={isAthleteSelectable}
      squadAthletes={athletesSelectOptions}
      initialDataRequestStatus={getInitialDataRequestStatus()}
      onClose={() => dispatch(closeAddConcussionTestResultsSidePanel())}
      onFileUploadStart={(fileName, fileSize, fileId) =>
        dispatch(
          addToast({
            title: fileName,
            description: fileSize,
            status: 'LOADING',
            id: fileId,
          })
        )
      }
      onFileUploadSuccess={(fileId) => {
        dispatch(updateToast(fileId, { status: 'SUCCESS' }));
        setTimeout(() => dispatch(removeToast(fileId)), 5000);
      }}
      onFileUploadFailure={(fileId) =>
        dispatch(updateToast(fileId, { status: 'ERROR' }))
      }
      onAssessmentAdded={(assessmentProtocol) => {
        props.onAssessmentAdded?.(
          assessmentProtocol === 'NPC' ? 'npc' : 'king_devick'
        );
      }}
    />
  );
};

export default AddConcussionTestResultsSidePanelContainer;
