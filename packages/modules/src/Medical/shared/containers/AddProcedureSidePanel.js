import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AthleteConstraints from '@kitman/modules/src/Medical/shared/components/AthleteConstraints';
import {
  closeAddProcedureSidePanel,
  addToast,
  updateToast,
  removeToast,
} from '../redux/actions';
import { AddProcedureSidePanelTranslated as AddProcedureSidePanel } from '../components/AddProcedureSidePanel';
import {
  useGetClinicalImpressionsBodyAreasQuery,
  useGetProceduresFormDataQuery,
  useGetOrderProvidersQuery,
  useGetSquadAthletesQuery,
} from '../redux/services/medical';
import useSquadAthletesSelectOptions from '../hooks/useSquadAthletesSelectOptions';

const AddProcedureSidePanelContainer = (props) => {
  const dispatch = useDispatch();
  const [athleteId, setAthleteId] = useState(props.athleteId || null);
  const isOpen = useSelector((state) => state.addProcedureSidePanel?.isOpen);

  const {
    data: bodyAreasData = [],
    error: bodyAreasDataError,
    isLoading: isBodyAreasDataLoading,
  } = useGetClinicalImpressionsBodyAreasQuery(null, { skip: !isOpen });

  const {
    data: proceduresFormData,
    error: proceduresFormDataError,
    isLoading: isProceduresFormDataLoading,
  } = useGetProceduresFormDataQuery(
    { onlyDefaultLocations: true },
    { skip: !isOpen }
  );

  const defaultLocation = proceduresFormData?.locations?.find(
    (obj) => obj.default
  );

  const locationId = props.procedureToUpdate
    ? props.procedureToUpdate?.location?.id
    : defaultLocation?.id;

  const {
    data: orderProviders = [],
    error: orderProvidersError,
    isLoading: orderProvidersLoading,
  } = useGetOrderProvidersQuery(
    { locationId, activeUsersOnly: true, npi: true },
    { skip: !isOpen || !locationId }
  );

  const {
    data: squadAthletes = { squads: [] },
    error: squadAthletesError,
    isLoading: isSquadAthletesLoading,
  } = useGetSquadAthletesQuery({ athleteList: true }, { skip: !isOpen });

  const athletesSelectOptions = useSquadAthletesSelectOptions({
    squadAthletes,
  });

  const getInitialDataRequestStatus = () => {
    if (
      squadAthletesError ||
      proceduresFormDataError ||
      orderProvidersError ||
      bodyAreasDataError ||
      isBodyAreasDataLoading
    ) {
      return 'FAILURE';
    }
    if (
      isSquadAthletesLoading ||
      isProceduresFormDataLoading ||
      orderProvidersLoading
    ) {
      return 'PENDING';
    }
    return null;
  };

  return (
    <AthleteConstraints athleteId={athleteId}>
      {({ organisationStatus }) => (
        <AddProcedureSidePanel
          {...props}
          athleteConstraints={{
            organisationStatus,
          }}
          isOpen={isOpen}
          locationId={locationId}
          squadAthletes={athletesSelectOptions}
          proceduresFormData={proceduresFormData}
          orderProviders={orderProviders}
          bodyAreas={bodyAreasData}
          getInitialDataRequestStatus={getInitialDataRequestStatus()}
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
          onClose={() => dispatch(closeAddProcedureSidePanel())}
          setAthleteId={setAthleteId}
        />
      )}
    </AthleteConstraints>
  );
};

export default AddProcedureSidePanelContainer;
