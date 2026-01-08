// @flow
/* eslint-disable react/no-array-index-key */
import * as React from 'react';
import type { Node, ElementRef } from 'react';
import { css } from '@emotion/react';
import classNames from 'classnames';
import _bindAll from 'lodash/bindAll';
import { withNamespaces, setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { SearchBar, EllipsisTooltipText } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';

// set the i18n instance
setI18n(i18n);

export type GroupedDropdownItem = {
  source_key?: string,
  status_id?: string,
  alarm_id?: string,
  body_region?: 'upper' | 'lower' | 'all',
  key_name?: string,
  id?: string,
  name: string,
  description?: string,
  isGroupOption?: boolean,
  formattedOptionName?: string,
  aside?: Node,
};

type Props = {
  options: Array<GroupedDropdownItem>,
  defaultText?: string,
  onChange: Function,
  onSearch?: Function,
  minimumLettersForSearch?: number,
  type?: string,
  label?: string,
  customClass?: string,
  value?: ?string,
  isDisabled?: boolean,
  searchable?: boolean,
  showGroupOptionSearchResults?: boolean,
  clearBtn?: boolean,
  onClickClear?: Function,
  inputName?: string,
};

type State = {
  filter: string,
  isOpen: boolean,
};
class GroupedDropdown extends React.Component<I18nProps<Props>, State> {
  onBodyClick: Function;

  elementRef: ElementRef<any>;

  scrollRef: ElementRef<any>;

  id: string;

  constructor(props: I18nProps<Props>) {
    super(props);

    this.state = {
      isOpen: false,
      filter: '',
    };

    _bindAll(this, [
      'selected',
      'setFilter',
      'setFilter',
      'setButtonText',
      'open',
      'close',
      'toggle',
      'handleOutsideClick',
    ]);

    this.elementRef = React.createRef();
    this.scrollRef = React.createRef();
    this.id = `dropdownMenu1_${Date.now()}`;
  }

  componentDidMount() {
    document.addEventListener('click', this.handleOutsideClick, false);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    /**
     * Handling case for growing/shrinking option length when the props are open
     * This prevents the scroll position jumping on a user if the
     * length is greater/smaller while the dropdown is open
     *
     * e.g. Favouriting
     */
    if (
      prevProps.options.length < this.props.options.length &&
      prevState.isOpen &&
      this.state.isOpen
    ) {
      const diff = this.props.options.length - prevProps.options.length;

      this.scrollRef.current.scrollTop += 33 * diff;
    }
    // Shrinking
    if (
      prevProps.options.length > this.props.options.length &&
      prevState.isOpen &&
      this.state.isOpen
    ) {
      const diff = prevProps.options.length - this.props.options.length;

      this.scrollRef.current.scrollTop -= 33 * diff;
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleOutsideClick, false);
  }

  /**
   * setButtonText() sets the button text. Button text
   * is determined either by the value prop or
   * defaultText prop
   */
  setButtonText() {
    if (this.props.value) {
      const option = this.getOption(this.props.value);

      if (option) {
        return option.formattedOptionName || option.name;
      }
    }

    return this.props.defaultText || '';
  }

  getSelectedItemIndex(presetKey: ?string) {
    // TODO: refactor this component https://github.com/KitmanLabs/projects/issues/4297
    /**
     * NOTE: statuses are structured differently to availableStatuses.
     * Therefore, when editing a status, the component is working with
     * a status object - not an availableStatus object. So, they object
     * must be treated slightly differently - mainly regarding key name.
     */
    let selectedIndex = null;

    switch (this.props.type) {
      case 'status_metrics':
        selectedIndex = this.props.options.findIndex(
          (e) => e.source_key === presetKey
        );
        break;
      case 'statuses':
        selectedIndex = this.props.options.findIndex(
          (e) => e.status_id === presetKey
        );
        break;
      case 'alarms':
        selectedIndex = this.props.options.findIndex(
          (e) => e.alarm_id === presetKey
        );
        break;
      case 'body_regions':
        selectedIndex = this.props.options.findIndex(
          (e) => e.body_region === presetKey
        );
        break;
      default:
        selectedIndex = this.props.options.findIndex(
          (e) =>
            (e.key_name && e.key_name === presetKey) ||
            (e.id && e.id === presetKey)
        );
    }

    return selectedIndex;
  }

  /**
   * getPresetOption() returns an option object based
   * on a key name
   */
  getOption(presetKey: ?string) {
    const selectedIndex = this.getSelectedItemIndex(presetKey);
    return this.props.options[selectedIndex];
  }

  setFilter = (filter: string) => {
    this.setState({ filter });
    if (typeof this.props.onSearch === 'function') {
      this.props.onSearch(filter);
    }
  };

  /**
   * selected() sets the selected option and returns it to the callback
   * takes an option object
   */
  selected(option: GroupedDropdownItem) {
    const index = this.props.options.findIndex((e) => e === option);

    this.props.onChange(option, index);
    this.close();
  }

  /**
   * reset() resets the dropdown
   */
  reset() {
    this.props.onChange(null);
  }

  /**
   * availableOptions() returns filtered options for the dropdown
   * Or a message if none of the options meet the filter condition
   */
  availableOptions(): React.Node {
    const searchTerm = this.state.filter.toLowerCase().trim();

    let filteredOptions: Array<GroupedDropdownItem> = [];
    if (
      this.props.showGroupOptionSearchResults &&
      this.props.options.find((option) => option.isGroupOption === true)
    ) {
      let addGroupItems = false;
      this.props.options.forEach((option) => {
        if (option.isGroupOption) {
          addGroupItems = option.name.toLowerCase().indexOf(searchTerm) !== -1;
        }
        if (
          addGroupItems ||
          option.isGroupOption ||
          option.name.toLowerCase().indexOf(searchTerm) !== -1 ||
          (option.description &&
            option.description.toLowerCase().indexOf(searchTerm) !== -1)
        ) {
          filteredOptions.push(option);
        }
      });
    } else {
      filteredOptions = this.props.options.filter((option) => {
        return (
          option.isGroupOption ||
          option.name.toLowerCase().indexOf(searchTerm) !== -1 ||
          (option.description &&
            option.description.toLowerCase().indexOf(searchTerm) !== -1)
        );
      });
    }

    const itemClassname = (index: number) =>
      classNames('groupedDropdown__item', {
        'groupedDropdown__item--selected':
          index === this.getSelectedItemIndex(this.props.value),
      });

    // If the list is empty or if it just contains group items, show "No result"
    if (
      filteredOptions.length <= 0 ||
      filteredOptions.every((filteredOption) => filteredOption.isGroupOption)
    ) {
      return (
        <li className="groupedDropdown__message">
          {`No results matched "${this.state.filter}"`}
        </li>
      );
    }

    return filteredOptions.map((option, index) => {
      // TODO: don't use index as key https://github.com/KitmanLabs/projects/issues/4297
      if (option.isGroupOption) {
        const isTheGroupEmpty =
          !filteredOptions[index + 1] ||
          filteredOptions[index + 1].isGroupOption;

        return (
          <React.Fragment key={index}>
            {isTheGroupEmpty ? null : (
              <li className="groupedDropdown__optionGroupItem">
                <span className="groupedDropdown__optionGroup">
                  {option.formattedOptionName || option.name}
                </span>
              </li>
            )}
          </React.Fragment>
        );
      }

      return (
        <li
          key={index}
          className={itemClassname(
            this.props.options.findIndex((e) => e === option)
          )}
        >
          <div
            className="groupedDropdown__textwrap"
            onClick={() => this.selected(option)}
          >
            {this.state.isOpen && (
              <EllipsisTooltipText
                styles={{
                  wrapper: css`
                    min-width: 0;
                    margin-right: 5px;
                  `,
                  content: css`
                    line-height: inherit;
                  `,
                }}
                displayEllipsisWidth={100}
                displayEllipsisWidthUnit="%"
                content={
                  option.formattedOptionName
                    ? option.formattedOptionName
                    : option.name
                }
              />
            )}
            {option.description ? (
              <div className="groupedDropdown__itemDescription">
                {` - ${option.description}`}
              </div>
            ) : null}
          </div>
          <div className="groupedDropdown__itemAside">{option.aside}</div>
        </li>
      );
    });
  }

  handleOutsideClick(e: MouseEvent) {
    // it seems composedPath is not compatible with flow type although it is a valid property
    // - https://developer.mozilla.org/en-US/docs/Web/API/Event/composedPath
    // - Flow ref -> https://github.com/facebook/flow/blob/v0.111.3/lib/dom.js#L347
    // $FlowFixMe[prop-missing]
    const path = e.composedPath();
    let isChild = false;

    path.forEach((element) => {
      if (this.elementRef.current === element) {
        isChild = true;
      }
    });

    if (!isChild && this.state.isOpen) {
      this.close();
    }
  }

  open() {
    this.setState({
      isOpen: true,
    });
  }

  close() {
    this.setState({
      isOpen: false,
    });
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    // returns select options for the permutations
    const options = this.availableOptions();
    const isOpen = this.state.isOpen;
    const toggle = this.toggle;
    const domId = this.id;
    const minimumLetters = this.props.minimumLettersForSearch || 0; // setting `0` as default value.
    const isOptionsVisible = this.state.filter.length >= minimumLetters;

    const label = this.props.label ? (
      <label className="groupedDropdown__label" htmlFor="dropdown">
        {this.props.label}
      </label>
    ) : null;

    return (
      <div
        ref={this.elementRef}
        className={classNames('dropdown groupedDropdown _groupedDropdown', {
          // $FlowFixMe classNames handles it if customClass is missing
          [this.props.customClass]: this.props.customClass,
          'groupedDropdown--disabled': this.props.isDisabled,
          'groupedDropdown--withFooter': this.props.clearBtn,
          show: isOpen,
        })}
      >
        {label}
        <button
          data-testid="GroupedDropdown|TriggerButton"
          className="btn btn-default"
          type="button"
          id={domId}
          onClick={toggle}
          data-flip="false"
          aria-haspopup="true"
          aria-expanded="true"
          disabled={this.props.isDisabled}
        >
          <span className="groupedDropdown__value float-left">
            {this.setButtonText()}
          </span>
        </button>
        <ul
          ref={this.scrollRef}
          className={classNames('dropdown-menu groupedDropdown__menu', {
            show: isOpen,
          })}
          aria-labelledby={domId}
        >
          {this.props.searchable ? (
            <li className="groupedDropdown__search">
              <SearchBar
                onChange={(e) => this.setFilter(e.target.value)}
                value={this.state.filter}
              />
            </li>
          ) : null}
          {isOptionsVisible && options}
          {this.props.clearBtn && (
            <li className="groupedDropdown__footer">
              <div
                className="groupedDropdown__clear"
                onClick={() =>
                  this.props.onClickClear && this.props.onClickClear()
                }
              >
                {this.props.t('clear')}
              </div>
            </li>
          )}
        </ul>
        <input
          type="hidden"
          value={this.props.value || ''}
          data-validatetype="dropdown"
          name={this.props.inputName || 'grouped_dropdown'}
        />
      </div>
    );
  }
}

export default GroupedDropdown;
export const GroupedDropdownTranslated = withNamespaces()(GroupedDropdown);
