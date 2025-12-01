// @flow
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { TreatmentFilter, RequestStatus } from '../types';
import { TreatmentFiltersTranslated as TreatmentFilters } from '../components/TreatmentsTab/components/TreatmentFilters';
import {
  clearSelectedTreatments,
  openAddTreatmentsSidePanel,
  validateEditTreatmentCards,
  exportRosterBilling,
  removeAllTreatments,
  addTreatmentRow,
} from '../redux/actions';
import {
  useGetSquadsQuery,
  useGetSquadAthletesQuery,
} from '../redux/services/medical';

type Props = {
  canSelectAthlete: boolean,
  filter: TreatmentFilter,
  isReviewMode: boolean,
  isExporting: boolean,
  onChangeFilter: Function,
  onClickCancelReviewing: Function,
  onClickDownloadTreatment: Function,
  onExportTreatmentBilling: Function,
  onClickSaveReviewing: Function,
  showDownloadTreatments: boolean,
  hiddenFilters?: Array<string>,
};

const TreatmentFiltersContainer = (props: Props) => {
  const dispatch = useDispatch();
  const isTreatmentsTab = window.location.hash === '#treatments';
  const reviewedTreatments = useSelector(
    (state) => state.treatmentCardList.athleteTreatments
  );
  const allEditedCardsValid = useSelector(
    (state) => state.treatmentCardList.invalidEditTreatmentCards.length === 0
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    // if all edited treatment cards are valid and save has been clicked
    // then call props.onClickSaveReviewing which handles save req
    if (allEditedCardsValid && hasSubmitted) {
      props.onClickSaveReviewing(reviewedTreatments);
    }

    // need to reset hasSubmitted to false after each click so that it can
    // be clicked + validated again
    if (hasSubmitted) setHasSubmitted(false);
  }, [allEditedCardsValid, hasSubmitted]);

  const {
    data: squads = [],
    error: getSquadsError,
    isLoading: areSquadsLoading,
  } = useGetSquadsQuery({
    skip: !isTreatmentsTab,
  });

  const {
    data: squadAthletes = { squads: [] },
    error: squadAthletesError,
    isLoading: isSquadAthletesLoading,
  } = useGetSquadAthletesQuery(
    { athleteList: true }, // Can use minimal athlete data
    {
      skip: !isTreatmentsTab,
    }
  );

  const getInitialDataRequestStatus = (): RequestStatus => {
    if (getSquadsError || squadAthletesError) {
      return 'FAILURE';
    }
    if (areSquadsLoading || isSquadAthletesLoading) {
      return 'PENDING';
    }
    return null;
  };

  return (
    <TreatmentFilters
      hiddenFilters={props.hiddenFilters}
      filter={props.filter}
      canSelectAthlete={props.canSelectAthlete}
      isReviewMode={props.isReviewMode}
      isExporting={props.isExporting}
      showDownloadTreatments={props.showDownloadTreatments}
      squads={squads.map(({ id, name }) => ({
        value: id,
        label: name,
      }))}
      squadAthletes={squadAthletes.squads.map((squad) => ({
        label: squad.name,
        options: squad.athletes.map((athlete) => ({
          label: athlete.fullname,
          value: athlete.id,
        })),
      }))}
      initialDataRequestStatus={getInitialDataRequestStatus()}
      onChangeFilter={props.onChangeFilter}
      onClickAddTreatment={() =>
        dispatch(
          openAddTreatmentsSidePanel({
            isAthleteSelectable: false,
            isDuplicatingTreatment: false,
          })
        )
      }
      onClickCancelReviewing={() => {
        props.onClickCancelReviewing();
        dispatch(clearSelectedTreatments());
      }}
      onClickDownloadTreatment={props.onClickDownloadTreatment}
      onClickExportRosterBilling={() => {
        props.onExportTreatmentBilling();
        dispatch(exportRosterBilling());
      }}
      onClickSaveReviewing={() => {
        setHasSubmitted(true);
        dispatch(validateEditTreatmentCards());
      }}
      onClickRemoveAllModalities={() => {
        const athletedIds = Object.keys(reviewedTreatments);

        athletedIds.forEach((id) => {
          dispatch(removeAllTreatments(parseInt(id, 10)));
          dispatch(addTreatmentRow(parseInt(id, 10)));
        });
      }}
    />
  );
};

export default TreatmentFiltersContainer;
