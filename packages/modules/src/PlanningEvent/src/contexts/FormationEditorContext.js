// @flow
import React from 'react';
import type { Dispatch } from 'redux';
import type { OrganisationFormat } from '@kitman/services/src/services/planning/getOrganisationFormats';
import type {
  FormationCoordinates,
  Formation,
  Field,
  UpdatePosition,
} from '@kitman/common/src/types/PitchView';

export type InitialState = {
  field: Field,
  selectedGameFormat: OrganisationFormat,
  selectedFormation: Formation,
  formationCoordinates: FormationCoordinates,
  formationCoordinatesCopy: FormationCoordinates,
  isLoading: boolean,
  formationsGroupedByGameFormat: { [key: number]: Array<Formation> },
  activeCoordinateId?: string,
  highlightPositionId?: number,
  updateList: {
    undo: Array<UpdatePosition>,
    redo: Array<UpdatePosition>,
  },
  isSavingFormation: boolean,
};

export type FormationEditorState = {
  state: InitialState,
  dispatch: Dispatch,
};

export const initialState: InitialState = {
  field: {
    id: 0,
    name: '',
    width: 0,
    height: 0,
    columns: 0,
    rows: 0,
    cellSize: 0,
  },
  formations: [],
  selectedFormation: {},
  selectedGameFormat: {},
  formationCoordinates: {},
  gameFormats: [],
  isLoading: false,
  updateList: {
    undo: [],
    redo: [],
  },
  formationsGroupedByGameFormat: {},
  activeCoordinateId: undefined,
  highlightPositionId: undefined,
  formationCoordinatesCopy: {},
  isSavingFormation: false,
};

const FormationEditorContext = React.createContext<FormationEditorState>({
  dispatch: () => {},
  state: initialState,
});

export default FormationEditorContext;
