// @flow
import type { Node } from 'react';
import { useRef, useState, useEffect } from 'react';
import { withNamespaces, setI18n } from 'react-i18next';
import classNames from 'classnames';

import i18n from '@kitman/common/src/utils/i18n';
import { TextButton, SearchBar } from '@kitman/components';
import type { ButtonSize } from '@kitman/components/src/TextButton/types';
import type { I18nProps } from '@kitman/common/src/types/i18n';

// set the i18n instance
setI18n(i18n);

type Props = {
  hasApply: boolean,
  buttonSize?: ButtonSize,
  hasSearch: boolean,
  isOptional: boolean,
  showDropdownButton: boolean,
  label: string,
  searchTerm: string,
  dropdownTitle: string,
  onTypeSearchTerm: Function,
  onApply: Function,
  children?: Node,
  customClass: string,
  disabled: ?boolean,
  maxHeight?: ?string,
};

function DropdownWrapper(props: I18nProps<Props>) {
  const node = useRef(null);

  const [open, setOpen] = useState(false);

  const classes = classNames('dropdownWrapper', props.customClass, {
    'dropdownWrapper--open': open,
    'dropdownWrapper--noButton': !props.showDropdownButton,
    'dropdownWrapper--disabled': props.disabled,
  });

  const handleDropdownClick = (event: Object) => {
    if (node.current && node.current.contains(event.target)) {
      // inside click
      return;
    }
    // outside click
    setOpen(false);
  };

  const handleDropdownButtonClick = () => {
    if (!props.disabled) {
      setOpen(!open);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleDropdownClick);
    return () => {
      document.removeEventListener('mousedown', handleDropdownClick);
    };
  });

  return (
    <div data-testid="DropdownWrapper" ref={node} className={classes}>
      {props.label.length > 0 ? (
        <label className="dropdownWrapper__label">{props.label}</label>
      ) : null}
      {props.showDropdownButton ? (
        <div
          className="dropdownWrapper__header"
          onClick={handleDropdownButtonClick}
        >
          <div className="dropdownWrapper__title">{props.dropdownTitle}</div>
          <span className="dropdownWrapper__caret" />
        </div>
      ) : null}

      {open || !props.showDropdownButton ? (
        <ul
          className="dropdown-menu dropdownWrapper__menu dropdownWrapper__menu--pivotDate"
          aria-labelledby="dropdownWrapperMenu"
          style={
            props.showDropdownButton && props.maxHeight
              ? { maxHeight: `${props.maxHeight}px` }
              : {}
          }
        >
          {/* Search Bar */}
          {props.hasSearch ? (
            <li className="dropdownWrapper__search">
              <SearchBar
                onChange={(e) => props.onTypeSearchTerm(e.target.value)}
                value={props.searchTerm}
                placeholder={props.t('Search')}
              />
            </li>
          ) : null}

          {props.children}

          {/* Apply Button */}
          {props.hasApply ? (
            <li className="dropdownWrapper__actionButtons">
              <TextButton
                type="primary"
                text={props.t('Apply')}
                onClick={() => {
                  setOpen(false);
                  props.onApply();
                }}
                size={props.buttonSize}
              />
            </li>
          ) : null}
        </ul>
      ) : null}

      {/* Optional Text */}
      {props.isOptional ? (
        <span className="dropdownWrapper__optional">{props.t('Optional')}</span>
      ) : null}
    </div>
  );
}

DropdownWrapper.defaultProps = {
  hasApply: false,
  hasSearch: false,
  isOptional: false,
  showDropdownButton: true,
  label: '',
  searchTerm: '',
  dropdownTitle: '',
  onTypeSearchTerm: () => {},
  onApply: () => {},
  children: null,
  t: (text) => text,
};

export default DropdownWrapper;
export const DropdownWrapperTranslated = withNamespaces()(DropdownWrapper);
