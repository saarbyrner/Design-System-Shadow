// @flow
/* eslint-disable react/sort-comp */
import type { Node } from 'react';
import { Component } from 'react';
import { withNamespaces, setI18n } from 'react-i18next';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';

import { InfoTooltip } from '@kitman/components';
import i18n from '@kitman/common/src/utils/i18n';
import { SentryCaptureMessage } from '@kitman/common/src/utils';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import DropdownItemList from './DropdownItemList';

// set the i18n instance
setI18n(i18n);

export type DropdownItem = {
  id: number | string,
  title: string,
  name?: string,
  description?: string,
};

export type Items = Array<DropdownItem>;

export type DropdownTooltipSettings = {
  placement?: string,
  content: Node,
  overlayClassName?: ?string,
  tooltipTriggerElement: Node,
};

type Props = {
  items: Items,
  onChange: Function,
  label?: string,
  value?: ?string | ?number, // the id of the item
  disabled?: boolean,
  searchable?: boolean,
  name?: string,
  ignoreValidation?: boolean,
  optional?: ?boolean,
  emptyText?: string,
  displayEmptyText?: boolean,
  invalid?: ?boolean,
  clearBtn?: boolean,
  tooltipSettings?: ?DropdownTooltipSettings,
  onClickClear?: Function,
  hiddenNoneOption?: boolean,
};

class Dropdown extends Component<
  I18nProps<Props>,
  {
    searchTerm: string,
  }
> {
  dropdownEl: ?HTMLDivElement;

  searchInputEl: ?HTMLInputElement;

  constructor(props: I18nProps<Props>) {
    super(props);

    this.state = {
      searchTerm: '',
    };

    this.updateSearchTerm = this.updateSearchTerm.bind(this);
    this.onBodyClick = this.onBodyClick.bind(this);
    this.setButtonText = this.setButtonText.bind(this);
    this.getSelectedItemIndex = this.getSelectedItemIndex.bind(this);

    this.dropdownEl = null;
    this.searchInputEl = null;
  }

  shouldComponentUpdate(nextProps: Props, nextState: { searchTerm: string }) {
    // We noticed performance issues on dropdowns containing a lot of items.
    // props.onChange causes a lot of unexpected rendering.
    // We should rerender only if the other props change.
    const propsChanged =
      !isEqual(nextProps.items, this.props.items) ||
      nextProps.label !== this.props.label ||
      nextProps.value !== this.props.value ||
      nextProps.disabled !== this.props.disabled ||
      nextProps.searchable !== this.props.searchable ||
      nextProps.name !== this.props.name ||
      nextProps.invalid !== this.props.invalid;

    const statesChanged = nextState.searchTerm !== this.state.searchTerm;

    return propsChanged || statesChanged;
  }

  componentDidMount() {
    if (this.props.searchable) {
      document.addEventListener('click', this.onBodyClick);
    }
  }

  componentWillUnmount() {
    if (this.props.searchable) {
      document.removeEventListener('click', this.onBodyClick);
    }
  }

  getSelectedItemIndex = () => {
    const index = this.props.items.findIndex(
      (item) => item.id === this.props.value
    );

    // loose condition is used to let values of 0 pass,
    // but prevent 'undefined' and null from passing
    if (this.props.value != null && this.props.value !== '' && index === -1) {
      SentryCaptureMessage(
        `${
          this.props.label || 'Unlabeled'
        } Dropdown: The selected value is not in the list of options`
      );
    }

    // loose condition is used to let values of 0 pass,
    // but prevent 'undefined' and null from passing
    return this.props.value != null && this.props.value !== '' ? index : null;
  };

  // Autofocus the text input when the dropdown opens
  // Clear searchTerm state when the dropdown is closed
  // We need an event listener on the body as the user can click
  // everywhere to close the dropdown
  onBodyClick = () => {
    if (!this.dropdownEl) {
      return;
    }

    const isDropdownOpen = this.dropdownEl.classList.contains('open');
    if (isDropdownOpen && this.searchInputEl) {
      this.searchInputEl.focus();
    } else if (this.searchInputEl) {
      const emptyValue = '';
      this.searchInputEl.value = emptyValue;
      this.updateSearchTerm(emptyValue);
    }
  };

  /**
   * setButtonText() sets the button text. Button text
   * is determined either by the value prop or
   * defaultText prop
   */
  setButtonText = () => {
    const index = this.getSelectedItemIndex();

    const selectedItem =
      typeof index === 'number' && index !== -1
        ? this.props.items[index]
        : null;
    if (!selectedItem) {
      return this.props.optional && !this.props.hiddenNoneOption
        ? this.props.t('None')
        : '';
    }

    const itemDescription = selectedItem.description
      ? ` - ${selectedItem.description}`
      : '';
    return selectedItem
      ? `${selectedItem.name || selectedItem.title}${itemDescription}`
      : null;
  };

  updateSearchTerm = (value: string) => {
    const formattedSearchTerm = value.trim().toLowerCase();
    this.setState({ searchTerm: formattedSearchTerm });
  };

  render() {
    const label = this.props.label ? (
      <label htmlFor="dropdown">{this.props.label}</label>
    ) : null;

    const searchBar = this.props.searchable ? (
      <li className="customDropdown__inputFilter">
        <input
          ref={(searchInputEl) => {
            this.searchInputEl = searchInputEl;
          }}
          type="text"
          className="form-control"
          data-ignore-validation="true"
          onChange={(e) => this.updateSearchTerm(e.target.value)}
        />
      </li>
    ) : null;

    const noneOption =
      this.props.optional && !this.props.hiddenNoneOption ? (
        <>
          <li
            className={classNames('customDropdown__item', {
              'customDropdown__item--selected': !this.props.value,
            })}
            onClick={() => this.props.onChange(null)}
          >
            <span className="customDropdown__textwrap">
              {this.props.t('None')}
            </span>
          </li>
          {this.props.items.length > 0 ? (
            <li className="customDropdown__optionSeparator" />
          ) : null}
        </>
      ) : null;

    return (
      <div
        className={classNames('dropdown customDropdown _customDropdown', {
          'customDropdown--disabled': this.props.disabled,
          'customDropdown--withFooter': this.props.clearBtn,
          hasError: this.props.invalid,
        })}
        ref={(dropdownEl) => {
          this.dropdownEl = dropdownEl;
        }}
      >
        {label && (
          <div className="customDropdown__label">
            {label}
            {this.props.tooltipSettings && (
              <InfoTooltip
                placement={
                  this.props.tooltipSettings.placement || 'bottom-start'
                }
                content={this.props.tooltipSettings.content}
              >
                {this.props.tooltipSettings.tooltipTriggerElement}
              </InfoTooltip>
            )}
          </div>
        )}
        <button
          className="btn btn-default"
          type="button"
          id="dropdownMenu1"
          data-toggle="dropdown"
          data-flip="false"
          aria-haspopup="true"
          aria-expanded="true"
          disabled={this.props.disabled}
        >
          <span className="customDropdown__value float-left">
            {this.setButtonText()}
          </span>
        </button>
        <ul
          className="dropdown-menu customDropdown__menu"
          aria-labelledby="dropdownMenu1"
        >
          {searchBar}
          {noneOption}
          <DropdownItemList
            items={this.props.items}
            searchTerm={this.state.searchTerm}
            onChange={this.props.onChange}
            selectedItemIndex={this.getSelectedItemIndex()}
            emptyText={this.props.emptyText}
            displayEmptyText={this.props.displayEmptyText}
            t={this.props.t}
          />
          {this.props.clearBtn && (
            <li className="customDropdown__footer">
              <div
                className="customDropdown__clear"
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
          value={
            !this.props.value && this.props.value !== 0 ? '' : this.props.value
          }
          data-validatetype="dropdown"
          name={this.props.name}
          data-ignore-validation={this.props.ignoreValidation}
        />
      </div>
    );
  }
}

export default Dropdown;
export const DropdownTranslated = withNamespaces()(Dropdown);
