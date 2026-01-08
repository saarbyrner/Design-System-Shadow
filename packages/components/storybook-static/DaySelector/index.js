// @flow
import classNames from 'classnames';

type DaySelectorItem = {
  id: string,
  displayName: string,
  selected: boolean,
};

type Props = {
  label: string,
  items: Array<DaySelectorItem>,
  onToggle: Function,
};

function DaySelector({ label, items, onToggle }: Props) {
  const dayControl = ({ id, displayName, selected }) => {
    return (
      <div
        key={id}
        onClick={() => onToggle(id)}
        className={classNames('daySelectorDay', {
          'daySelectorDay--selected': selected,
        })}
      >
        {displayName}
      </div>
    );
  };

  return (
    <div className="daySelector">
      <div className="daySelector__label">
        <label>{label}</label>
      </div>
      <div className="daySelectorDays">
        {items.map((day) => dayControl(day))}
      </div>
    </div>
  );
}

export default DaySelector;
