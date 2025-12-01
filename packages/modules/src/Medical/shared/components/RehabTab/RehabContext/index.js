// @flow
import type { Node } from 'react';
import { useState, createContext, useEffect, useContext } from 'react';
import type { RequestStatus } from '@kitman/common/src/types';
import { getOrganisationVariations } from '@kitman/services';
import type { RehabDispatch } from '../hooks/useRehabReducer';
import type { RehabContextType } from './types';

export const DEFAULT_CONTEXT_VALUE = {
  organisationVariations: {},
  organisationVariationsRequestStatus: 'PENDING',
};

export type RehabContextState = {
  editExerciseIds: Array<number | string>,
  copyExerciseIds: number[],
  groupExerciseIds: number[],
  linkExerciseIds: number[],
  dispatch: RehabDispatch,
};

const RehabContext = createContext<RehabContextType>(DEFAULT_CONTEXT_VALUE);

type ProviderProps = {
  children: Node,
};

const RehabProvider = ({ children }: ProviderProps) => {
  const [
    organisationVariationsRequestStatus,
    setOrganisationVariationsRequestStatus,
  ] = useState<RequestStatus>('PENDING');

  const [organisationVariations, setOrganisationVariations] = useState({});

  useEffect(() => {
    getOrganisationVariations().then(
      (fetchedVariations) => {
        setOrganisationVariations(fetchedVariations);
        setOrganisationVariationsRequestStatus('SUCCESS');
      },
      () => {
        setOrganisationVariationsRequestStatus('FAILURE');
      }
    );
  }, []);

  const exerciseVariationsValue: RehabContextType = {
    organisationVariations,
    organisationVariationsRequestStatus,
  };

  return (
    <RehabContext.Provider value={exerciseVariationsValue}>
      {children}
    </RehabContext.Provider>
  );
};

export const useRehabExerciseVariations = () => useContext(RehabContext);

export { RehabProvider };

export const RehabDispatchContext = createContext<RehabContextState>({});
export const useRehabDispatch = () => useContext(RehabDispatchContext);

export default RehabContext;
