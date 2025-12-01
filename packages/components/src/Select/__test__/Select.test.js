import { filterFormationOptions } from '@kitman/modules/src/PlanningEvent/src/components/GameEventsTab/utils';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import selectEvent from 'react-select-event';
import { VirtuosoMockContext } from 'react-virtuoso';
import _cloneDeep from 'lodash/cloneDeep';
import Select from '..';

describe('<Select />', () => {
  let component;
  const props = {
    value: null,
    options: [
      { value: 1, label: '4-4-3' },
      { value: 2, label: '6-3-3' },
      { value: 3, label: '2-2-7' },
      { value: 4, label: '5-2-4' },
      { value: 5, label: '9-0-1' },
      { value: 6, label: '1-2-2' },
      { value: 7, label: '1-1-3' },
      { value: 8, label: '2-2-1' },
      { value: 9, label: '3-1-1' },
      { value: 10, label: '2-1-2' },
      { value: 11, label: '1-2-1' },
    ],
    onClear: jest.fn(),
    onChange: jest.fn(),
    onBlur: jest.fn(),
    t: i18nextTranslateStub(),
    filterOption: filterFormationOptions,
  };

  const subMenuProps = {
    ...props,
    options: [
      ...props.options,
      {
        options: [
          { label: '1-1', value: 13, parentId: 7 },
          { label: '1-2', value: 14, parentId: 7 },
          { label: '1-3', value: 15, parentId: 7 },
        ],
        label: '1-1-2',
        id: 7,
      },
    ],
    value: 1,
    groupBy: 'submenu',
  };

  const renderSelect = (argProps = props) =>
    render(<Select {...argProps} />, {
      wrapper: ({ children }) => (
        <VirtuosoMockContext.Provider
          value={{ viewportHeight: 10000, itemHeight: 50 }}
        >
          {children}
        </VirtuosoMockContext.Provider>
      ),
    });

  describe('default render', () => {
    it('renders the select input component', () => {
      renderSelect();
      const selectInput = screen.getByTestId('selectInput');
      expect(selectInput).toBeInTheDocument();
    });

    it('sets the value prop correctly when a value is selected', () => {
      renderSelect({ ...props, value: 2 });

      expect(screen.getByText('6-3-3')).toBeInTheDocument();
    });

    it('calls the correct prop when selecting an option', async () => {
      renderSelect();
      await selectEvent.select(screen.getByTestId('selectInput'), '2-2-7');
      expect(props.onChange).toHaveBeenCalledWith(3);
    });

    it('calls onChange with an object when returnObject prop is passed', async () => {
      renderSelect({ ...props, returnObject: true });

      await selectEvent.select(screen.getByTestId('selectInput'), '2-2-7');

      expect(props.onChange).toHaveBeenCalledWith({
        label: '2-2-7',
        value: 3,
      });
    });

    describe('when is invalid', () => {
      it('shows the correct styles', () => {
        const { container } = renderSelect({ ...props, invalid: true });

        expect(
          container.querySelector('.kitmanReactSelect--invalid')
        ).toBeInTheDocument();
      });
    });

    it('can render an accessible label', () => {
      renderSelect({ label: 'My Label', ...props });
      renderSelect({ label: 'Another select label', ...props });

      expect(screen.queryByLabelText('My Label')).toBeInTheDocument();
      expect(
        screen.queryByLabelText('Another select label')
      ).toBeInTheDocument();
    });

    describe('when Select is single select and clearable', () => {
      it('displays the clear indicator', () => {
        const { container } = renderSelect({
          ...props,
          value: 2,
          isClearable: true,
        });

        expect(
          container.querySelector('.kitmanReactSelect__clear-indicator')
        ).toBeInTheDocument();
      });

      it('calls the correct prop when clearing', async () => {
        const user = userEvent.setup();
        const { container } = renderSelect({
          ...props,
          value: 2,
          isClearable: true,
        });

        const clearIndicator = container.querySelector(
          '.kitmanReactSelect__clear-indicator'
        );

        await user.click(clearIndicator);

        expect(props.onClear).toHaveBeenCalledTimes(1);
      });
    });

    it("displays an 'optional' text when optional is true", () => {
      const { container } = renderSelect({ ...props, optional: true });

      expect(
        container.querySelector(
          '.kitmanReactSelect__optionalOrRequiredFieldText'
        )
      ).toHaveTextContent('Optional');
    });

    it("displays a 'required' text when required is true", () => {
      const { container } = renderSelect({ ...props, required: true });

      expect(
        container.querySelector(
          '.kitmanReactSelect__optionalOrRequiredFieldText'
        )
      ).toHaveTextContent('Required');
    });
  });

  describe('when the options are grouped', () => {
    it('sets the value prop correctly when values are selected', () => {
      const groupedOptions = [
        {
          label: 'Group 1',
          options: [
            {
              label: 'Item 1',
              value: 'item_1',
            },
          ],
        },
        {
          label: 'Group 2',
          options: [
            {
              label: 'Item 2',
              value: 'item_2',
            },
          ],
        },
      ];

      renderSelect({ ...props, options: groupedOptions, value: 'item_2' });

      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
  });

  describe('when there is more than 10 options', () => {
    it('should filter the select options matching the user input', async () => {
      const options = props.options;
      const matches = {
        0: [options[4].label],
        1: [
          options[4].label,
          options[5].label,
          options[6].label,
          options[7].label,
          options[8].label,
          options[9].label,
          options[10].label,
        ],
        2: [
          options[2].label,
          options[3].label,
          options[5].label,
          options[7].label,
          options[9].label,
          options[10].label,
        ],
        3: [
          options[0].label,
          options[1].label,
          options[6].label,
          options[8].label,
        ],
        4: [options[0].label, options[3].label],
        5: [options[3].label],
        6: [options[1].label],
        7: [options[2].label],
        8: [],
        9: [options[4].label],
        10: [],
      };

      const testMatchScenario = async (matchKey) => {
        const expectedResultList = matches[matchKey];

        // here VirtuosoMockContext is necessary to display all select options
        const { container } = renderSelect(props);
        selectEvent.openMenu(
          container.querySelector('.kitmanReactSelect input')
        );

        // we test that the select displays all its options when focused
        options.forEach((option) => {
          within(
            container.querySelector(`[data-test-id="virtuoso-scroller"]`)
          ).getByText(option.label);
        });

        const searchInput = await screen.findByTestId('selectSearchInput');
        fireEvent.input(searchInput, { target: { value: matchKey } });
        expect(searchInput).toHaveValue(matchKey);

        // we make sure all displayed options match what we expect according to the user input
        const items = Array.from(
          container.querySelectorAll('.kitmanReactSelect__option')
        ).map((i) => i.innerHTML);
        expect(items).toEqual(expectedResultList);
        cleanup();
      };

      // we test multiple input/output scenarios
      await testMatchScenario('0');
      await testMatchScenario('1');
      await testMatchScenario('2');
      await testMatchScenario('3');
      await testMatchScenario('4');
      await testMatchScenario('5');
      await testMatchScenario('6');
      await testMatchScenario('7');
      await testMatchScenario('8');
      await testMatchScenario('9');
      await testMatchScenario('10');
    });
  });

  describe('when it is multiSelectSubMenu', () => {
    const displaySelect = (additionalProps) => {
      renderSelect({
        ...additionalProps,
        ...subMenuProps,
        multiSelectSubMenu: true,
        value: [
          { label: '1-1', value: 13, parentId: 7 },
          { label: '1-2', value: 14, parentId: 7 },
        ],
      });
    };

    it('Correctly displays a multi select value', async () => {
      displaySelect();
      expect(await screen.findByText('1-1, 1-2')).toBeInTheDocument();
    });

    it('When returnParentInValueFromSubMenu is set', async () => {
      displaySelect({ returnParentInValueFromSubMenu: true });
      expect(await screen.findByText('1-1-2 - 1-1, 1-2')).toBeInTheDocument();
    });

    it('When returnParentInValueFromSubMenu is set & the select has been passed parentId but no value', async () => {
      renderSelect({
        ...subMenuProps,
        multiSelectSubMenu: true,
        returnParentInValueFromSubMenu: true,
        value: [{ label: null, value: 13, parentId: 7 }],
      });
      expect(await screen.findByText('1-1-2')).toBeInTheDocument();
    });
    it('Correctly selects value', async () => {
      displaySelect();
      selectEvent.openMenu(screen.getByTestId('selectInput'));
      const labelContainer = screen.getByTestId('labelContainer');
      await selectEvent.select(labelContainer, ['1-1-2']);

      await selectEvent.select(labelContainer, ['1-3']);
      expect(subMenuProps.onChange).toHaveBeenCalledWith([
        { label: '1-1', value: 13, parentId: 7 },
        { label: '1-2', value: 14, parentId: 7 },
        { label: '1-3', value: 15, parentId: 7 },
      ]);
    });

    it('Correctly de-select selected value', async () => {
      displaySelect();
      selectEvent.openMenu(screen.getByTestId('selectInput'));
      const labelContainer = screen.getByTestId('labelContainer');
      await selectEvent.select(labelContainer, ['1-1-2']);

      await selectEvent.select(labelContainer, ['1-1']);
      expect(subMenuProps.onChange).toHaveBeenCalledWith([
        { label: '1-2', value: 14, parentId: 7 },
      ]);
    });

    it('Sets the correct value when a user selects a different parent value', async () => {
      displaySelect();
      selectEvent.openMenu(screen.getByTestId('selectInput'));
      const labelContainer = screen.getByTestId('labelContainer');
      await selectEvent.select(labelContainer, ['2-2-7']);

      expect(subMenuProps.onChange).toHaveBeenCalledWith([
        { value: 3, label: '2-2-7' },
      ]);
    });
  });

  describe('when it is isMulti & multiSelectSubMenu', () => {
    beforeEach(() => {
      renderSelect({
        ...subMenuProps,
        isMulti: true,
        multiSelectSubMenu: true,
        value: [1, 13, 14],
      });
    });

    it('Correctly displays a isMulti value', async () => {
      expect(await screen.findByText('4-4-3, 1-1, 1-2')).toBeInTheDocument();
    });

    it('Correctly selects value', async () => {
      selectEvent.openMenu(screen.getByTestId('selectInput'));
      const labelContainer = screen.getByTestId('labelContainer');
      await selectEvent.select(labelContainer, ['1-1-2']);

      await selectEvent.select(labelContainer, ['1-3']);
      expect(subMenuProps.onChange).toHaveBeenCalledWith([1, 13, 14, 15]);
    });

    it('Correctly de-select selected value', async () => {
      selectEvent.openMenu(screen.getByTestId('selectInput'));
      const labelContainer = screen.getByTestId('labelContainer');
      await selectEvent.select(labelContainer, ['1-1-2']);

      await selectEvent.select(labelContainer, ['1-1']);
      expect(subMenuProps.onChange).toHaveBeenCalledWith([1, 14]);
    });

    it('Sets the correct value when a user selects a different parent value', async () => {
      selectEvent.openMenu(screen.getByTestId('selectInput'));
      const labelContainer = screen.getByTestId('labelContainer');
      await selectEvent.select(labelContainer, ['2-2-7']);

      expect(subMenuProps.onChange).toHaveBeenCalledWith([1, 13, 14, 3]);
    });
  });

  describe('when it is isMulti', () => {
    beforeEach(() => {
      renderSelect({
        ...subMenuProps,
        isMulti: true,
        value: [1, 13, 14],
      });
    });

    it('Correctly displays a isMulti value', async () => {
      expect(await screen.findByText('4-4-3, 1-1, 1-2')).toBeInTheDocument();
    });

    it('Correctly selects value', async () => {
      selectEvent.openMenu(screen.getByTestId('selectInput'));
      const labelContainer = screen.getByTestId('labelContainer');
      await selectEvent.select(labelContainer, ['1-1-2']);

      await selectEvent.select(labelContainer, ['1-3']);
      expect(subMenuProps.onChange).toHaveBeenCalledWith([1, 13, 14, 15]);
    });

    it('Correctly de-select selected value', async () => {
      selectEvent.openMenu(screen.getByTestId('selectInput'));
      const labelContainer = screen.getByTestId('labelContainer');
      await selectEvent.select(labelContainer, ['1-1-2']);

      await selectEvent.select(labelContainer, ['1-1']);
      expect(subMenuProps.onChange).toHaveBeenCalledWith([1, 14]);
    });
  });

  describe('when is isMulti and selectAllGroups is passed in', () => {
    beforeEach(() => {
      renderSelect({
        ...subMenuProps,
        actionsLabel: 'Injury',
        selectAllGroups: true,
        isMulti: true,
        allowSelectAll: true,
        allowClearAll: true,
        isClearable: true,
        value: [],
      });
    });

    it('Correctly selects all values', async () => {
      selectEvent.openMenu(screen.getByTestId('selectInput'));
      expect(await screen.findByText('Injury')).toBeInTheDocument();

      const selectAll = screen.getByText('Select All');
      await userEvent.click(selectAll);
      expect(subMenuProps.onChange).toHaveBeenCalledWith([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15,
      ]);
    });

    it('Correctly clears all values', async () => {
      selectEvent.openMenu(screen.getByTestId('selectInput'));
      expect(await screen.findByText('Injury')).toBeInTheDocument();

      const clearAll = screen.getByText('Clear');
      await userEvent.click(clearAll);
      expect(subMenuProps.onChange).toHaveBeenCalledWith([]);
    });
  });

  describe('when there is submenu options', () => {
    beforeEach(() => {
      component = renderSelect(subMenuProps);
    });

    it('selects a submenu option', async () => {
      selectEvent.openMenu(component.getByTestId('selectInput'));
      await selectEvent.select(
        component.container.querySelector('.kitmanReactSelect__labelContainer'),
        ['1-1-2']
      );
      await selectEvent.select(
        component.container.querySelector('.kitmanReactSelect__labelContainer'),
        ['1-1']
      );
      expect(subMenuProps.onChange).toHaveBeenCalledWith(13);
    });

    it('hover over a option displays the submenu', async () => {
      selectEvent.openMenu(component.getByTestId('selectInput'));
      await userEvent.hover(component.getByText('1-1-2'));
      expect(component.getByText('1-1')).toBeInTheDocument();
      expect(component.getByText('1-2')).toBeInTheDocument();
      await userEvent.unhover(component.getByText('1-1-2'));
      expect(component.queryByText('1-1')).not.toBeInTheDocument();
      expect(component.queryByText('1-2')).not.toBeInTheDocument();
    });

    it('renders the submenu option', () => {
      component = renderSelect({ ...subMenuProps, value: 13 });
      expect(component.getByText('1-1-2 : 1-1')).toBeInTheDocument();
    });

    it('sets the tabIndex', () => {
      component = renderSelect({ ...props, tabIndex: '-1' });
      expect(component.getAllByTestId('selectInput')[1]).toHaveAttribute(
        'tabIndex',
        '-1'
      );
    });
  });

  describe('when the list is non-virtuoso', () => {
    it('hover over a option displays the submenu', async () => {
      const nonVirtuosoProps = {
        options: [
          {
            value: 1,
            label: '4-4-3',
          },
          { value: 2, label: '6-3-3' },
          { value: 3, label: '2-2-7' },
          { value: 4, label: '5-2-4' },
          {
            value: 5,
            label: '1-1-2',
            options: [
              { label: '1-1', value: 13 },
              { label: '1-2', value: 14 },
            ],
          },
        ],
        onClear: jest.fn(),
        onChange: jest.fn(),
        onBlur: jest.fn(),
        t: (text) => text,
        filterOption: filterFormationOptions,
        value: 5,
        groupBy: 'submenu',
      };
      const nonVirtualComponent = render(<Select {...nonVirtuosoProps} />);
      await userEvent.click(nonVirtualComponent.getByRole('textbox'));
      await userEvent.hover(nonVirtualComponent.getByText('1-1-2'));
      expect(nonVirtualComponent.queryByText('1-1')).toBeInTheDocument();
      expect(nonVirtualComponent.queryByText('1-2')).toBeInTheDocument();
      await userEvent.unhover(nonVirtualComponent.getByText('1-1-2'));
      expect(nonVirtualComponent.queryByText('1-1')).not.toBeInTheDocument();
      expect(nonVirtualComponent.queryByText('1-2')).not.toBeInTheDocument();
    });
  });

  describe('when an icon configuration is passed in', () => {
    const iconConfigProps = {
      label: 'Icon Config Select',
      value: null,
      options: [
        {
          value: 1,
          label: 'Label 1',
        },
        { value: 2, label: 'Label 2' },
        { value: 3, label: 'Label 3' },
      ],
      onChange: jest.fn(),
      includeIconConfig: {
        iconName: 'icon-bin',
        onClick: jest.fn(),
      },
      t: (text) => text,
    };
    it('the icon buttons exist', async () => {
      render(<Select {...iconConfigProps} />);
      const selectContainer = screen.getByRole('textbox');
      expect(selectContainer).toBeInTheDocument();

      await userEvent.click(selectContainer);

      expect(screen.getAllByTestId('IconConfigButton').length).toEqual(3);
    });

    it('when clicking the icon button, the select onChange is NOT fired', async () => {
      render(<Select {...iconConfigProps} />);
      const selectContainer = screen.getByRole('textbox');
      expect(selectContainer).toBeInTheDocument();

      await userEvent.click(selectContainer);

      const iconButtons = screen.getAllByTestId('IconConfigButton');
      await userEvent.click(within(iconButtons[0]).getByRole('button'));

      await waitFor(() => {
        expect(iconConfigProps.includeIconConfig.onClick).toHaveBeenCalledTimes(
          1
        );
        expect(iconConfigProps.includeIconConfig.onClick).toHaveBeenCalledWith(
          1
        );
      });
      expect(iconConfigProps.onChange).toHaveBeenCalledTimes(0);
    });

    it('when clicking the label, the icon onClick is NOT fired', async () => {
      render(<Select {...iconConfigProps} />);
      const selectContainer = screen.getByRole('textbox');
      expect(selectContainer).toBeInTheDocument();

      await userEvent.click(selectContainer);

      const iconLabel = screen.getByText('Label 2');
      await userEvent.click(iconLabel);

      await waitFor(() => {
        expect(iconConfigProps.onChange).toHaveBeenCalledTimes(1);
      });
      expect(iconConfigProps.includeIconConfig.onClick).toHaveBeenCalledTimes(
        0
      );
    });
  });

  describe('when `valueContainerContent` and `isMulti` props are passed', () => {
    const valueContainerContent = 'value container content';
    const propsWithValueContainerContent = {
      value: [1, 2],
      valueContainerContent,
      options: [
        {
          value: 1,
          label: 'Label 1',
        },
        { value: 2, label: 'Label 2' },
        { value: 3, label: 'Label 3' },
      ],
      isMulti: true,
      t: (text) => text,
    };

    it('shows the value of `valueContainerContent` prop', async () => {
      render(<Select {...propsWithValueContainerContent} />);

      expect(screen.getByText(valueContainerContent)).toBeInTheDocument();
    });
  });

  describe('Invalid text display', () => {
    it('displays invalid text when displayValidationText and invalid are true', () => {
      render(<Select {...props} displayValidationText invalid />);
      expect(screen.queryByText('This field is required')).toBeInTheDocument();
    });

    it('does not display invalid text when displayValidationText or invalid are false', () => {
      render(<Select {...props} invalid={false} />);
      expect(
        screen.queryByText('This field is required')
      ).not.toBeInTheDocument();
    });
  });

  describe('Pair the Select component with icon', () => {
    it('should display an icon button when associated props are passed', () => {
      const updatedProps = _cloneDeep(props);
      updatedProps.labelIcon = 'icon-close';
      updatedProps.onClickIcon = jest.fn();
      render(<Select {...updatedProps} />);
      const icon = screen.getByRole('button', { className: /icon-close/ });
      expect(icon).toBeInTheDocument();
    });

    it('should not display an icon button when associated props are passed', () => {
      render(<Select {...props} />);
      const icon = screen.queryByRole('button', { className: /icon-close/ });
      expect(icon).not.toBeInTheDocument();
    });
  });

  describe('when hideOnSearch is enabled', () => {
    beforeEach(() => {
      renderSelect({
        ...props,
        allowSelectAll: true,
        allowClearAll: true,
        selectAllGroups: true,
        isMulti: true,
        isClearable: true,
        hideOnSearch: true,
      });
    });

    it('displays Select All and Clear buttons when not searching', async () => {
      selectEvent.openMenu(screen.getByTestId('selectInput'));
      expect(screen.queryByText('Select All')).toBeInTheDocument();
      expect(screen.queryByText('Clear')).toBeInTheDocument();
    });

    it('hides Select All and Clear buttons when searching', async () => {
      selectEvent.openMenu(screen.getByTestId('selectInput'));

      const searchInput = await screen.findByTestId('selectSearchInput');
      fireEvent.input(searchInput, { target: { value: 'test' } });

      expect(screen.queryByText('Select All')).not.toBeInTheDocument();
      expect(screen.queryByText('Clear')).not.toBeInTheDocument();
    });

    it('restores Select All and Clear All buttons when search is cleared', async () => {
      selectEvent.openMenu(screen.getByTestId('selectInput'));

      const searchInput = await screen.findByTestId('selectSearchInput');
      fireEvent.input(searchInput, { target: { value: 'test' } });

      expect(screen.queryByText('Select All')).not.toBeInTheDocument();
      expect(screen.queryByText('Clear')).not.toBeInTheDocument();

      fireEvent.input(searchInput, { target: { value: '' } });

      expect(screen.queryByText('Select All')).toBeInTheDocument();
      expect(screen.queryByText('Clear')).toBeInTheDocument();
    });
  });

  describe('when hideOnSearch is false', () => {
    beforeEach(() => {
      renderSelect({
        ...props,
        allowSelectAll: true,
        allowClearAll: true,
        hideOnSearch: false,
        selectAllGroups: true,
        isMulti: true,
        isClearable: true,
      });
    });

    it('displays Select All and Clear All buttons when searching and hideOnSearch is false', async () => {
      selectEvent.openMenu(screen.getByTestId('selectInput'));

      const searchInput = await screen.findByTestId('selectSearchInput');
      fireEvent.input(searchInput, { target: { value: 'test' } });

      expect(screen.queryByText('Select All')).toBeInTheDocument();
      expect(screen.queryByText('Clear')).toBeInTheDocument();
    });
  });

  describe('customPlaceholderRenderer', () => {
    it('should render placeholder when customPlaceholderRenderer returns true', () => {
      renderSelect({
        ...props,
        label: 'My Label',
        placeholder: 'Custom placeholder',
        customPlaceholderRenderer: () => true,
      });

      expect(screen.getByText('Custom placeholder')).toBeInTheDocument();
    });
  });

  describe('option tooltip', () => {
    it('does not show description tooltip', async () => {
      const { container } = renderSelect({
        ...props,
        options: [
          { value: 1, label: 'Label 1', description: 'Desc 1' },
          { value: 2, label: 'Label 2', description: 'Desc 2' },
        ],
      });

      selectEvent.openMenu(container.querySelector('.kitmanReactSelect input'));

      await userEvent.hover(screen.getByText('Label 1'));
      expect(screen.queryByText('Desc 1')).not.toBeInTheDocument();
    });

    it('does not show description tooltip when showOptionTooltip is false', async () => {
      const { container } = renderSelect({
        ...props,
        options: [
          { value: 1, label: 'Label 1', description: 'Desc 1' },
          { value: 2, label: 'Label 2', description: 'Desc 2' },
        ],
        showOptionTooltip: false,
      });

      selectEvent.openMenu(container.querySelector('.kitmanReactSelect input'));

      await userEvent.hover(screen.getByText('Label 1'));
      expect(screen.queryByText('Desc 1')).not.toBeInTheDocument();
    });

    it('shows description tooltip when showOptionTooltip is enabled', async () => {
      const { container } = renderSelect({
        ...props,
        options: [
          { value: 1, label: 'Label 1', description: 'Desc 1' },
          { value: 2, label: 'Label 2', description: 'Desc 2' },
        ],
        showOptionTooltip: true,
      });

      selectEvent.openMenu(container.querySelector('.kitmanReactSelect input'));

      await userEvent.hover(screen.getByText('Label 1'));
      expect(await screen.findByText('Desc 1')).toBeInTheDocument();
    });
  });
});
