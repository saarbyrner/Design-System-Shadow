// @flow
import { ColorPicker } from '@kitman/components';

type Props = {
  max: number,
  min: number,
  defaultColour?: string,
  onUpdateColours: Function,
  palette: Array<string>,
};

function ColourPalette(props: Props) {
  const getRandomHexColour = () =>
    `${Math.random().toString(16)}000000`.slice(2, 8);

  return (
    <div data-testid="ColourPalette" className="colourPalette">
      <div className="colourPalette__colourPickers">
        {props.palette.map((colour, index) => {
          return (
            <ColorPicker
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              initialColor={colour}
              isDeleteable
              isDeleteDisabled={props.palette.length <= props.min}
              onChange={(newColour) => {
                const newPalette = [...props.palette];
                newPalette[index] = newColour;
                props.onUpdateColours(newPalette);
              }}
              onDeleteColor={() => {
                if (props.palette.length > props.min) {
                  props.onUpdateColours(
                    props.palette.filter(
                      (item, itemIndex) => itemIndex !== index
                    )
                  );
                }
              }}
              presetColors={props.palette}
            />
          );
        })}
        {props.palette.length === props.max ? null : (
          <div
            className="colourPalette__addPicker icon-add"
            onClick={() => {
              props.onUpdateColours([
                ...props.palette,
                props.defaultColour || `#${getRandomHexColour()}`,
              ]);
            }}
          />
        )}
      </div>
    </div>
  );
}

ColourPalette.defaultProps = {
  min: 9,
  max: 120,
};

export default ColourPalette;
