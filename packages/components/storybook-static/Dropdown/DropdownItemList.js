// @flow
/* eslint-disable react/no-array-index-key */
import type { Node } from 'react';
import { Component } from 'react';
import isEqual from 'lodash/isEqual';
import classNames from 'classnames';

import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { Items } from './index';

type Props = {
  items: Items,
  searchTerm: string,
  onChange: Function,
  selectedItemIndex: ?number,
  emptyText?: string,
  displayEmptyText?: boolean,
};

// We extract the list of items because the list
// can be extremely long (more that 1500 items in the pathology dropdown).
// Extracting the list allows us to limit the number of rendering of
// all these items. For example, it won't rerender all the items
// when the dropdown become disabled.
export default class DropdownItemList extends Component<I18nProps<Props>> {
  shouldComponentUpdate(nextProps: I18nProps<Props>) {
    return (
      nextProps.selectedItemIndex !== this.props.selectedItemIndex ||
      !isEqual(nextProps.items, this.props.items) ||
      !isEqual(nextProps.searchTerm, this.props.searchTerm)
    );
  }

  render(): Node {
    if (this.props.items.length <= 0 && this.props.displayEmptyText) {
      return (
        <li className="customDropdown__emptyMessage">
          {this.props.emptyText
            ? this.props.emptyText
            : this.props.t('No items available')}
        </li>
      );
    }

    if (this.props.items.length <= 0 && !this.props.displayEmptyText) {
      return null;
    }

    const filteredItems = this.props.searchTerm
      ? this.props.items.filter((item) => {
          const itemName = item.name || item.title;
          return (
            itemName.toLowerCase().indexOf(this.props.searchTerm) !== -1 ||
            (item.description &&
              item.description.toLowerCase().indexOf(this.props.searchTerm) !==
                -1)
          );
        })
      : this.props.items;

    if (filteredItems.length <= 0) {
      return (
        <li className="customDropdown__message">
          {`No results matched "${this.props.searchTerm}"`}
        </li>
      );
    }

    const itemClassname = (index: number) =>
      classNames('customDropdown__item', {
        'customDropdown__item--selected':
          index === this.props.selectedItemIndex,
      });

    return filteredItems.map((item, index) => (
      <li
        className={itemClassname(index)}
        key={index}
        onClick={() => this.props.onChange(item.id)}
      >
        <span className="customDropdown__textwrap">
          {item.name || item.title}
          {item.description ? (
            <span className="customDropdown__description">{` - ${item.description}`}</span>
          ) : null}
        </span>
      </li>
    ));
  }
}
