import 'core-js/stable/structured-clone';
import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import { axios } from '@kitman/common/src/utils/services';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  data,
  dataWithoutChildren,
} from '@kitman/services/src/mocks/handlers/OrganisationSettings/CalendarSettings/EventTypes/getEventTypes';
import EventTypes from '../../index';
import {
  CANCEL_BUTTON_TEXT,
  EDIT_BUTTON_TEXT,
  SAVE_BUTTON_TEXT,
} from '../../../utils/consts';
import {
  mapResponseEventTypeToIP,
  prepareEventsInGroups,
} from '../../utils/groups-helpers';
import * as hooks from '../../../utils/hooks';

const numberOfEventsAtStart = data.length;

const numberOfElementsInRow = 1;
const numberOfElementsInRowScopedSquads = 2;

describe('<EditForm />', () => {
  const t = i18nextTranslateStub();
  const props = {
    t,
  };

  const addEventToGroupButtonText = 'Add event to group';
  const addGroupButtonText = 'Add Group';
  const addNewUngroupedEventButtonText = 'Add New Event';

  const errorClass = 'km-error';

  const useGetCalendarSettingsPermissionsSpy = jest.spyOn(
    hooks,
    'useGetCalendarSettingsPermissions'
  );
  beforeEach(() => {
    useGetCalendarSettingsPermissionsSpy.mockReturnValue({
      canArchiveCustomEvents: true,
      canCreateCustomEvents: true,
      canEditCustomEvents: true,
    });
  });

  /**
   * @returns {HTMLElement}
   */
  const renderComponent = async () => {
    let renderedComponent;
    await act(async () => {
      renderedComponent = renderWithRedux(<EventTypes {...props} />, {
        preloadedState: { orgSettings: { graphColourPalette: [] } },
        useGlobalStore: false,
      });
    });
    return renderedComponent;
  };

  const mappedData = data.map(mapResponseEventTypeToIP);

  const { groups } = prepareEventsInGroups(mappedData, t);

  const addEventToFirstGroupAndVerify = async () => {
    await userEvent.click(screen.getAllByText(addEventToGroupButtonText)[0]);
    const allInputs = screen.getAllByRole('textbox');

    const newInputIndex = groups[0].children.length + 1; //  + 1 for the parent, also an input
    expect(allInputs[newInputIndex]).toHaveValue('');
  };

  /**
   * @param {HTMLElement} container
   */
  const removeNewEvent = async (container) => {
    const removeEventButton = container.querySelector('.icon-close'); // This button doesn't have text
    await userEvent.click(removeEventButton);
  };

  const addGroup = async () =>
    userEvent.click(screen.getByText(addGroupButtonText));

  const addUngroupedEvent = async () =>
    userEvent.click(screen.getByText(addNewUngroupedEventButtonText));

  const startEditMode = async () =>
    userEvent.click(screen.getByText(EDIT_BUTTON_TEXT));

  const eventsTypeLabel = 'Events Type';
  const squadsLabel = 'Squad';

  it('should render the form items properly', async () => {
    const component = await renderComponent();
    await startEditMode();

    const allInputValues = screen
      .getAllByRole('textbox')
      .map((element) => element.getAttribute('value'))
      .filter((value) => value.length > 0);

    const namesToExpect = data.map(({ name }) => name);

    expect(allInputValues).toEqual(namesToExpect);
    expect(screen.getAllByText(eventsTypeLabel).length).toBe(2); // 1 for the only group and 1 for the ungrouped
    expect(screen.getAllByTestId('ColorPicker|SwatchColor').length).toBe(3);
    expect(screen.getAllByText('Aa').length).toBe(3);
    expect(screen.queryAllByText(squadsLabel).length).toBe(0); // FF is off

    expect(component.mockedStore.dispatch).toHaveBeenCalledTimes(2);
  });

  it("should not render labels for group's children if there aren't any children", async () => {
    jest
      .spyOn(axios, 'get')
      .mockImplementationOnce(() => ({ data: dataWithoutChildren }));

    await renderComponent();
    await startEditMode();

    expect(screen.getAllByText(eventsTypeLabel).length).toBe(1); // 1 for the ungrouped
    expect(screen.queryAllByText(squadsLabel).length).toBe(0); // FF is off
  });

  describe('permissions', () => {
    it("shouldn't display add event/group buttons because the user doesn't have permissions to create", async () => {
      useGetCalendarSettingsPermissionsSpy.mockReturnValue({
        canArchiveCustomEvents: true,
        canCreateCustomEvents: false,
        canEditCustomEvents: true,
      });
      await renderComponent();
      await startEditMode();

      expect(screen.queryAllByText(addEventToGroupButtonText).length).toBe(0);
      expect(screen.queryByText(addGroupButtonText)).not.toBeInTheDocument();
      expect(
        screen.queryByText(addNewUngroupedEventButtonText)
      ).not.toBeInTheDocument();
    });

    it('should display add event/group buttons because the user has permissions to create', async () => {
      useGetCalendarSettingsPermissionsSpy.mockReturnValue({
        canArchiveCustomEvents: true,
        canCreateCustomEvents: true,
        canEditCustomEvents: true,
      });
      await renderComponent();
      await startEditMode();

      expect(
        screen.getAllByText(addEventToGroupButtonText).length
      ).toBeGreaterThan(0);
      expect(screen.getByText(addGroupButtonText)).toBeInTheDocument();
      expect(
        screen.getByText(addNewUngroupedEventButtonText)
      ).toBeInTheDocument();
    });
  });

  // The function addEventToFirstGroupAndVerify has an expect clause
  // eslint-disable-next-line jest/expect-expect
  it('should add an empty event to the first group', async () => {
    await renderComponent();
    await startEditMode();
    await addEventToFirstGroupAndVerify();
  });

  it('should remove a newly created empty event from the first group', async () => {
    const component = await renderComponent(<EventTypes t={t} />);
    await startEditMode();
    await addEventToFirstGroupAndVerify();

    await removeNewEvent(component.container);
    expect(screen.getAllByRole('textbox').length).toBe(
      numberOfElementsInRow * numberOfEventsAtStart
    );
  });

  it('should add an ungrouped event and remove it', async () => {
    const component = await renderComponent();
    await startEditMode();

    // add
    await addUngroupedEvent();
    const allInputs = screen.getAllByRole('textbox');

    // the ungrouped are always the last (before adding other groups)
    expect(allInputs[allInputs.length - 1]).toHaveValue('');

    // remove
    await removeNewEvent(component.container);
    expect(screen.getAllByRole('textbox').length).toBe(
      numberOfElementsInRow * numberOfEventsAtStart
    );
  });

  it('should add another group', async () => {
    await renderComponent();
    await startEditMode();

    // add
    await addGroup();
    const allInputs = screen.getAllByRole('textbox');

    // the new group is always appended to the end
    allInputs.slice(-2).forEach((input) => expect(input).toHaveValue(''));

    // 2 because each group is instantiated with a parent event
    // and a child event, both of which are inputs
    expect(allInputs.length).toBe(
      numberOfElementsInRow * (numberOfEventsAtStart + 2)
    );
  });

  describe(`with the squad-scoped-custom-events FF on`, () => {
    beforeEach(() => {
      window.featureFlags['squad-scoped-custom-events'] = true;
    });
    afterEach(() => {
      window.featureFlags['squad-scoped-custom-events'] = false;
    });

    it('should render the form items properly - with scoped squads FF on', async () => {
      await renderComponent();
      await startEditMode();

      const allInputValues = screen
        .getAllByRole('textbox')
        .map((element) => element.getAttribute('value'))
        .filter((value) => value.length > 0);

      const namesToExpect = [];
      const squadNamesCount = {};

      data.forEach((event) => {
        namesToExpect.push(event.name);
        event.squads.forEach(({ name: squadName }) => {
          if (squadNamesCount[squadName]) {
            squadNamesCount[squadName] += 1;
          } else {
            squadNamesCount[squadName] = 1;
          }
        });
      });

      Object.entries(squadNamesCount).forEach(([name, count]) => {
        expect(screen.getAllByText(name).length).toBe(count);
      });

      expect(allInputValues).toEqual(namesToExpect);
      expect(screen.getAllByText(eventsTypeLabel).length).toBe(2); // 1 for the only group and 1 for the ungrouped
      expect(screen.getAllByText(squadsLabel).length).toBe(3); // // 1 for the only group, 1 for its children and 1 for the ungrouped
    });

    it("should not render labels for group's children if there aren't any children", async () => {
      jest
        .spyOn(axios, 'get')
        .mockImplementationOnce(() => ({ data: dataWithoutChildren }));

      await renderComponent();
      await startEditMode();

      expect(screen.getAllByText(eventsTypeLabel).length).toBe(1); // 1 for the ungrouped
      expect(screen.queryAllByText(squadsLabel).length).toBe(2); // 1 for the only group and 1 for the ungrouped
    });

    it('should remove a newly created empty event from the first group', async () => {
      const component = await renderComponent(<EventTypes t={t} />);
      await startEditMode();
      await addEventToFirstGroupAndVerify();

      await removeNewEvent(component.container);
      expect(screen.getAllByRole('textbox').length).toBe(
        numberOfElementsInRowScopedSquads * numberOfEventsAtStart
      );
    });

    it('should add an ungrouped event and remove it', async () => {
      const component = await renderComponent();
      await startEditMode();

      // add
      await addUngroupedEvent();
      const allInputs = screen.getAllByRole('textbox');

      // the ungrouped are always the last (before adding other groups)
      expect(allInputs[allInputs.length - 1]).toHaveValue('');

      // remove
      await removeNewEvent(component.container);
      expect(screen.getAllByRole('textbox').length).toBe(
        numberOfElementsInRowScopedSquads * numberOfEventsAtStart
      );
    });

    it('should add another group', async () => {
      await renderComponent();
      await startEditMode();

      // add
      await addGroup();
      const allInputs = screen.getAllByRole('textbox');

      // the new group is always appended to the end
      allInputs.slice(-2).forEach((input) => expect(input).toHaveValue(''));

      // 2 because each group is instantiated with a parent event
      // and a child event, both of which are inputs
      expect(allInputs.length).toBe(
        numberOfElementsInRowScopedSquads * (numberOfEventsAtStart + 2)
      );
    });

    it("should remove a child's squad if it's removed from its parent", async () => {
      const { container } = await renderComponent(<EventTypes t={t} />);
      await startEditMode();
      // eslint-disable-next-line no-unused-vars
      const [parentSelect, childSelect, ...restSelects] =
        container.querySelectorAll('.kitmanReactSelect__value-container');

      // select squad for parent
      await userEvent.click(parentSelect);
      const option = container.querySelector('.kitmanReactSelect__option');
      const optionText = option.textContent;
      await userEvent.click(option);
      expect(screen.getAllByText(optionText).length).toBe(1);

      // select squad for child
      await userEvent.click(childSelect);
      await userEvent.click(
        container.querySelector('.kitmanReactSelect__option')
      );
      expect(screen.getAllByText(optionText).length).toBe(2);

      // de-select squad from parent, should disappear from the child
      await userEvent.click(parentSelect);
      await userEvent.click(
        container.querySelector('.kitmanReactSelect__option')
      );
      expect(screen.queryAllByText(optionText).length).toBe(0);
    });
  });

  it('should not alter the original table after mutating and cancelling', async () => {
    await renderComponent();
    await startEditMode();

    await addEventToFirstGroupAndVerify();
    await addGroup();
    await addUngroupedEvent();

    await userEvent.click(screen.getByText(CANCEL_BUTTON_TEXT));

    // 1 for header + 1 for the 'ungrouped' row
    expect(screen.getAllByRole('row').length).toBe(numberOfEventsAtStart + 2);
  });
  describe('input field behavior', () => {
    it('should not cause the input field to be invalid after just touching the field', async () => {
      await renderComponent();
      await startEditMode();

      const allInputs = screen.getAllByRole('textbox');

      await userEvent.click(allInputs[0]);
      await userEvent.click(allInputs[1]);
      expect(allInputs[0]).not.toHaveClass(errorClass);
      expect(
        screen.getByRole('button', { name: SAVE_BUTTON_TEXT })
      ).toBeEnabled();
    });

    it('should cause the input field to be invalid because the name is already taken - same name', async () => {
      await renderComponent();
      await startEditMode();

      const allInputs = screen.getAllByRole('textbox');
      const input1 = allInputs[0];
      const input2 = allInputs[1];

      const newDuplicateName = groups[0].children[0].name;

      await userEvent.clear(input1);
      await userEvent.type(input1, newDuplicateName);
      await userEvent.click(input2);
      expect(input1).toHaveClass(errorClass);
      expect(
        screen.getByRole('button', { name: SAVE_BUTTON_TEXT })
      ).toBeDisabled();
    });

    it('should cause the input field to be invalid because the name is already taken - same name, different case', async () => {
      await renderComponent();
      await startEditMode();

      const allInputs = screen.getAllByRole('textbox');
      const input1 = allInputs[0];
      const input2 = allInputs[1];

      const newDuplicateName = groups[0].children[0].name;

      await userEvent.clear(input1);
      await userEvent.type(input1, newDuplicateName.toLocaleLowerCase());
      await userEvent.click(input2);
      expect(input1).toHaveClass(errorClass);
      expect(
        screen.getByRole('button', { name: SAVE_BUTTON_TEXT })
      ).toBeDisabled();
    });

    it('should trim spaces in the input value, which should be invalid', async () => {
      await renderComponent();
      await startEditMode();

      const allInputs = screen.getAllByRole('textbox');
      const input1 = allInputs[0];
      const input2 = allInputs[1];

      await userEvent.clear(input1);
      await userEvent.type(input1, ' ');
      await userEvent.click(input2);

      expect(input1).toHaveClass(errorClass);
      expect(
        screen.getByRole('button', { name: SAVE_BUTTON_TEXT })
      ).toBeDisabled();
    });
  });
});
