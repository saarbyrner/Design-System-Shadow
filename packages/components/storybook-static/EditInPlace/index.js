// @flow
import { useState, useCallback, useEffect } from 'react';
import classNames from 'classnames';
import _isFunction from 'lodash/isFunction';

type Props = {
  value: string,
  invalid?: boolean,
  inputType?: string,
  onChange?: Function,
  titleRenderer?: Function,
  editOnTextOnly?: boolean,
};

const componentName = 'edit-in-place';

function EditInPlace(props: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [displayValue, setDisplayValue] = useState(props.value);
  const [inputValue, setInputValue] = useState(props.value);
  const isDisabled = typeof inputValue === 'string' && !inputValue?.trim();

  const beginEditing = useCallback(() => {
    setIsEditing(true);
    setInputValue(displayValue);
  }, [displayValue]);

  const commitChanges = useCallback(() => {
    if (isDisabled) return;

    setDisplayValue(inputValue);
    // $FlowFixMe
    if (_isFunction(props.onChange)) props.onChange(inputValue);

    setIsEditing(false);
  }, [inputValue]);

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        commitChanges();
      }

      if (event.key === 'Escape') {
        cancelEditing();
      }
    },
    [commitChanges]
  );

  const renderTitle = useCallback(() => {
    return _isFunction(props.titleRenderer)
      ? // $FlowFixMe
        props.titleRenderer(displayValue)
      : displayValue;
  }, [displayValue, props.titleRenderer]);

  useEffect(() => {
    setDisplayValue(props.value);
    setInputValue(props.value);
  }, [props.value]);

  return (
    <span
      className={classNames(componentName, {
        [`${componentName}--invalid`]: props.invalid,
      })}
    >
      {isEditing ? (
        <>
          <input
            className={`${componentName}__input`}
            type={props.inputType ? props.inputType : 'text'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
            onFocus={(e) => e.currentTarget.select()}
            onKeyDown={onKeyDown}
          />
          <i
            data-testid="EditInPlace|CommitChanges"
            className={classNames(
              `${componentName}__action-icon`,
              `${componentName}__action-icon--success`,
              isDisabled && `${componentName}__action-icon--disabled`,
              'icon-check'
            )}
            onClick={commitChanges}
          />
          <i
            data-testid="EditInPlace|CancelChanges"
            className={classNames(
              `${componentName}__action-icon`,
              `${componentName}__action-icon--error`,
              'icon-close'
            )}
            onClick={cancelEditing}
          />
        </>
      ) : (
        <>
          {/** TODO: Maybe add Component prop here to make it a bit more customizeable */}
          <h6 className={`${componentName}__title`} onClick={beginEditing}>
            {renderTitle()}
          </h6>
          {!props.editOnTextOnly && (
            <i
              className={classNames(
                `${componentName}__title-icon`,
                'icon-edit-name'
              )}
              onClick={beginEditing}
            />
          )}
        </>
      )}
    </span>
  );
}

export default EditInPlace;
