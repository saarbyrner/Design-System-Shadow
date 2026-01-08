// @flow
/* eslint-disable react/sort-comp */
import type { Element } from 'react';

import { Component } from 'react';
import $ from 'jquery';
import i18n from '@kitman/common/src/utils/i18n';
import { withNamespaces, setI18n } from 'react-i18next';
import classNames from 'classnames';
import { SentryCaptureMessage } from '@kitman/common/src/utils';

type Item = {
  id: string,
  title: string,
  description?: string,
};

type Items = Array<Item>;
type SelectedItems = Array<string>;

type Props = {
  label?: string,
  name: string,
  items: Items,
  selectedItems?: SelectedItems,
  onChange: (SelectedItems) => any,
  placeholder?: string,
};

type State = {
  isOpen: boolean,
  selectedItems: Array<string>,
  itemsHash: {
    [string]: Item, // makes getting values easy
  },
  itemOrder: Array<string>,
  searchTerm: string,
  value: string,
};

// set the i18n instance
setI18n(i18n);

export class MultiSelect extends Component<Props, State> {
  getSelectedItems: () => Array<?Element<'li'>>;

  searchInput: ?HTMLElement;

  constructor(props: Props) {
    super(props);

    this.state = {
      isOpen: false,
      selectedItems: this.props.selectedItems || [],
      searchTerm: '',
      itemsHash: props.items ? this.createItemsHash(props.items) : {},
      itemOrder: this.getItemOrder(props.items),
      value: '', // eslint-disable-line react/no-unused-state
    };

    this.getSelectedItems = this.getSelectedItems.bind(this);
    this.getItem = this.getItem.bind(this);
    this.getNoResultsMessage = this.getNoResultsMessage.bind(this);
    this.search = this.search.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);
    this.search = this.search.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);

    document.addEventListener('click', this.closeDropdown, true);
  }
  /* eslint-enable max-statements */

  componentDidMount() {
    // this component works with bootstrap dropdown
    // so we don't control the open state via React.
    // Hence this hack-ish code :(
    $(`._multiselect_${this.props.name}`).removeClass('open');
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closeDropdown, true);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    this.setState({
      selectedItems: nextProps.selectedItems || [],
    });
  }

  // creates a hash of the items for easy lookups
  createItemsHash(items: Items) {
    return items.reduce((hash, item) => {
      Object.assign(hash, { [item.id]: item });
      return hash;
    }, {});
  }

  // selected items must be in the same order as items
  orderSelectedItems(selectedItems: SelectedItems) {
    selectedItems.sort((a, b) =>
      this.state.itemOrder.indexOf(a) > this.state.itemOrder.indexOf(b) ? 1 : -1
    );
  }

  // returns an array of item id's in their order
  getItemOrder(items: Items): Array<string> {
    return items.map((item) => item.id);
  }

  // message to display if search results are empty
  getNoResultsMessage = (searchTerm: string) => {
    return (
      <li className="multiSelect__noresults">
        {`${i18n.t('Nothing found for')} `}
        <br />
        &#34;
        <span>{searchTerm}</span>
        &#34;
      </li>
    );
  };

  deselectItem(id: string) {
    const selectedItems = this.state.selectedItems.slice();
    const index = selectedItems.indexOf(id);
    // if the element isn't already selected, select it
    if (index !== -1) {
      selectedItems.splice(index, 1);
      this.setState({
        selectedItems,
      });
    }

    this.changed(selectedItems);
  }

  selectItem(item: Item) {
    this.setState({
      searchTerm: '',
    });

    const selectedItems = this.state.selectedItems.slice();
    // if the element isn't already selected, select it
    if (selectedItems.indexOf(item.id) === -1) {
      selectedItems.push(item.id);
      this.orderSelectedItems(selectedItems); // ensure selected items match the item order
      this.setState({
        selectedItems,
      });
    }

    this.changed(selectedItems);
  }

  // the selected items displayed in the input
  getSelectedItems = (): Array<?Element<'li'>> => {
    return this.state.selectedItems.map((id) => {
      const selectedItem = this.state.itemsHash[id];

      if (!selectedItem) {
        SentryCaptureMessage(
          `${
            this.props.label || 'Unlabeled'
          } Multiselect: The selected value is not in the list of options`
        );
      }

      return selectedItem ? (
        <li
          key={id}
          onClick={() => this.deselectItem(id)}
          className="multiSelect__selected"
        >
          {`${selectedItem.title}`}
          <span className="multiSelect__closeIcon icon-close" />
        </li>
      ) : null;
    });
  };

  // report back to our parent component with
  // the currently selected items
  changed(selectedItems: SelectedItems) {
    this.props.onChange(selectedItems);
  }

  // HTML for a list item
  getItem = (item: Item) => {
    const classes = classNames('multiSelect__item', {
      'multiSelect__item--selected':
        this.state.selectedItems.indexOf(item.id) > -1,
    });

    return (
      <li
        key={item.id}
        onClick={() => this.selectItem(item)}
        className={classes}
      >
        <span className="multiSelect__textwrap">
          {item.title}
          <span className="multiSelect__description">{item.description}</span>
        </span>
      </li>
    );
  };

  // update the search value
  search = (value: string) => {
    this.setState({
      searchTerm: value,
    });
  };

  // open the dropdown
  toggleOpen = () => {
    if (this.searchInput) {
      this.searchInput.focus();
    }
    this.setState({
      isOpen: true,
    });
  };

  // close the dropdown
  closeDropdown = (e: Object) => {
    if (this.state.isOpen) {
      // because clicking anywhere will close the dropdown, we have to
      // know we are not clicking on this component itself
      if (!$(e.target).parents().hasClass(`_multiselect_${this.props.name}`)) {
        this.setState({
          isOpen: false,
        });
      }
    }
  };

  render() {
    const classes = classNames(
      `multiSelect _multiSelect _multiselect_${this.props.name}`,
      {
        'multiSelect--isEmpty': this.state.selectedItems.length === 0,
        open: this.state.isOpen,
      }
    );

    // filter the items based on the search terms
    const searchTerm = this.state.searchTerm || '';
    const items = this.props.items.filter(
      (value) =>
        value.title.trim().toLowerCase().includes(searchTerm.toLowerCase()) ||
        (value.description &&
          value.description
            .trim()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
    );

    return (
      <div className={classes}>
        {this.props.label ? (
          <label htmlFor={this.props.label}>{this.props.label}</label>
        ) : null}
        <ul className="multiSelect__searchField" onClick={this.toggleOpen}>
          <span className="multiSelect__searchIcon icon-search" />
          {this.getSelectedItems()}

          <li>
            <input
              className="multiSelect__searchInput"
              ref={(input) => {
                this.searchInput = input;
              }}
              type="text"
              placeholder={
                this.state.selectedItems.length < 1
                  ? this.props.placeholder
                  : null
              }
              data-ignore-validation="true"
              onChange={(event) => {
                this.search(event.target.value);
              }}
              value={this.state.searchTerm}
            />
          </li>
          <span className="multiSelect__caret" />
        </ul>
        <ul className="multiSelect__menu">
          {items.length > 0
            ? items.map((item) => this.getItem(item))
            : this.getNoResultsMessage(searchTerm)}
        </ul>
      </div>
    );
  }
}

export default MultiSelect;
export const MultiSelectTranslated = withNamespaces()(MultiSelect);
