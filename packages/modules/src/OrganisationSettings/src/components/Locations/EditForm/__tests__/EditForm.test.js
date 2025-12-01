import 'core-js/stable/structured-clone';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  EDIT_BUTTON_TEXT,
  CANCEL_BUTTON_TEXT,
  SAVE_BUTTON_TEXT,
} from '@kitman/modules/src/OrganisationSettings/src/components/CalendarSettings/utils/consts';
import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { locationsMock } from '../../utils/consts';
import {
  LOCATION_TYPE_PLACEHOLDER,
  EVENT_TYPES_PLACEHOLDER,
} from '../utils/consts';
import Locations from '../../index';
import {
  getEventTypesText,
  createLocationTypeValueToLabelMap,
} from '../../utils/helpers';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
describe('<EditForm />', () => {
  const props = { t: i18nextTranslateStub() };

  const errorClass = 'km-error';

  beforeEach(() => {
    useGetPermissionsQuery.mockReturnValue({
      data: {
        eventLocationSettings: {
          canCreateEventLocations: true,
          canEditEventLocations: true,
          canArchiveEventLocations: true,
        },
      },
      isSuccess: true,
    });
  });

  const numberOfElementsInEachRow = 3;

  /**
   * @param {HTMLElement} container
   */
  const removeNewLocation = async (container) => {
    const removeLocationButton = container.querySelector('.icon-close'); // This button doesn't have text
    await userEvent.click(removeLocationButton);
  };

  const addLocation = async () =>
    userEvent.click(screen.getByText('Add New Location'));

  const startEditMode = async () =>
    userEvent.click(await screen.findByText(EDIT_BUTTON_TEXT));

  it('should render the form items properly', async () => {
    render(<Locations {...props} />);
    await startEditMode();

    const allFormValues = screen.getAllByRole('textbox').map((element) => {
      // the select component has a dummy input (textbox)
      if (element.classList.toString().includes('dummyInput-DummyInput')) {
        return element.parentElement.textContent;
      }
      return element.getAttribute('value');
    });

    let valuesToExpect = [];

    const locationTypeValueToLabelMap = createLocationTypeValueToLabelMap();

    locationsMock.forEach(
      ({ name, event_types: eventTypes, location_type: locationType }) => {
        valuesToExpect = valuesToExpect.concat(
          name,
          locationTypeValueToLabelMap[locationType],
          getEventTypesText(eventTypes)
        );
      }
    );

    expect(allFormValues).toEqual(valuesToExpect);
  });

  it('should add an empty location', async () => {
    render(<Locations {...props} />);
    await startEditMode();

    // wait for data to load
    const editForm = await screen.findAllByRole('textbox');
    expect(editForm[0]).toHaveValue(locationsMock[0].name);

    await addLocation();
    const newLocationElements = screen
      .getAllByRole('textbox')
      .slice(-numberOfElementsInEachRow);

    expect(newLocationElements[0]).toHaveValue('');
    expect(newLocationElements[1].parentElement).toHaveTextContent(
      LOCATION_TYPE_PLACEHOLDER
    );
    expect(newLocationElements[2].parentElement).toHaveTextContent(
      EVENT_TYPES_PLACEHOLDER
    );
  });

  it('should add a location and remove it', async () => {
    const component = render(<Locations {...props} />);
    await startEditMode();
    await addLocation();
    await removeNewLocation(component.container);
    expect(screen.getAllByRole('textbox').length).toBe(
      locationsMock.length * numberOfElementsInEachRow
    );
  });

  it('should not alter the original table after mutating and cancelling', async () => {
    render(<Locations {...props} />);
    await startEditMode();

    await addLocation();

    await userEvent.click(screen.getByText(CANCEL_BUTTON_TEXT));

    // 1 for header
    expect(screen.getAllByRole('row').length).toBe(locationsMock.length + 1);
  });

  it('should not show the add new location when the permission is false', async () => {
    useGetPermissionsQuery.mockReturnValue({
      data: {
        eventLocationSettings: {
          canCreateEventLocations: false,
          canEditEventLocations: true,
          canArchiveEventLocations: true,
        },
      },
      isSuccess: true,
    });

    render(<Locations {...props} />);
    await startEditMode();

    expect(screen.queryByText('Add New Location')).not.toBeInTheDocument();
  });

  describe('input field behavior', () => {
    it('should not cause the input field to be invalid after just touching the field', async () => {
      render(<Locations {...props} />);
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
      render(<Locations {...props} />);
      await startEditMode();

      const allInputs = screen.getAllByRole('textbox');
      const input1 = allInputs[0];
      const input2 = allInputs[1];

      await userEvent.clear(input1);
      await userEvent.type(input1, locationsMock[1].name);
      await userEvent.click(input2);
      expect(input1).toHaveClass(errorClass);
      expect(
        screen.getByRole('button', { name: SAVE_BUTTON_TEXT })
      ).toBeDisabled();
    });

    it('should cause the input field to be invalid because the name is already taken - same name, different case', async () => {
      render(<Locations {...props} />);
      await startEditMode();

      const allInputs = screen.getAllByRole('textbox');
      const input1 = allInputs[0];
      const input2 = allInputs[1];

      await userEvent.clear(input1);
      await userEvent.type(input1, locationsMock[1].name.toLocaleLowerCase());
      await userEvent.click(input2);
      expect(input1).toHaveClass(errorClass);
      expect(
        screen.getByRole('button', { name: SAVE_BUTTON_TEXT })
      ).toBeDisabled();
    });

    it('should trim spaces in the input value, which should be invalid', async () => {
      render(<Locations {...props} />);
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
