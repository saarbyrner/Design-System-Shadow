// @flow
import { useCallback, useState, useEffect } from 'react';
import { withNamespaces } from 'react-i18next';
import type { Node } from 'react';
import type { SerializedStyles } from '@emotion/react';

import { shadows, colors } from '@kitman/common/src/variables';
import { InputTextField, TextButton } from '@kitman/components';
import type { FieldProps } from '@kitman/components/src/InputText';
import type { I18nProps } from '@kitman/common/src/types/i18n';

type Props = {
  value: string,
  onSubmit: Function,
  renderContent?: (opts: {
    value: string,
    onClick: Function,
    isEditing: boolean,
  }) => Node,
  maxWidth?: number,
  isDisabled?: boolean,
  maxLength?: number,
  allowOnlyNumbers?: boolean,
  allowSavingEmpty?: boolean,
  styles?: {
    container?: SerializedStyles,
  },
  label?: $PropertyType<FieldProps, 'label'>,
  placeholder?: $PropertyType<FieldProps, 'placeholder'>,
  withMaxLengthCounter?: boolean,
  allowOnlyAlphanumeric?: boolean,
};

const EditableInput = (props: I18nProps<Props>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [inputValue, setInputValue] = useState<string>(
    props.value === null ? '' : props.value.toString()
  );

  useEffect(() => {
    setInputValue(props.value === null ? '' : props.value.toString());
  }, [props.value]);

  const styles = {
    container: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'stretch',
      '& button': {
        marginLeft: '4px',
        boxShadow: shadows.elevation_1,
        ...(props.withMaxLengthCounter && {
          marginBottom: '1.5rem',
        }),
      },
      '& input': {
        flex: 1,
        maxWidth: props.maxWidth ? `${props.maxWidth}px` : '100px',
        width: 'auto',
      },
    },
    maxLengthCounter: {
      fontSize: '12px',
      width: '100%',
      textAlign: 'right',
      color: colors.grey_100,
      fontWeight: 'normal',
      marginTop: '4px',
    },
  };

  const submitChanges = useCallback(() => {
    if (!isInvalid) {
      props.onSubmit(inputValue.trim());
      setIsEditing(false);
    }
  }, [inputValue, isInvalid, props]);

  const cancelChanges = useCallback(() => {
    setInputValue(!props.value ? '' : props.value.toString());
    setIsEditing(false);
  }, [props.value]);

  const onKeyDown = useCallback(
    (event) => {
      setIsInvalid(false);

      if (event.keyCode === 13) {
        submitChanges();
      }

      if (event.keyCode === 27) {
        setIsEditing(false);
      }
    },
    [submitChanges]
  );

  if (inputValue === '' && !isEditing) {
    return (
      <TextButton
        iconBefore="icon-add"
        type="secondary"
        onClick={() => setIsEditing(true)}
        isDisabled={props.isDisabled}
        kitmanDesignSystem
      />
    );
  }

  const onInputChange = (value: string) => {
    if (props.allowOnlyNumbers && !value.match(/^[0-9]+$/)) {
      setIsInvalid(true);
    }
    if (
      props.allowOnlyAlphanumeric &&
      !value.trim().match(/^[a-zA-Z0-9\s]*$/)
    ) {
      setIsInvalid(true);
    }
    if (props.maxLength && value.length > props.maxLength) {
      setIsInvalid(true);
    }
    if (props.allowSavingEmpty && value.trim() === '') {
      setIsInvalid(false);
    }
    if (!props.allowSavingEmpty && value.trim() === '') {
      setIsInvalid(true);
    }
    setInputValue(value);
  };

  const renderButton = () => {
    if (typeof props.renderContent === 'function') {
      return props.renderContent({
        value: inputValue,
        onClick: () => setIsEditing(true),
        isEditing,
      });
    }

    return (
      <TextButton
        text={inputValue}
        type="subtle"
        onClick={() => setIsEditing(true)}
        isDisabled={props.isDisabled}
        kitmanDesignSystem
      />
    );
  };

  return (
    <>
      {!isEditing ? (
        renderButton()
      ) : (
        <div
          css={[styles.container, props.styles?.container]}
          onKeyDown={onKeyDown}
        >
          <InputTextField
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onFocus={(e) => e.currentTarget.select()}
            autoFocus
            invalid={isInvalid}
            kitmanDesignSystem
            focused={isEditing}
            placeholder={props.placeholder}
            label={props.label}
            maxLengthCounterPosition="bottom"
            maxLengthCounterContent={
              props.maxLength && props.withMaxLengthCounter ? (
                <div css={styles.maxLengthCounter}>
                  {props.t('{{remainingCharacters}} characters remaining', {
                    remainingCharacters: props.maxLength - inputValue.length,
                  })}
                </div>
              ) : null
            }
          />
          <TextButton
            type="secondary"
            iconBefore="icon-check"
            onClick={submitChanges}
            kitmanDesignSystem
          />
          <TextButton
            type="secondary"
            iconBefore="icon-close"
            onClick={cancelChanges}
            kitmanDesignSystem
          />
        </div>
      )}
    </>
  );
};

export const EditableInputTranslated = withNamespaces()(EditableInput);
export default EditableInput;
