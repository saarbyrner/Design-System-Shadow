// @flow
import { useState, useCallback, useEffect } from 'react';

import { TextButton, Select } from '@kitman/components';
import {
  fitContentMenuCustomStyles,
  type Option,
} from '@kitman/components/src/Select';
import { type ObjectStyle } from '@kitman/common/src/types/styles';

import {
  inputTypes,
  getInputElementStyles,
  getInputControlsStyles,
  type InputTypes,
} from './utils';
import style from './style';

type Props = {
  inputType: InputTypes,
  value?: ?string,
  // Required if inputType === inputTypes.Select.
  options?: ?Array<Option>,
  name?: ?string,
  label?: ?string,
  editLabel?: ?string,
  isEdited?: ?boolean,
  onSubmit: (string) => void,
  onCancel?: () => void,
  onOpenDrill?: () => void,
};

export const EditableLabel = (props: Props) => {
  const [isEdited, setEdited] = useState<boolean>(props?.isEdited ?? false);
  const [newValue, setNewValue] = useState<?string>(props?.value);
  const [inputElementStyles, setInputElementStyles] = useState<
    Array<ObjectStyle>
  >([]);
  const [inputControlsStyles, setInputControlsStyles] = useState<
    Array<ObjectStyle>
  >([]);

  useEffect(() => {
    setInputControlsStyles(
      getInputControlsStyles({ inputType: props.inputType })
    );
  }, [props.inputType]);

  useEffect(() => setNewValue(props.value), [props.value]);

  const updateInputElementStyles = useCallback(
    ({ isFocused }: { isFocused?: boolean }) => {
      setInputElementStyles(getInputElementStyles({ isFocused: !!isFocused }));
    },
    []
  );

  const getGeneratedInputName = () => {
    let suffix = '';
    if (props?.value) {
      suffix = `-for-${props.value}`;
    }
    return `editable-name${suffix}`;
  };

  const inputElementProps = {
    name: props?.name ?? props?.label ?? getGeneratedInputName(),
    value: newValue ?? props?.value,
    onChange: ({ target: { value } }) => setNewValue(value),
    onFocus: () => updateInputElementStyles({ isFocused: true }),
    onBlur: () => updateInputElementStyles({ isFocused: false }),
    css: inputElementStyles,
  };
  const inputComponent = {
    [inputTypes.Input]: <input type="text" {...inputElementProps} />,
    [inputTypes.Textarea]: <textarea {...inputElementProps} />,
    [inputTypes.Select]: (
      <Select
        customSelectStyles={fitContentMenuCustomStyles}
        value={newValue ?? props.value}
        options={props.options}
        onChange={(value) => setNewValue(value)}
        appendToBody
      />
    ),
  }[props.inputType];

  return (
    <div
      data-testid="EditableLabelWrapper"
      css={style.wrapper}
      onClick={(e) => {
        if (e.currentTarget !== e.target) return;
        props.onOpenDrill?.();
      }}
    >
      {isEdited || props?.isEdited ? (
        <>
          <span id="edit-label" css={style.editLabel}>
            {props.editLabel}
          </span>
          <div
            id="input-controls"
            css={[style.inputControls, ...inputControlsStyles]}
          >
            {inputComponent}
            <div id="input-element-buttons" css={style.inputElementButttons}>
              <TextButton
                type="secondary"
                iconBefore="icon-check"
                onClick={() => {
                  if (typeof newValue === 'string') {
                    props.onSubmit(newValue);
                  }
                  setEdited(false);
                }}
                kitmanDesignSystem
              />
              <TextButton
                type="secondary"
                iconBefore="icon-close"
                onClick={() => {
                  if (props?.onCancel) {
                    props.onCancel();
                  }
                  setEdited(false);
                  setNewValue(props.value);
                }}
                kitmanDesignSystem
              />
            </div>
          </div>
        </>
      ) : (
        <button
          css={style.labelWrapper}
          type="button"
          onClick={() =>
            setEdited((edited) => {
              const externalIsEdited = props.isEdited;
              return typeof externalIsEdited === 'boolean'
                ? !externalIsEdited
                : !edited;
            })
          }
        >
          <span>{props.label ?? props.value}</span>
          <span className="icon-edit" />
        </button>
      )}
    </div>
  );
};
