// @flow
type Props = {
  tabIndex: number,
  placeHolder: string,
  value: string,
  setFilter: (string) => void,
  clearFilter: () => void,
  label?: string,
};

const FilterInput = (props: Props) => {
  const clearButton = props.value ? (
    <button
      type="button"
      className="km-btn-clear"
      onClick={() => props.clearFilter()}
    >
      Clear
    </button>
  ) : (
    ''
  );

  const labelEl = props.label ? (
    <label
      htmlFor="DashboardFilterInput"
      className="km-datagrid-textInput__label"
    >
      {props.label}
    </label>
  ) : null;

  return (
    <div className="km-datagrid-textInput">
      {labelEl}
      <div className="filterInput">
        <span className="filterInput__searchIcon icon-search" />
        <input
          role="searchbox"
          type="text"
          className="km-input-control"
          tabIndex={props.tabIndex}
          placeholder={props.placeHolder}
          value={props.value}
          onChange={(e) => props.setFilter(e.target.value)}
          id="DashboardFilterInput"
        />
        {clearButton}
      </div>
    </div>
  );
};

export default FilterInput;
