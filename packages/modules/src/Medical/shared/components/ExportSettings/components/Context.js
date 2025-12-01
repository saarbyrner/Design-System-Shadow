// @flow
import type { Node } from 'react';
import { createContext, useContext, useState, useCallback } from 'react';
import type { Toast } from '@kitman/components/src/types';
import type { UpdateStatus, FormState, OnCancel, OnSave } from '../types';
import { setCachedField } from '../utils';

export type ExportSettingsContextType = {
  setFieldValue: (
    key: $Keys<FormState>,
    value: $Values<FormState>,
    isCached?: boolean
  ) => void,
  formState: FormState,
  onCancel: OnCancel,
  onSave: OnSave,
  toasts: Toast[],
  updateStatus: UpdateStatus,
  isOpen: boolean,
  settingsKey: ?string,
};
export const DEFAULT_CONTEXT_VALUE: ExportSettingsContextType = {
  formState: {},
  setFieldValue: () => {},
  onSave: () => {},
  onCancel: () => {},
  toasts: [],
  updateStatus: () => {},
  isOpen: false,
  settingsKey: null,
};

const ExportSettingsContext = createContext<ExportSettingsContextType>(
  DEFAULT_CONTEXT_VALUE
);

type ExportSettingsProviderProps = {
  children: Node,
  isOpen: boolean,
  onCancel: OnCancel,
  onSave: OnSave,
  settingsKey: ?string,
};

const ExportSettingsProvider = (props: ExportSettingsProviderProps) => {
  const [formState, setFormState] = useState({});
  const [toasts, setToasts] = useState([]);
  const setFieldValue = useCallback(
    (key: $Keys<FormState>, value: $Values<FormState>, isCached?: boolean) => {
      if (isCached && props.settingsKey)
        setCachedField(props.settingsKey, key, value);

      if (isCached && !props.settingsKey) {
        throw new Error(
          '<ExportSettings /> component needs a settingsKey before you can cache an <ExportSettings.Field />'
        );
      }

      setFormState((state) => ({
        ...state,
        [key]: value,
      }));
    },
    []
  );

  const updateStatus: UpdateStatus = (status, title, description) => {
    // TODO use settings key here
    const id = 'exportSettingsToast';

    switch (status) {
      case 'DONE':
        setToasts([]);
        break;

      case 'LOADING':
        setToasts([
          {
            id,
            status: 'LOADING',
            title,
            description,
          },
        ]);
        break;
      case 'SUCCESS':
        setToasts([
          {
            id,
            status: 'SUCCESS',
            title,
            description,
          },
        ]);
        break;
      case 'WARNING':
        setToasts([
          {
            id,
            status: 'WARNING',
            title,
            description,
          },
        ]);
        break;
      case 'ERROR':
        setToasts([
          {
            id,
            status: 'ERROR',
            title,
            description,
          },
        ]);
        break;
      default:
        break;
    }
  };

  const contextValue: ExportSettingsContextType = {
    toasts,
    formState,
    setFieldValue,
    onCancel: props.onCancel,
    onSave: () => props.onSave(formState, updateStatus),
    updateStatus,
    isOpen: props.isOpen,
    settingsKey: props.settingsKey,
  };

  return (
    <ExportSettingsContext.Provider value={contextValue}>
      {props.children}
    </ExportSettingsContext.Provider>
  );
};

export const useExportSettings = (): ExportSettingsContextType =>
  useContext(ExportSettingsContext);

export { ExportSettingsProvider };
export default ExportSettingsContext;
