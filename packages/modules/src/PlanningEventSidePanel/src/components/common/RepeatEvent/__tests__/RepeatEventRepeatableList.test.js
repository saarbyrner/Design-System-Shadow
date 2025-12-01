import { screen, waitFor } from '@testing-library/react';

import getRecurrencePreferences from '@kitman/services/src/services/planning/getRecurrencePreferences';
import { data } from '@kitman/services/src/mocks/handlers/planningHub/getRecurrencePreferences';
import { renderWithUserEventSetup } from '@kitman/common/src/utils/test_utils';

import RepeatEventRepeatableList from '../RepeatEventRepeatableList';

jest.mock('@kitman/services/src/services/planning/getRecurrencePreferences');

describe('<RepeatEventRepeatableList />', () => {
  const mockProps = {
    updateRecurrencePreferences: jest.fn(),
    rrule: 'DTSTART:20240319T080000\nRRULE:FREQ=DAILY',
    selectedRecurrencePreferences: [],
    eventDate: new Date(
      'Tue Apr 01 2025 14:05:00 GMT+0100 (British Summer Time)'
    ),
  };

  const renderAndAwait = async (props = mockProps) => {
    const { user } = renderWithUserEventSetup(
      <RepeatEventRepeatableList {...props} />
    );
    await waitFor(() => {
      expect(getRecurrencePreferences).toHaveBeenCalled();
    });
    return { user };
  };

  it('should not render if there are no recurrencePreferencesOptions', async () => {
    getRecurrencePreferences.mockReturnValue([]);
    await renderAndAwait();

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('should render and map checkboxes based on recurrencePreferencesOptions', async () => {
    getRecurrencePreferences.mockReturnValue(data);
    await renderAndAwait();

    expect(screen.queryAllByRole('checkbox').length).toEqual(
      data.preferences.length
    );
  });

  it('should check all checkboxes if selectedRecurrencePreferences is null and call updateRecurrencePreferences', async () => {
    getRecurrencePreferences.mockReturnValue(data);
    await renderAndAwait({ ...mockProps, selectedRecurrencePreferences: null });

    screen
      .getAllByRole('checkbox')
      .every((checkbox) => expect(checkbox).toBeChecked());
    expect(mockProps.updateRecurrencePreferences).toHaveBeenCalledWith(
      data.preferences
    );
  });

  it('should check the checkboxes mapped to selectedRecurrencePreferences', async () => {
    const mockSelectedRecurrencePreferences = [
      {
        id: 1,
        preference_name: 'Session objectives',
        perma_id: 'session_objectives',
      },
      {
        id: 5,
        preference_name: 'Location',
        perma_id: 'location',
      },
    ];
    getRecurrencePreferences.mockReturnValue(data);
    await renderAndAwait({
      ...mockProps,
      selectedRecurrencePreferences: mockSelectedRecurrencePreferences,
    });

    expect(
      screen.getAllByRole('checkbox').filter((checkbox) => checkbox.checked)
    ).toHaveLength(mockSelectedRecurrencePreferences.length);
  });

  it('should call updateRecurrencePreferences on click of checkbox with correct params', async () => {
    getRecurrencePreferences.mockReturnValue(data);
    const { user } = await renderAndAwait();

    await user.click(screen.queryAllByRole('checkbox')[0]);
    expect(mockProps.updateRecurrencePreferences).toHaveBeenCalledWith([
      {
        id: 1,
        preference_name: 'Session objectives',
        perma_id: 'session_objectives',
      },
    ]);
  });

  it('should disable surface type if surface-type-mandatory-sessions is true', async () => {
    window.setFlag('surface-type-mandatory-sessions', true);
    getRecurrencePreferences.mockReturnValue(data);
    await renderAndAwait();

    expect(
      screen.getByRole('button', { name: 'Surface type' })
      // MUI ListItemButton is just a div with role="button", not semantically an actually
      // <button />
    ).toHaveAttribute('aria-disabled', 'true');
  });

  it('should not disable surface type if surface-type-mandatory-sessions is false', async () => {
    window.setFlag('surface-type-mandatory-sessions', false);
    getRecurrencePreferences.mockReturnValue(data);
    await renderAndAwait();

    expect(
      screen.getByRole('button', { name: 'Surface type' })
    ).not.toHaveAttribute('aria-disabled', 'true');
  });

  it('should disable athletes if there are no athletes and panelMode is `CREATE`', async () => {
    getRecurrencePreferences.mockReturnValue(data);
    await renderAndAwait({
      ...mockProps,
      hasAthletes: false,
      panelMode: 'CREATE',
    });

    expect(screen.getByRole('button', { name: 'Athletes' })).toHaveAttribute(
      'aria-disabled',
      'true'
    );
  });

  it('should not disable athletes if there are no athletes but panelMode is `EDIT`', async () => {
    getRecurrencePreferences.mockReturnValue(data);
    await renderAndAwait({
      ...mockProps,
      hasAthletes: false,
      panelMode: 'EDIT',
    });

    expect(
      screen.getByRole('button', { name: 'Athletes' })
    ).not.toHaveAttribute('aria-disabled', 'true');
  });
});
