// @flow
import { useState } from 'react';
import type { ViewType } from '../types';

const useViewType = (): {
  viewType: ViewType,
  isPresentationMode: boolean,
  isEditMode: boolean,
  activateEditMode: Function,
  activatePresentationMode: Function,
} => {
  const [viewType, setViewType] = useState<ViewType>('PRESENTATION');
  const isPresentationMode = !!(viewType === 'PRESENTATION');
  const isEditMode = viewType === 'EDIT';

  const activatePresentationMode = () => setViewType('PRESENTATION');
  const activateEditMode = () => setViewType('EDIT');

  return {
    viewType,
    isPresentationMode,
    isEditMode,
    activateEditMode,
    activatePresentationMode,
  };
};

export default useViewType;
