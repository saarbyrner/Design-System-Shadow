/* eslint-disable jest/expect-expect */
/**
 * @typedef {import('..').TranslatedProps} TranslatedProps
 */

import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import CheckboxMultiSelect, { selectAllText, clearText } from '../index';
import { getCheckboxMultiSelectTranslatedTexts } from '../../utils/helpers';
import { initialNumberOfShownOptions } from '../utils/consts';
import { numberOfActiveFiltersTestId } from '../../AccordionTitle/utils/consts';

describe('<CheckboxMultiSelect />', () => {
  const t = i18nextTranslateStub();
  const translations = getCheckboxMultiSelectTranslatedTexts(t);

  const preSelectedOptionLabel = 'Squad 1';
  const preSelectedOption = { label: preSelectedOptionLabel, value: '1' };
  const preSelectedOptionLower = preSelectedOptionLabel.toLocaleLowerCase();
  const preSelectedOptionUpper = preSelectedOptionLabel.toLocaleUpperCase();

  const allOptions = [
    preSelectedOption,
    { label: 'Squad 2', value: '2' },
    { label: 'Squad 3', value: '3' },
  ];

  const preSelectedOptions = [preSelectedOption.value];

  /** @type {TranslatedProps} */
  const props = {
    t,
    translatedTitle: 'Squads',
    allOptions,
    onSelect: jest.fn(),
    preSelectedOptions,
    alwaysSelectedOptions: new Set(),
  };

  /**
   * @param {boolean} shouldBeChecked
   * @param {HTMLElement} checkbox
   */
  const verifyCheckboxValue = (checkbox, shouldBeChecked) => {
    if (shouldBeChecked) {
      expect(checkbox).toBeChecked();
    } else {
      expect(checkbox).not.toBeChecked();
    }
  };

  const selectAll = async () => {
    const selectAllButton = screen.getByRole('button', { name: selectAllText });
    await userEvent.click(selectAllButton);
  };

  it('should render properly', () => {
    render(<CheckboxMultiSelect {...props} />);

    expect(screen.getByText(preSelectedOption.label)).toBeInTheDocument();
  });

  it('should count the number of active filters properly - without always selected options', async () => {
    render(<CheckboxMultiSelect {...props} />);

    expect(
      await screen.findByTestId(numberOfActiveFiltersTestId)
    ).toHaveTextContent(preSelectedOptions.length);
  });

  it('should count the number of active filters properly - with always selected options', async () => {
    const alwaysSelectedOptionsLocal = new Set([allOptions[2].value]);
    render(
      <CheckboxMultiSelect
        {...props}
        alwaysSelectedOptions={alwaysSelectedOptionsLocal}
      />
    );

    expect(
      await screen.findByTestId(numberOfActiveFiltersTestId)
    ).toHaveTextContent(preSelectedOptions.length); // always selected option shouldn't count
  });

  it('should select all, uncheck one and select all again', async () => {
    const user = userEvent.setup();
    render(<CheckboxMultiSelect {...props} />);

    await selectAll();

    const allCheckboxes = screen.getAllByRole('checkbox');

    allCheckboxes.forEach((checkbox) => {
      verifyCheckboxValue(checkbox, true);
    });

    const [firstCheckbox, ...restCheckboxes] = allCheckboxes;

    await user.click(firstCheckbox);

    // make sure that the first one is unchecked, and all the others are checked
    verifyCheckboxValue(firstCheckbox, false);
    restCheckboxes.forEach((checkbox) => {
      verifyCheckboxValue(checkbox, true);
    });

    await selectAll();

    allCheckboxes.forEach((checkbox) => {
      verifyCheckboxValue(checkbox, true);
    });
  });

  it('should select all, clear all and select all again', async () => {
    const user = userEvent.setup();

    render(<CheckboxMultiSelect {...props} />);

    await selectAll();

    const allCheckboxes = screen.getAllByRole('checkbox');

    allCheckboxes.forEach((checkbox) => {
      verifyCheckboxValue(checkbox, true);
    });

    const clearButton = screen.getByRole('button', { name: clearText });
    await user.click(clearButton);

    allCheckboxes.forEach((checkbox) => {
      verifyCheckboxValue(checkbox, false);
    });

    await selectAll();

    allCheckboxes.forEach((checkbox) => {
      verifyCheckboxValue(checkbox, true);
    });
  });

  it('should select all, even ones not shown + show more/less works', async () => {
    const allOptionsWithShowMore = [
      preSelectedOption,
      { label: 'Squad 2', value: '2' },
      { label: 'Squad 3', value: '3' },
      { label: 'Squad 4', value: '4' },
      { label: 'Squad 5', value: '5' },
      { label: 'Squad 6', value: '6' },
      { label: 'Squad 7', value: '7' },
      { label: 'Squad 8', value: '8' },
      { label: 'Squad 9', value: '9' },
      { label: 'Squad 10', value: '10' },
    ];
    const user = userEvent.setup();

    render(
      <CheckboxMultiSelect {...props} allOptions={allOptionsWithShowMore} />
    );

    await selectAll();

    const allShownCheckboxes = screen.getAllByRole('checkbox');

    expect(allShownCheckboxes.length).toBe(initialNumberOfShownOptions);

    allShownCheckboxes.forEach((checkbox) => {
      verifyCheckboxValue(checkbox, true);
    });

    await user.click(
      screen.getByRole('button', { name: translations.showMore })
    );

    const allCheckboxes = screen.getAllByRole('checkbox');

    expect(allCheckboxes.length).toBe(allOptionsWithShowMore.length);

    allCheckboxes.forEach((checkbox) => {
      verifyCheckboxValue(checkbox, true);
    });

    await user.click(
      screen.getByRole('button', { name: translations.showLess })
    );

    const allShownCheckboxesAfterShowingLess = screen.getAllByRole('checkbox');

    expect(allShownCheckboxesAfterShowingLess.length).toBe(
      initialNumberOfShownOptions
    );

    allShownCheckboxesAfterShowingLess.forEach((checkbox) => {
      verifyCheckboxValue(checkbox, true);
    });
  });

  it('should disable checkboxes using the prop', async () => {
    const disabledCheckboxIndex = 0;
    const disabledOption = allOptions[disabledCheckboxIndex];
    render(
      <CheckboxMultiSelect
        {...props}
        disabledOptions={new Set([disabledOption.value])}
      />
    );
    const allCheckboxes = screen.getAllByRole('checkbox');
    expect(allCheckboxes[disabledCheckboxIndex]).toBeDisabled();
  });

  it('should not clear alwaysSelectedOptions when clicking on clear', async () => {
    const alwaysSelectedCheckboxIndex = 0;
    const alwaysSelectedOption = allOptions[alwaysSelectedCheckboxIndex];

    render(
      <CheckboxMultiSelect
        {...props}
        alwaysSelectedOptions={new Set([alwaysSelectedOption.value])}
      />
    );

    const allCheckboxes = screen.getAllByRole('checkbox');
    expect(allCheckboxes[alwaysSelectedCheckboxIndex]).toBeChecked();

    const clearButton = screen.getByRole('button', { name: clearText });
    await userEvent.click(clearButton);

    expect(allCheckboxes[alwaysSelectedCheckboxIndex]).toBeChecked();
  });

  describe('searching', () => {
    /**
     * @param {string} searchValue
     */
    const search = async (searchValue) => {
      const searchbox = screen.getByPlaceholderText(
        translations.searchPlaceholder
      );
      await fireEvent.change(searchbox, { target: { value: searchValue } });
    };

    /**
     * @param {string} searchValue
     */
    const verifySearch = (searchValue) => {
      const allLis = screen.getAllByRole('listitem');
      allLis.forEach((li) => {
        const textContent = li.querySelector('label').textContent;
        expect(
          textContent
            ?.toLocaleLowerCase()
            .includes(searchValue.toLocaleLowerCase())
        ).toBe(true);
      });
    };
    it('should filter by search query properly', async () => {
      render(<CheckboxMultiSelect {...props} />);
      const searchValue = preSelectedOption.label.substr(0, 2);

      await search(searchValue);
      verifySearch(searchValue);
    });

    it('should filter by lowercase search query properly', async () => {
      render(<CheckboxMultiSelect {...props} />);
      const searchValue = preSelectedOptionLower.substr(0, 2);

      await search(searchValue);
      verifySearch(searchValue);
    });

    it('should filter by uppercase search query properly', async () => {
      render(<CheckboxMultiSelect {...props} />);
      const searchValue = preSelectedOptionUpper.substr(0, 2);

      await search(searchValue);
      verifySearch(searchValue);
    });

    it('should not render searchbox if withSearch is false', () => {
      render(<CheckboxMultiSelect {...props} withSearch={false} />);

      expect(
        screen.queryByPlaceholderText(translations.searchPlaceholder)
      ).not.toBeInTheDocument();
    });
  });
});
