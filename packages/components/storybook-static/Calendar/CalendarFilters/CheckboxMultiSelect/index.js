// @flow
import { useState, useMemo, useEffect, type ComponentType } from 'react';

import { withNamespaces } from 'react-i18next';

import Accordion from '@kitman/components/src/Accordion';
import { InputTextField } from '@kitman/components/src/InputText';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import {
  createAccordionContentStyles,
  accordionOverrideStyles,
} from '../utils/styles';
import styles from './utils/styles';
import { getCheckboxMultiSelectTranslatedTexts } from '../utils/helpers';
import CheckboxList from './CheckboxList';
import Footer from './Footer';
import { initialNumberOfShownOptions } from './utils/consts';
import type { CheckboxItems } from '../utils/types';
import LocalTextButton from './LocalTextButton';
import AccordionTitle from '../AccordionTitle';

export const selectAllText = 'Select all';
export const clearText = 'Clear';
export const viewMoreText = 'See more';

const accordionContent = createAccordionContentStyles({
  includeBorderBottom: true,
});

export type Props = {
  allOptions: CheckboxItems,
  preSelectedOptions: Array<string>,
  onSelect: (chosenOptions: Set<string>) => void,
  translatedTitle: string,
  alwaysSelectedOptions: Set<string>,
  disabledOptions?: Set<string>,
  withSearch?: boolean,
};

export type TranslatedProps = I18nProps<Props>;

const CheckboxMultiSelect = ({
  allOptions,
  onSelect,
  preSelectedOptions,
  translatedTitle,
  disabledOptions,
  alwaysSelectedOptions,
  withSearch = true,
  t,
}: TranslatedProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [numberOfCurrentlyShownOptions, setNumberOfCurrentlyShownOptions] =
    useState(initialNumberOfShownOptions);
  const [localSelected, setLocalSelected] = useState<Set<string>>(
    new Set([...preSelectedOptions, ...alwaysSelectedOptions])
  );

  useEffect(() => {
    setLocalSelected(
      new Set([...preSelectedOptions, ...alwaysSelectedOptions])
    );
  }, [preSelectedOptions, alwaysSelectedOptions]);

  const {
    filteredItemsLength,
    sliced: shownItems,
  }: { filteredItemsLength: number, sliced: CheckboxItems } = useMemo(() => {
    const lowerSearchValue = searchValue.toLocaleLowerCase();
    const filtered = allOptions.filter(({ label }) =>
      label.toLocaleLowerCase().includes(lowerSearchValue)
    );
    const sliced = filtered.slice(0, numberOfCurrentlyShownOptions);
    return { filteredItemsLength: filtered.length, sliced };
  }, [allOptions, searchValue, numberOfCurrentlyShownOptions]);

  const {
    header: { container: headerContainer, divider },
  } = styles;

  const translations = getCheckboxMultiSelectTranslatedTexts(t);

  const onClickOnCheckbox = (id: string) => {
    setLocalSelected((prevLocalSelected: Set<string>) => {
      if (prevLocalSelected.has(id)) {
        prevLocalSelected.delete(id);
      } else {
        prevLocalSelected.add(id);
      }
      onSelect(prevLocalSelected);
      return prevLocalSelected;
    });
  };

  return (
    <Accordion
      title={
        <AccordionTitle
          translatedTitle={translatedTitle}
          numberOfActiveFilters={
            localSelected.size - alwaysSelectedOptions.size // always selected options shouldn't count
          }
        />
      }
      isOpen
      overrideStyles={accordionOverrideStyles}
      content={
        <div css={accordionContent}>
          {withSearch && (
            <InputTextField
              value={searchValue}
              onChange={(event) => {
                setSearchValue(event.target.value);
                setNumberOfCurrentlyShownOptions(initialNumberOfShownOptions);
              }}
              placeholder={translations.searchPlaceholder}
              kitmanDesignSystem
              searchIcon
            />
          )}
          <div css={headerContainer}>
            <LocalTextButton
              onClick={() => {
                const allSelected = new Set(
                  allOptions.map(({ value }) => value.toString())
                );
                setLocalSelected(allSelected);
                onSelect(allSelected);
              }}
              text={translations.selectAll}
            />
            <span css={divider} />
            <LocalTextButton
              onClick={() => {
                const noSelection = new Set([...alwaysSelectedOptions]);
                setLocalSelected(noSelection);
                onSelect(noSelection);
              }}
              text={translations.clear}
            />
          </div>
          <CheckboxList
            shownItems={shownItems}
            onClick={onClickOnCheckbox}
            localSelected={localSelected}
            disabledOptions={disabledOptions}
          />
          <Footer
            onClick={setNumberOfCurrentlyShownOptions}
            showLess={translations.showLess}
            showMore={translations.showMore}
            numberOfCurrentlyShownOptions={numberOfCurrentlyShownOptions}
            filteredItemsLength={filteredItemsLength}
          />
        </div>
      }
    />
  );
};

export const CheckboxMultiSelectTranslated: ComponentType<Props> =
  withNamespaces()(CheckboxMultiSelect);
export default CheckboxMultiSelect;
