import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import SelectAndFreetext, { getSelectOptions } from '../index';

describe('SelectAndFreetext', () => {
  describe('getSelectOptions', () => {
    const onsetOptions = [
      {
        id: 1,
        name: 'Acute',
      },
      {
        id: 6,
        name: 'Other',
        require_additional_input: true,
      },
    ];
    it('returns the appropriate mapped object for the onset options passed in', () => {
      expect(getSelectOptions(onsetOptions)).toEqual([
        { label: 'Acute', value: 1 },
        { label: 'Other', requiresText: true, value: 6 },
      ]);
    });
  });

  let component;
  const mockOnUpdateFreetext = jest.fn();

  const renderComponent = (
    currentField,
    currentFreeText,
    textareaLabel = null
  ) =>
    render(
      <SelectAndFreetext
        selectLabel="Mode of Onset"
        selectedField={currentField}
        onSelectedField={jest.fn()}
        currentFreeText={currentFreeText}
        onUpdateFreeText={mockOnUpdateFreetext}
        invalidFields={false}
        textareaLabel={textareaLabel}
        options={[
          { value: 1, label: 'Overuse' },
          { value: 6, label: 'Other', requiresText: true },
        ]}
        featureFlag={window.featureFlags['nfl-injury-flow-fields']}
        t={i18nextTranslateStub()}
      />
    );

  beforeEach(() => {
    window.featureFlags = { 'nfl-injury-flow-fields': true };
    jest.resetAllMocks();
  });

  afterEach(() => {
    window.featureFlags = {};
  });

  describe('initial render', () => {
    beforeEach(() => {
      component = renderComponent(null, '');
    });

    it('renders out the select field label', () => {
      expect(component.getByText('Mode of Onset')).toBeInTheDocument();
    });
  });

  describe('option render', () => {
    beforeEach(() => {
      component = renderComponent(1, 'test');
    });

    it('fires off a reset to the other reason text when an option other than other is selected', () => {
      expect(mockOnUpdateFreetext).toHaveBeenCalledWith('');
    });

    it('renders out the option value selected', () => {
      expect(component.getByText('Overuse')).toBeInTheDocument();
    });

    it('does not render the "other" text area field', () => {
      expect(component.queryByText('Other Reason')).not.toBeInTheDocument();
    });
  });

  describe('"other" option render', () => {
    beforeEach(() => {
      component = renderComponent(6, '');
    });

    it('renders out the option value selected', () => {
      expect(component.getByText('Other')).toBeInTheDocument();
    });

    it('does render the "other" text area field', () => {
      expect(component.getByText('Other Reason')).toBeInTheDocument();
    });

    it('fires an update when the text is edited in the other reason field', async () => {
      await userEvent.type(component.getAllByRole('textbox')[1], 'Z');
      expect(mockOnUpdateFreetext).toHaveBeenCalledWith('Z');
    });
  });

  describe('textareaLabel prop render', () => {
    it('renders correctly', () => {
      component = renderComponent(6, '', 'If Contact With Other, Specify:');

      expect(
        component.getByText('If Contact With Other, Specify:')
      ).toBeInTheDocument();
    });
  });

  describe('Invalid text display', () => {
    it('displays invalid text when displayValidationText and invalid are true', () => {
      render(
        <SelectAndFreetext
          selectLabel="Mode of Onset"
          selectedField={1}
          onSelectedField={jest.fn()}
          currentFreeText=""
          onUpdateFreeText={mockOnUpdateFreetext}
          invalidFields
          displayValidationText
          textareaLabel=""
          options={[
            { value: 1, label: 'Overuse' },
            { value: 6, label: 'Other', requiresText: true },
          ]}
          featureFlag={window.featureFlags['nfl-injury-flow-fields']}
          t={i18nextTranslateStub()}
        />
      );

      expect(screen.queryByText('This field is required')).toBeInTheDocument();
    });

    it('does not display invalid text when displayValidationText or invalid are false', () => {
      component = renderComponent(6, '');
      expect(
        component.queryByText('This field is required')
      ).not.toBeInTheDocument();
    });
  });
});
