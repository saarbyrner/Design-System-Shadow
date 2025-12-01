// @flow
import { useEffect, useMemo, useState } from 'react';
import type { Option } from '@kitman/components/src/Select';

import {
  useSearchOrganisationDivisionListQuery,
  useCreateSquadMutation,
  useFetchSquadSettingsQuery,
} from '../services/squadManagement';

import type { Division, ConferenceDivision } from '../types';

export type FormState = {
  name: ?string,
  division_id: ?number,
  start_season: ?string,
  in_season: ?string,
  end_season: ?string,
};

type ReturnType = {
  isLoading: boolean,
  isError: boolean,
  isFormCompleted: boolean,
  formState: FormState,
  teamNameOptions: Array<Option>,
  divisionOptions: Array<Option>,
  conferenceDivisionOptions: Array<Option>,
  selectedDivisionId: ?number,
  onSelectDivision: (divisionId: ?number) => void,
  onSelectConferenceDivision: (divisionId: ?number) => void,
  onUpdateFormState: (partialState: $Shape<FormState>) => void,
  onSave: Function,
};

const initialFormState: FormState = {
  name: null,
  division_id: null,
  start_season: null,
  end_season: null,
  in_season: null,
};

type Props = {
  skip?: ?boolean,
  reset?: ?boolean,
};
/**
 * Recursively finds all "sub" divisions from a starting division.
 */
export const getSubDivisions = (parentDivision: Division): Array<Option> => {
  const leaves: Array<Option> = [];

  // function to collect all sub divisions
  const collectSubDivisions = (division: ConferenceDivision) => {
    const hasNoChildren =
      !division.child_divisions || division.child_divisions.length === 0;

    if (hasNoChildren) {
      leaves.push({ value: division.id, label: division.name });
    } else {
      division.child_divisions.forEach(collectSubDivisions);
    }
  };

  // Start collecting from the parent division
  parentDivision.child_divisions?.forEach(collectSubDivisions);

  return leaves;
};

const useCreateSquad = (props: Props): ReturnType => {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [isFormCompleted, setIsFormCompleted] = useState(false);
  const [selectedDivisionId, setSelectedDivisionId] = useState<?number>(null);
  const [conferenceDivisionOptions, setConferenceDivisionOptions] = useState<
    Array<Option>
  >([]);
  const [selectedConferenceDivisionId, setSelectedConferenceDivisionId] =
    useState<?number>(null);

  const { data: squadGrid, isFetching: isSquadGridFetching } =
    useFetchSquadSettingsQuery();
  const { data: divisionList, isLoading: isDivisionListLoading } =
    useSearchOrganisationDivisionListQuery(null, { skip: props.skip });
  const [createSquad, { isLoading: isCreateSquadLoading }] =
    useCreateSquadMutation();

  const isLoading = [
    isDivisionListLoading,
    isCreateSquadLoading,
    isSquadGridFetching,
  ].some(Boolean);
  const isError = [
    isDivisionListLoading,
    isCreateSquadLoading,
    isSquadGridFetching,
  ].some((e) => e.isError);

  useEffect(() => {
    if (props.reset) {
      setFormState(initialFormState);
      setSelectedDivisionId(null);
      setSelectedConferenceDivisionId(null);
      setConferenceDivisionOptions([]);
    }
  }, [props.reset]);

  const divisionOptions = useMemo<Array<Option>>(() => {
    if (!divisionList) return [];
    return divisionList.map((division) => ({
      label: division.name,
      value: division.id,
    }));
  }, [divisionList]);

  const teamNameOptions = useMemo<Array<Option>>(() => {
    // Derives from divisionList and the selected ID, removing the need for `selectedDivision` state.
    const selectedDivision = divisionList?.find(
      (d) => d.id === selectedDivisionId
    );
    if (!selectedDivision?.squads || !squadGrid) return [];

    const existingSquads = squadGrid.map(({ name }) => name);
    return selectedDivision.squads
      .filter((squad) => !existingSquads.includes(squad))
      .map((squad) => ({ label: squad, value: squad }));
  }, [selectedDivisionId, divisionList, squadGrid]);

  const onUpdateFormState = (partialState: $Shape<FormState>) => {
    setFormState((state) => ({ ...state, ...partialState }));
  };

  const onSelectDivision = (divisionId: ?number) => {
    setSelectedDivisionId(divisionId);
    // Reset conference selection
    setSelectedConferenceDivisionId(null);
    const target = divisionList?.find((d) => d.id === divisionId);

    if (target) {
      onUpdateFormState({
        division_id: target.id,
        start_season: target.markers.start_season,
        in_season: target.markers.in_season,
        end_season: target.markers.end_season,
      });
      // Get all sub divisions from the selected division
      const subDivisions = getSubDivisions(target);
      setConferenceDivisionOptions(subDivisions);
    } else {
      // Handle deselection
      onUpdateFormState(initialFormState);
      setConferenceDivisionOptions([]);
    }
  };

  // Handles selection of a conference division
  const onSelectConferenceDivision = (divisionId: ?number) => {
    setSelectedConferenceDivisionId(divisionId);
    onUpdateFormState({ division_id: divisionId });
  };

  useEffect(() => {
    const hasConference = conferenceDivisionOptions.length > 0;
    // If there are no conference divisions, we don't need to check for a selected conference
    // the form can be completed without it(with division id).
    const isConferenceSelected = hasConference
      ? Boolean(selectedConferenceDivisionId)
      : true;

    setIsFormCompleted(
      Boolean(formState.division_id) &&
        Boolean(formState.name) &&
        Boolean(formState.start_season) &&
        Boolean(formState.end_season) &&
        isConferenceSelected
    );
  }, [formState, conferenceDivisionOptions, selectedConferenceDivisionId]);

  const onSave = () => createSquad(formState);

  return {
    isLoading,
    isError,
    isFormCompleted,
    formState,
    teamNameOptions,
    divisionOptions,
    conferenceDivisionOptions,
    selectedDivisionId,
    onSelectDivision,
    onSelectConferenceDivision,
    onUpdateFormState,
    onSave,
  };
};

export default useCreateSquad;
