// @flow
import { useState, useEffect } from 'react';
import _cloneDeep from 'lodash/cloneDeep';
import _isEqual from 'lodash/isEqual';
import type { PrintLayout } from '../types';
import { cleanLayoutArray } from '../utils';

type StateManagerConfig = {
  dashboardPrintLayout: PrintLayout,
  onUpdateLayout: Function,
};

const useLayoutStateManager = (config: StateManagerConfig) => {
  const { onUpdateLayout, dashboardPrintLayout } = config;
  const [localPrintLayouts, setLocalPrintLayouts] = useState([
    dashboardPrintLayout,
  ]);
  const [localPrintLayoutIndex, setLocalPrintLayoutIndex] = useState(0);
  const [hasChanges, setHasChanges] = useState(false);

  const saveChanges = () => {
    // Pass in the original layout for comparison
    // as we don't want to 'compare to the current' (false) layout before saving
    onUpdateLayout(_cloneDeep(localPrintLayouts[0]), false);
    setHasChanges(false);
  };

  const undoChanges = () => {
    setLocalPrintLayoutIndex(
      (currentPrintLayoutIndex) => currentPrintLayoutIndex - 1
    );
    onUpdateLayout(
      _cloneDeep(localPrintLayouts[localPrintLayoutIndex - 1]),
      true,
      false
    );
  };

  const redoChanges = () => {
    setLocalPrintLayoutIndex(
      (currentPrintLayoutIndex) => currentPrintLayoutIndex + 1
    );
    onUpdateLayout(
      _cloneDeep(localPrintLayouts[localPrintLayoutIndex + 1]),
      true,
      false
    );
  };

  const resetLayout = () => {
    const initialLayout: PrintLayout = _cloneDeep(localPrintLayouts[0]);
    const resetLayoutArray: Array<PrintLayout> = [initialLayout];
    setLocalPrintLayouts(resetLayoutArray);
    setLocalPrintLayoutIndex(() => 0);
    onUpdateLayout(_cloneDeep(localPrintLayouts[0]));
    setHasChanges(false);
  };

  const updatePreview = (newLayout: PrintLayout) => {
    // Clean arrays for comparing
    const currentLayoutClean: PrintLayout = cleanLayoutArray(
      localPrintLayouts[localPrintLayoutIndex]
    );
    const newLayoutClean: PrintLayout = cleanLayoutArray(newLayout);

    if (!_isEqual(currentLayoutClean, newLayoutClean)) {
      const existingLayouts: Array<PrintLayout> = _cloneDeep(localPrintLayouts);
      existingLayouts.splice(localPrintLayoutIndex + 1);
      existingLayouts.push(newLayout);
      setLocalPrintLayouts(existingLayouts);

      const currentLocalPrintLayoutIndex: number = existingLayouts.length - 1;
      setLocalPrintLayoutIndex(currentLocalPrintLayoutIndex);

      onUpdateLayout(
        _cloneDeep(existingLayouts[currentLocalPrintLayoutIndex]),
        true,
        false
      );
    }
  };

  const hasUndoChanges: boolean = localPrintLayoutIndex > 0;
  const hasRedoChanges: boolean =
    localPrintLayoutIndex < localPrintLayouts.length - 1;

  useEffect(() => {
    if (
      !_isEqual(localPrintLayouts[localPrintLayoutIndex], dashboardPrintLayout)
    ) {
      setHasChanges(true);
    }
  }, [dashboardPrintLayout, localPrintLayouts, localPrintLayoutIndex]);

  return {
    localPrintLayouts,
    localPrintLayoutIndex,
    saveChanges,
    undoChanges,
    redoChanges,
    updatePreview,
    resetLayout,
    hasChanges,
    hasUndoChanges,
    hasRedoChanges,
  };
};

export default useLayoutStateManager;
