// @flow
import { useState, useRef, useEffect } from 'react';
import { SketchPicker } from 'react-color';
import type { ObjectStyle } from '@kitman/common/src/types/styles';

import style from './style';

type Props = {
  isDeleteable: boolean,
  isExampleTextVisible?: boolean,
  showPickerOnly?: boolean,
  initialColor: string,
  presetColors: Array<string>,
  onChange: (string) => void,
  onDeleteColor: () => void,
  onClick?: () => void,
  customStyle?: { wrapper: ObjectStyle, picker: ObjectStyle },
};

function ColorPicker(props: Props) {
  const wrapperRef = useRef(null);
  const [color, setColor] = useState(props.initialColor);
  const [showPicker, setShowPicker] = useState(false);

  const swatchColors = {
    backgroundColor: color,
    border: color === '#ffffff' ? '1px solid #dedede' : 'none',
  };

  const swatchLabelColor = {
    // `color` must be equal to the current background color in order to
    // `filter` and `mixBlendMode` (defined in
    // @kitman/common/src/styles/contrastingText) to have the right effect —
    // make the text contrasting with the background.
    color,
  };

  const handleClickOutside = (event: Object) => {
    if (wrapperRef.current && wrapperRef.current.contains(event.target)) {
      return;
    }
    setShowPicker(false);
  };

  useEffect(() => {
    window.addEventListener('click', handleClickOutside, false);

    return () => {
      window.removeEventListener('click', handleClickOutside, false);
    };
  });

  useEffect(() => {
    setColor(props.initialColor);
  }, [props.initialColor]);

  return (
    <div
      data-testid="ColorPicker"
      css={[style.wrapper, props.customStyle?.wrapper]}
      ref={wrapperRef}
    >
      {props.isDeleteable ? (
        <div
          id="deleteColor"
          className="icon-close"
          css={style.delete}
          style={showPicker ? style.hidden : {}}
          onClick={props.isDeleteable ? props.onDeleteColor : null}
        />
      ) : null}
      {!props.showPickerOnly && (
        <div
          data-testid="ColorPicker|Swatch"
          css={{
            // $FlowIgnore[not-an-object] style.swatch is always an object.
            ...style.swatch,
            ...(props.isExampleTextVisible &&
            typeof style.exampleTextSwatchColor === 'object'
              ? style.exampleTextSwatchColor
              : null),
          }}
          onClick={
            props.isExampleTextVisible
              ? props.onClick
              : () => {
                  setShowPicker(!showPicker);
                }
          }
        >
          <div
            data-testid="ColorPicker|SwatchColor"
            css={style.swatchColor}
            style={{
              ...(props.isExampleTextVisible &&
              typeof style.exampleTextSwatchColor === 'object'
                ? style.exampleTextSwatchColor
                : null),
              ...swatchColors,
            }}
          >
            {props.isExampleTextVisible && (
              <span css={[style.swatchLabel, swatchLabelColor]}>Aa</span>
            )}
          </div>
        </div>
      )}

      {showPicker || props.showPickerOnly ? (
        <div
          data-testid="ColorPicker|Picker"
          css={[
            style[props.showPickerOnly ? 'pickerOnly' : 'picker'],
            props.customStyle?.picker,
          ]}
        >
          <SketchPicker
            color={color}
            disableAlpha
            onChangeComplete={(chosenColor) => {
              setColor(chosenColor.hex);
              props.onChange(chosenColor.hex);
            }}
            presetColors={props.presetColors}
            width={190}
          />
        </div>
      ) : null}
    </div>
  );
}

ColorPicker.defaultProps = {
  isDeleteable: false,
  initialColor: '#ffffff',
  presetColors: [],
  onChange: () => {},
  onDeleteColor: () => {},
};

export default ColorPicker;
