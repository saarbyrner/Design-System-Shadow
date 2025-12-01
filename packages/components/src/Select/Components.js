// @flow
import type { Node } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useState, useRef, useLayoutEffect, createContext } from 'react';
import { css } from '@emotion/react';
import classNames from 'classnames';

import { colors, breakPoints } from '@kitman/common/src/variables';
import useWindowSize from '@kitman/common/src/hooks/useWindowSize';
import { Checkbox, IconButton, TextButton } from '@kitman/components';
import i18n from '@kitman/common/src/utils/i18n';
import List from '@kitman/components/src/Athletes/components/List';

import { getXBoundary } from './utils';
import type { Option, Options, Props as SelectProps } from './index';

export const SelectContext: Object = createContext({
  id: '',
  searchValue: '',
  setSearchValue: () => {},
});

function Root(props: { children: Node }) {
  const [searchValue, setSearchValue] = useState('');
  const [searchInputProps, setSearchInputProps] = useState({});

  return (
    <SelectContext.Provider
      value={{
        searchValue,
        setSearchValue,
        searchInputProps,
        setSearchInputProps,
      }}
    >
      <div className="kitmanReactSelect">{props.children}</div>
    </SelectContext.Provider>
  );
}

function Label(props: {
  label: ?string,
  isDisabled?: ?boolean,
  labelId?: string,
  icon?: string,
  onClickIcon?: Function,
  dataAttribute?: string,
}) {
  return (
    <div
      className="kitmanReactSelect__labelContainer"
      data-testid="labelContainer"
    >
      {props.label && (
        <label
          id={props.labelId}
          data-tooltip-target={props.dataAttribute}
          className={classNames('kitmanReactSelect__label', {
            'kitmanReactSelect__label--disabled': props.isDisabled,
          })}
        >
          {props.label}
        </label>
      )}
      {props.icon && typeof props.onClickIcon === 'function' && (
        <div>
          <IconButton
            onClick={props.onClickIcon}
            icon={props.icon}
            isSmall
            isBorderless
          />
        </div>
      )}
    </div>
  );
}

const OptionalOrRequiredFlag = (props: {
  optional?: boolean,
  required?: boolean,
}) => {
  return props.optional || props.required ? (
    <div className="kitmanReactSelect__optionalOrRequiredFieldText">
      {props.optional ? i18n.t('Optional') : i18n.t('Required')}
    </div>
  ) : null;
};

const SearchInput = (props: Object) => {
  const inputRef = useRef(null);
  // Auto focusing to the input when it is mounted
  useLayoutEffect(() => {
    setTimeout(() => {
      if (inputRef.current !== null) {
        inputRef.current.focus();
      }
    }, 100);
  }, []);

  return (
    <div className="kitmanReactSelect__searchContainer">
      <input
        ref={inputRef}
        value={props.value}
        onChange={props.onChange}
        className="kitmanReactSelect__searchInput"
        data-testid="selectSearchInput"
        placeholder={props.placeholder}
        onBlur={props.onBlur}
      />
      <i className="kitmanReactSelect__searchInputIcon icon-search" />
    </div>
  );
};

const Submenu = (props: Object) => {
  const {
    data,
    onChange,
    isOpen,
    onOpen,
    onHover,
    onHoverExit,
    currentValue,
    multiSelectSubMenu,
    showSubmenuActions,
    isMulti,
    asyncSubmenu,
    index,
    noOptionsMessage,
    errorLoadingMessage,
    loadingMessage,
  } = props;

  const [fetchedSubmenuItems, setFetchedSubmenuItems] =
    useState<boolean>(false);
  const [submenuRequestStatus, setSubmenuRequestStatus] = useState<
    'PENDING' | 'SUCCESS' | 'FAILURE' | null
  >(null);
  const { windowWidth, tabletSize } = useWindowSize();

  const submenuItemRef = useRef();

  const submenuItemRefTop = submenuItemRef.current
    ? submenuItemRef.current.getBoundingClientRect().y
    : 0;

  let submenuItemRefLeft = 0;
  if (submenuItemRef.current)
    submenuItemRefLeft = getXBoundary(submenuItemRef, windowWidth);

  const fetchOptions = (callback: Function, args?: Object): Promise<any> =>
    new Promise<void>((resolve: (value: any) => void, reject) => {
      setSubmenuRequestStatus('PENDING');

      // callback to a service
      callback(args || null).then(
        (fetchedOptions) => {
          setSubmenuRequestStatus('SUCCESS');

          // custom callback for mapping complex response body
          // to Select options data-type
          if (data.loadAsyncOptions?.mapping?.callback) {
            if (typeof data.loadAsyncOptions.mapping.callback !== 'function')
              throw new Error('Mapping callback is not a function');

            return props.setAsyncSubmenuOptions((current) => {
              const copyOfAsyncSubmenuOptions = current ? current.slice() : [];

              copyOfAsyncSubmenuOptions[index] =
                data.loadAsyncOptions.mapping.callback(fetchedOptions);
              return copyOfAsyncSubmenuOptions;
            });
          }

          if (!Array.isArray(fetchedOptions)) {
            throw new Error(
              `Error parsing submenu response. Response is not an Array type. Please check mapping configuration, ya jacket-potato!

                Must map Submenu Response to an Array of Select Options: Array<Option>.`
            );
          }

          // if response doesn't need to be mapped to Select options data-type
          props.setAsyncSubmenuOptions(() =>
            props.setAsyncSubmenuOptions((current) => {
              const copyOfAsyncSubmenuOptions = current ? current.slice() : [];
              copyOfAsyncSubmenuOptions[index] = fetchedOptions;
              return copyOfAsyncSubmenuOptions;
            })
          );
          return resolve();
        },
        (err) => {
          setSubmenuRequestStatus('FAILURE');
          return reject(err);
        }
      );
    });

  const SubmenuItem = (itemProps: {
    item: { value: number, label: string, parentId?: number },
  }) => {
    return (
      <div
        key={`${itemProps.item.value}_${itemProps.item.parentId || ''}`}
        className="dropdownItem"
        onClick={() => {
          if (!multiSelectSubMenu && !isMulti) {
            return onChange(itemProps.item);
          }
          let newValues = props.currentValue.slice();
          const findIndex = newValues.findIndex(
            (val) => val.value === itemProps.item.value
          );

          // if item index = -1 the item hasn't been previously added therefore we add otherwise we remove the item
          if (findIndex === -1) {
            // if the select is just multiSelectSubMenu then we filter out each value that isn't the submenu parent
            if (
              !Number.isNaN(itemProps.item.parentId) &&
              multiSelectSubMenu &&
              !isMulti
            ) {
              newValues = newValues.filter(
                (v) => v.parentId === itemProps.item.parentId
              );
            }
            newValues.push(itemProps.item);
          } else {
            newValues.splice(findIndex, 1);
          }
          return onChange(newValues);
        }}
      >
        {isMulti || multiSelectSubMenu ? (
          <Checkbox
            id="checkboxId"
            label={itemProps.item.label}
            isChecked={
              currentValue?.find(
                (currentV) => currentV.value === itemProps.item.value
              ) || false
            }
            toggle={() => {}}
            kitmanDesignSystem={showSubmenuActions}
          />
        ) : (
          itemProps.item.label
        )}
      </div>
    );
  };

  return (
    <div
      css={css`
        .submenuContainer {
          overflow: auto;
          padding: 8px;
          position: relative;
          display: grid;
        }

        .submenuItemLabel {
          display: grid;
          grid-template-columns: 1.9fr 0.1fr;
          align-items: center;
          justify-content: center;
          margin-left: 9px;
          gap: 8px;
        }
        .dropdownItem {
          height: 36px;
          padding: 8px;
        }

        .icon-chevron-down {
          transform: rotate(270deg);
        }

        .submenuContainer:hover,
        .dropdownItem:hover {
          cursor: pointer;
          background-color: ${colors.grey_100};
          color: ${colors.white};
        }

        .dropdownSubmenu {
          position: fixed;
          display: grid;
          cursor: pointer;
          max-height: 252px;
          overflow-y: auto;
          top: ${submenuItemRefTop}px;
          left: ${submenuItemRefLeft}px;
          background-color: white;
          min-height: 36px;
          border: 1px solid hsl(0, 0%, 80%);
          border-radius: 4px;
          color: #212529;
        }
        .singleLineSubmenu {
          display: flex;
          justify-content: center;
          align-items: center;
          min-width: 100px;
        }

        @media only screen and (max-device-width: ${breakPoints.desktop}) {
          .submenuContainer {
            overflow: auto;
            padding: 8px;
            position: relative;
            display: grid;
            background-color: white;
          }
          .submenuContainer:hover,
          .dropdownItem:hover {
            background-color: ${colors.white};
            color: ${colors.grey_300};
            cursor: pointer;
          }
          .dropdownItem {
            width: fit-content;
            height: fit-content;
          }
          .dropdownSubmenu {
            position: sticky;
            display: block;
            cursor: pointer;
            max-height: 252px;
            overflow-y: auto;
            background-color: ${colors.neutral_200};
            min-height: 36px;
            color: #212529;
            margin: 8px 40px 8px 8px;
          }
        }

        .dropdownSubmenu__actions {
          display: flex;
          justify-content: space-between;
          gap: 7px;
        }
      `}
    >
      <div
        className="submenuContainer"
        // $FlowFixMe
        ref={submenuItemRef}
        onClick={() => {
          onOpen();
          if (asyncSubmenu && fetchedSubmenuItems === false) {
            setFetchedSubmenuItems(true);
            fetchOptions(
              data.loadAsyncOptions.fetchOptions,
              data.loadAsyncOptions.fetchOptionsArgs
            );
          }
        }}
        onMouseEnter={() => {
          if (!asyncSubmenu && windowWidth >= tabletSize) onHover();
        }}
        onMouseLeave={onHoverExit}
      >
        <div className="submenuItemLabel">
          <div>{data.label}</div>
          <i className="icon-chevron-down" />
        </div>

        {isOpen && data?.options?.length > 0 && !asyncSubmenu && (
          <div
            className="dropdownSubmenu"
            onClick={(event) =>
              multiSelectSubMenu || isMulti ? event.stopPropagation() : null
            }
          >
            {multiSelectSubMenu && showSubmenuActions && (
              <div className="dropdownSubmenu__actions">
                <TextButton
                  text={props.selectAllTxt}
                  onClick={() => {
                    props.onChange(data.options);
                  }}
                  type="subtle"
                  size="extraSmall"
                  kitmanDesignSystem
                />

                <TextButton
                  text={props.clearAllTxt}
                  onClick={() => {
                    props.onChange([]);
                  }}
                  type="subtle"
                  size="extraSmall"
                  kitmanDesignSystem
                />
              </div>
            )}
            {data?.options?.length > 0 &&
              data.options.map((item) => {
                return <SubmenuItem item={item} key={item.value} />;
              })}
          </div>
        )}
        {isOpen &&
          asyncSubmenu &&
          props.asyncSubmenuOptions[index]?.length > 0 &&
          submenuRequestStatus === 'SUCCESS' && (
            <div
              className="dropdownSubmenu"
              onClick={(event) =>
                multiSelectSubMenu || isMulti ? event.stopPropagation() : null
              }
            >
              {props.asyncSubmenuOptions[index]?.length > 0 &&
                props.asyncSubmenuOptions[index]?.map((item) => {
                  return <SubmenuItem item={item} key={item.value} />;
                })}
            </div>
          )}

        {isOpen && asyncSubmenu && submenuRequestStatus === 'PENDING' && (
          <div className="dropdownSubmenu">
            <div className="singleLineSubmenu">{loadingMessage()}</div>
          </div>
        )}
        {isOpen &&
          asyncSubmenu &&
          props.asyncSubmenuOptions[index]?.length === 0 &&
          submenuRequestStatus === 'SUCCESS' && (
            <div className="dropdownSubmenu">
              <div className="singleLineSubmenu">{noOptionsMessage()}</div>
            </div>
          )}
        {isOpen && asyncSubmenu && submenuRequestStatus === 'FAILURE' && (
          <div className="dropdownSubmenu">
            <div className="singleLineSubmenu">{errorLoadingMessage()}</div>
          </div>
        )}
      </div>
    </div>
  );
};

const BackButton = ({
  setSelectedParentOption,
  label,
}: {
  setSelectedParentOption: Function,
  label: string,
}) => {
  return (
    <a
      className="kitmanReactSelect__backButton"
      onClick={() => setSelectedParentOption(null)}
    >
      <i className="icon-next-left" />
      {label}
    </a>
  );
};

const PaginatedList = ({
  selectProps,
  setSelectedParentOption,
  filteredOptions,
}: {
  selectProps: SelectProps & { backText: string, onMenuClose: Function },
  setSelectedParentOption: Function,
  filteredOptions: Array<Option> | Array<Options> | null,
}) => {
  const virtuosoRef = useRef(null);

  return (
    <Virtuoso
      ref={virtuosoRef}
      data={filteredOptions}
      totalCount={filteredOptions?.length}
      itemContent={(index, option) => {
        return (
          <List.Option
            key={option.value}
            title={option.label}
            onClick={() => {
              if (option.options?.length) {
                setSelectedParentOption(option);
              } else {
                selectProps.onChange(option);
                setSelectedParentOption(null);
                selectProps.onMenuClose();
              }
            }}
            renderRight={() => {
              return (
                !!option.options?.length && (
                  <>
                    <i className="icon-next-right" />
                  </>
                )
              );
            }}
          />
        );
      }}
    />
  );
};

export default {
  Root,
  Label,
  OptionalOrRequiredFlag,
  SearchInput,
  Submenu,
  BackButton,
  PaginatedList,
};
