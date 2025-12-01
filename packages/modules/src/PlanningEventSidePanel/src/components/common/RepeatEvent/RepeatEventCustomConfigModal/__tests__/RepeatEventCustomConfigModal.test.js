/** @typedef {import('../index').TranslatedProps} TranslatedProps */
import 'core-js/stable/structured-clone';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import moment from 'moment-timezone';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import RepeatEventCustomConfigModal from '../index';
import {
  getAllCustomModalTranslations,
  getModalBaseTranslations,
  getFrequencyToLabelMap,
  getRepeatEveryTranslations,
} from '../utils/helpers';
import { getDefaultCustomConfig } from '../utils/config-helpers';

describe('<RepeatEventCustomConfigModal />', () => {
  const t = i18nextTranslateStub();
  const eventDate = moment(new Date(2023, 11, 4)); // December 4th, 2023, a Monday

  /** @type {TranslatedProps} */
  const props = {
    t,
    eventDate,
    isOpen: true,
    onClose: jest.fn(),
    onDone: jest.fn(),
  };

  const allTranslations = getAllCustomModalTranslations(t);

  const getDoneButton = () =>
    screen.getByText(allTranslations.done).parentElement; // the span inside the button has the text, but the button will be dis/enabled

  /**
   * @param {HTMLLIElement} li
   * @returns {HTMLElement}
   */
  const getCheckboxToClickOn = (li) => li.firstChild.firstChild; // couldn't find a better way to reach the checkbox itself (inside the context of its parent)

  const getCheckboxesUl = () => {
    const label = screen.getByText(allTranslations.repeatOn);
    const checkboxUl = label.nextSibling;
    const lis = Array.from(checkboxUl.childNodes);
    return lis;
  };

  it('renders', () => {
    render(<RepeatEventCustomConfigModal {...props} />);
    const translations = getModalBaseTranslations(t);
    Object.values(translations).forEach((translatedText) => {
      expect(screen.getByText(translatedText)).toBeInTheDocument();
    });
  });

  it('shows the three sections', async () => {
    render(<RepeatEventCustomConfigModal {...props} />);
    const translations = getAllCustomModalTranslations(t);
    expect(screen.getByText(translations.repeatEvery)).toBeInTheDocument();
    expect(screen.getByText(translations.repeatOn)).toBeInTheDocument();
    expect(screen.getByText(translations.ends)).toBeInTheDocument();
  });

  describe('RepeatEvery', () => {
    it('should change from singular to plural when number of days is one (day <-> days)', async () => {
      const { interval: initialInterval, frequency: initialFrequency } =
        getDefaultCustomConfig(eventDate).repeatEvery;
      const frequencyToLabelMap = getFrequencyToLabelMap(t);
      const { singular: labelInSingular, plural: labelInPlural } =
        frequencyToLabelMap[initialFrequency];

      render(<RepeatEventCustomConfigModal {...props} />);

      const numericInput = screen.getByDisplayValue(initialInterval);

      expect(numericInput).toBeInTheDocument();
      expect(screen.getByText(labelInSingular)).toBeInTheDocument();

      await userEvent.clear(numericInput);
      fireEvent.change(numericInput, { target: { value: '2' } });
      expect(screen.getByText(labelInPlural)).toBeInTheDocument();

      await userEvent.clear(numericInput);
      fireEvent.change(numericInput, { target: { value: '1' } });
      expect(screen.getByText(labelInSingular)).toBeInTheDocument();
    });

    it('should make the form invalid (and done button disabled) if the input value is 0 or null ("")', async () => {
      const { interval: initialInterval } =
        getDefaultCustomConfig(eventDate).repeatEvery;
      render(<RepeatEventCustomConfigModal {...props} />);

      const numericInput = screen.getByDisplayValue(initialInterval);
      const doneButton = getDoneButton();
      expect(doneButton).toBeEnabled();

      await userEvent.clear(numericInput); // value is ''
      expect(doneButton).toBeDisabled();

      fireEvent.change(numericInput, { target: { value: '2' } });
      expect(doneButton).toBeEnabled();

      await userEvent.clear(numericInput);
      fireEvent.change(numericInput, { target: { value: '0' } }); // value is 0
      expect(doneButton).toBeDisabled();

      await userEvent.clear(numericInput);
      fireEvent.change(numericInput, { target: { value: '1' } });
      expect(doneButton).toBeEnabled();
    });
  });

  describe('RepeatOn', () => {
    it('should render 7 checkboxes, Monday (M) to Sunday (S)', () => {
      render(<RepeatEventCustomConfigModal {...props} />);
      const lis = getCheckboxesUl();

      expect(lis[0]).toHaveTextContent('M');
      expect(lis[1]).toHaveTextContent('T');
      expect(lis[2]).toHaveTextContent('W');
      expect(lis[3]).toHaveTextContent('T');
      expect(lis[4]).toHaveTextContent('F');
      expect(lis[5]).toHaveTextContent('S');
      expect(lis[6]).toHaveTextContent('S');
    });

    it('should make the form valid IF at least one day is selected', async () => {
      render(<RepeatEventCustomConfigModal {...props} />);
      const doneButton = getDoneButton();

      const lis = getCheckboxesUl();
      const mondayCheckbox = getCheckboxToClickOn(lis[0]);
      const tuesdayCheckbox = getCheckboxToClickOn(lis[1]);
      expect(mondayCheckbox).toHaveAttribute('aria-checked', 'true');
      expect(doneButton).toBeEnabled();

      // removing Monday selection
      await userEvent.click(mondayCheckbox);
      expect(mondayCheckbox).toHaveAttribute('aria-checked', 'false');
      expect(doneButton).toBeDisabled();

      // selecting Tuesday
      await userEvent.click(tuesdayCheckbox);
      expect(tuesdayCheckbox).toHaveAttribute('aria-checked', 'true');
      expect(doneButton).toBeEnabled();

      // removing Tuesday selection
      await userEvent.click(tuesdayCheckbox);
      expect(tuesdayCheckbox).toHaveAttribute('aria-checked', 'false');
      expect(doneButton).toBeDisabled();

      // selecting more than one day
      await userEvent.click(tuesdayCheckbox);
      await userEvent.click(mondayCheckbox);
      expect(doneButton).toBeEnabled();

      // selecting all of the days

      // eslint-disable-next-line no-restricted-syntax
      for (const li of lis.slice(2)) {
        // eslint-disable-next-line no-await-in-loop
        await userEvent.click(li.firstChild.firstChild);
      }
      expect(doneButton).toBeEnabled();
    });

    it('should check current day if eventDate matches day key', () => {
      render(
        <RepeatEventCustomConfigModal
          {...props}
          eventDate={moment('2025-10-07T00:00:00.000Z')} // A Tuesday
        />
      );
      const lis = getCheckboxesUl();

      const tuesdayCheckbox = getCheckboxToClickOn(lis[1]);
      expect(tuesdayCheckbox).toHaveAttribute('aria-checked', 'true');
    });

    describe('disabled current day checkbox', () => {
      it('should disable if mode is EDIT and isParentEvent is true', () => {
        const customConfig = getDefaultCustomConfig(eventDate);
        customConfig.repeatOnDays.monday = true;
        render(
          <RepeatEventCustomConfigModal
            {...props}
            customConfig={customConfig}
            isParentEvent
            panelMode="EDIT"
          />
        );
        const lis = getCheckboxesUl();
        const mondayCheckbox = getCheckboxToClickOn(lis[0]);
        expect(mondayCheckbox).toHaveAttribute('aria-disabled', 'true');
      });

      it('should disable if mode is VIEW_TEMPLATES and isParentEvent is false', () => {
        const customConfig = getDefaultCustomConfig(eventDate);
        customConfig.repeatOnDays.monday = true;
        render(
          <RepeatEventCustomConfigModal
            {...props}
            customConfig={customConfig}
            isParentEvent={false}
            panelMode="VIEW_TEMPLATES"
          />
        );
        const lis = getCheckboxesUl();
        const mondayCheckbox = getCheckboxToClickOn(lis[0]);
        expect(mondayCheckbox).toHaveAttribute('aria-disabled', 'true');
      });

      it('should disable if mode is CREATE and isParentEvent is false', () => {
        const customConfig = getDefaultCustomConfig(eventDate);
        customConfig.repeatOnDays.monday = true;
        render(
          <RepeatEventCustomConfigModal
            {...props}
            customConfig={customConfig}
            isParentEvent={false}
            panelMode="CREATE"
          />
        );
        const lis = getCheckboxesUl();
        const mondayCheckbox = getCheckboxToClickOn(lis[0]);
        expect(mondayCheckbox).toHaveAttribute('aria-disabled', 'true');
      });

      it('should NOT disable if mode is EDIT and isParentEvent is false', () => {
        const customConfig = getDefaultCustomConfig(eventDate);
        customConfig.repeatOnDays.monday = true;
        render(
          <RepeatEventCustomConfigModal
            {...props}
            customConfig={customConfig}
            isParentEvent={false}
            panelMode="EDIT"
          />
        );
        const lis = getCheckboxesUl();
        const mondayCheckbox = getCheckboxToClickOn(lis[0]);
        expect(mondayCheckbox).toHaveAttribute('aria-disabled', 'false');
      });
    });
  });

  describe('Ends', () => {
    it('should render three radio buttons', () => {
      render(<RepeatEventCustomConfigModal {...props} />);
      const label = screen.getByText(allTranslations.ends);
      const radioButtonsUl = label.nextSibling;
      const lis = Array.from(radioButtonsUl.childNodes);
      expect(lis[0]).toHaveTextContent(allTranslations.never);
      expect(lis[1]).toHaveTextContent(allTranslations.on);
      expect(lis[2]).toHaveTextContent(allTranslations.after);
    });
    it('should make inputs disabled if their radio button is not selected', async () => {
      render(<RepeatEventCustomConfigModal {...props} />);
      const label = screen.getByText(allTranslations.ends);
      const radioButtonsUl = label.nextSibling;
      const lis = Array.from(radioButtonsUl.childNodes);
      const datePicker = lis[1].querySelector('.datePicker input');
      const afterTimesNumericInput = lis[2].querySelector(
        '.InputNumeric__input'
      );

      const [neverRadio, onRadio, afterRadio] = screen.getAllByLabelText(
        allTranslations.never
      ); // I don't know why, but they all seem to have that label, and not their own label (on, after)

      // verify initial state
      expect(neverRadio).toBeChecked();
      expect(onRadio).not.toBeChecked();
      expect(afterRadio).not.toBeChecked();
      expect(datePicker).toBeDisabled();
      expect(afterTimesNumericInput).toBeDisabled();

      // selecting on should make the date picker enabled
      await userEvent.click(onRadio);
      expect(neverRadio).not.toBeChecked();
      expect(onRadio).toBeChecked();
      expect(afterRadio).not.toBeChecked();
      expect(datePicker).toBeEnabled();
      expect(afterTimesNumericInput).toBeDisabled();

      // selecting after should make the numeric input enabled
      await userEvent.click(afterRadio);
      expect(neverRadio).not.toBeChecked();
      expect(onRadio).not.toBeChecked();
      expect(afterRadio).toBeChecked();
      expect(datePicker).toBeDisabled();
      expect(afterTimesNumericInput).toBeEnabled();

      // returning to the initial state
      await userEvent.click(neverRadio);
      expect(neverRadio).toBeChecked();
      expect(onRadio).not.toBeChecked();
      expect(afterRadio).not.toBeChecked();
      expect(datePicker).toBeDisabled();
      expect(afterTimesNumericInput).toBeDisabled();
    });
  });
  describe('when should RepeatOn appear', () => {
    const repeatEveryTranslations = getRepeatEveryTranslations(t);
    it('should appear only for week and change to default after choosing an option that is not week', async () => {
      const customConfig = getDefaultCustomConfig(eventDate);
      // using baseElement because container is null for some reason - works in other tests.
      const { baseElement } = render(
        <RepeatEventCustomConfigModal {...props} />
      );
      const repeatOnLabel = screen.queryByText(allTranslations.repeatOn);
      expect(repeatOnLabel).toBeInTheDocument();

      const select = baseElement.querySelector('.kitmanReactSelect__control');

      // change to day
      await userEvent.click(select);
      await userEvent.click(screen.getByText(repeatEveryTranslations.day));
      expect(
        screen.queryByText(allTranslations.repeatOn)
      ).not.toBeInTheDocument();

      // change to week - should appear again
      await userEvent.click(select);
      await userEvent.click(screen.getByText(repeatEveryTranslations.week));
      expect(screen.getByText(allTranslations.repeatOn)).toBeInTheDocument();
      const lis = getCheckboxesUl();
      const tuesdayCheckbox = getCheckboxToClickOn(lis[1]);
      expect(tuesdayCheckbox).toHaveAttribute('aria-checked', 'false');
      await userEvent.click(tuesdayCheckbox);

      // change to month
      await userEvent.click(select);
      await userEvent.click(screen.getByText(repeatEveryTranslations.month));
      expect(
        screen.queryByText(allTranslations.repeatOn)
      ).not.toBeInTheDocument();

      // change to year
      await userEvent.click(select);
      await userEvent.click(screen.getByText(repeatEveryTranslations.year));
      expect(
        screen.queryByText(allTranslations.repeatOn)
      ).not.toBeInTheDocument();

      // change to week - should appear again
      await userEvent.click(select);
      await userEvent.click(screen.getByText(repeatEveryTranslations.week));
      expect(screen.getByText(allTranslations.repeatOn)).toBeInTheDocument();

      // checkboxes should be according to the default config
      const lisAfterReappearing = getCheckboxesUl();
      Object.keys(customConfig.repeatOnDays).forEach((day, index) => {
        const checkboxAfterReappearing = getCheckboxToClickOn(
          lisAfterReappearing[index]
        );
        const expectedValue = day === 'monday' ? 'true' : 'false'; // Monday is the date of the event
        expect(checkboxAfterReappearing).toHaveAttribute(
          'aria-checked',
          expectedValue
        );
      });
    });
  });
});
