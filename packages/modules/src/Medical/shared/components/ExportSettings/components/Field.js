// @flow
import { useCallback, useEffect, useMemo } from 'react';
import type { Node } from 'react';
import _get from 'lodash/get';
import type { ObjectStyle } from '@kitman/common/src/types/styles';
import { useExportSettings } from './Context';
import type { FormState } from '../types';
import { getCachedField } from '../utils';

export type CommonFieldProps = {
  fieldKey: $Keys<FormState>,
  defaultValue: $Values<FormState>,
  styles?: ObjectStyle,
  isCached?: boolean,
  shouldResetValueOnClose?: boolean,
};

type Props = {
  ...CommonFieldProps,
  children: ({ value: $Values<FormState>, onChange: Function }) => Node,
};

function Field(props: Props) {
  const { settingsKey, formState, setFieldValue, isOpen } = useExportSettings();
  const defaultValue = useMemo(() => {
    if (props.isCached && settingsKey) {
      return getCachedField(settingsKey, props.fieldKey) || props.defaultValue;
    }

    return props.defaultValue;
  }, []);

  const value = _get(formState, props.fieldKey, defaultValue);
  const onChange = useCallback(
    (newValue) => setFieldValue(props.fieldKey, newValue, props.isCached),
    [props.fieldKey, setFieldValue, props.isCached]
  );

  useEffect(() => {
    // instanstiating the field on mount
    if (typeof formState[props.fieldKey] === 'undefined') {
      setFieldValue(props.fieldKey, defaultValue, props.isCached);
    }

  }, []);

  useEffect(() => {
    if (!isOpen && props.shouldResetValueOnClose) {
      setFieldValue(props.fieldKey, defaultValue, props.isCached);
    }
  }, [
    isOpen,
    props.shouldResetValueOnClose,
    props.fieldKey,
    defaultValue,
    setFieldValue,
    props.isCached,
  ]);

  return (
    <div
      css={[
        {
          padding: '12px 24px',
        },
        props.styles,
      ]}
    >
      {props.children({ value, onChange })}
    </div>
  );
}

export default Field;
