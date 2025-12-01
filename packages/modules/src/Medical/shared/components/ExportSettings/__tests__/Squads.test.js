import {
  act,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import selectEvent from 'react-select-event';
import ExportSettings from '../index';

const clickDownload = () =>
  userEvent.click(screen.getByRole('button', { name: 'Download' }));

const expectFormState = (onSaveMock, formState) =>
  expect(onSaveMock).toHaveBeenCalledWith(
    formState,
    expect.anything() // will test updateStatus callback down the line
  );

describe('<Squads/>', () => {
  it('renders a select component with single select by default', async () => {
    const onSave = jest.fn();

    act(() => {
      render(
        <ExportSettings
          title="My Settings"
          onSave={onSave}
          onCancel={() => {}}
          isOpen
        >
          <ExportSettings.CommonFields.Squads
            fieldKey="squad_id"
            defaultValue={null}
          />
        </ExportSettings>
      );
    });

    const select = screen.queryByLabelText('Squads');
    const parent = select.closest('.kitmanReactSelect');

    // Waiting for squads to be loaded in dropdown
    await waitForElementToBeRemoved(
      parent.getElementsByClassName('kitmanReactSelect__loading-indicator')[0]
    );

    // See packages/services/src/mocks/handlers/getSquads.js for test data in handler
    await selectEvent.select(select, 'Academy Squad');

    await userEvent.click(screen.getByRole('button', { name: 'Download' }));

    expect(onSave).toHaveBeenCalledWith(
      {
        squad_id: 2,
      },
      expect.anything() // update status not called
    );

    onSave.mockClear();

    // Clicking a different option to confirm single select behaviour by default
    await selectEvent.select(select, 'International Squad');

    await userEvent.click(screen.getByRole('button', { name: 'Download' }));

    expect(onSave).toHaveBeenCalledWith(
      {
        squad_id: 1,
      },
      expect.anything() // update status not called
    );
  });

  it('can override the label with the defaultLabel Prop', async () => {
    const onSave = jest.fn();

    act(() => {
      render(
        <ExportSettings
          title="My Settings"
          onSave={onSave}
          onCancel={() => {}}
          isOpen
        >
          <ExportSettings.CommonFields.Squads
            fieldKey="squad_id"
            label="Export Squads"
            defaultValue={[]}
          />
        </ExportSettings>
      );
    });

    const select = screen.queryByLabelText('Export Squads');
    const parent = select.closest('.kitmanReactSelect');

    // Waiting for squads to be loaded in dropdown
    await waitForElementToBeRemoved(
      parent.getElementsByClassName('kitmanReactSelect__loading-indicator')[0]
    );

    expect(select).toBeInTheDocument();
  });

  it('can set a defaultValue', async () => {
    const onSave = jest.fn();

    act(() => {
      render(
        <ExportSettings
          title="My Settings"
          onSave={onSave}
          onCancel={() => {}}
          isOpen
        >
          <ExportSettings.CommonFields.Squads
            fieldKey="squad_id"
            defaultValue={2}
          />
        </ExportSettings>
      );
    });

    const select = screen.queryByLabelText('Squads');
    const parent = select.closest('.kitmanReactSelect');

    // Waiting for squads to be loaded in dropdown
    await waitForElementToBeRemoved(
      parent.getElementsByClassName('kitmanReactSelect__loading-indicator')[0]
    );

    await userEvent.click(screen.getByRole('button', { name: 'Download' }));

    expect(onSave).toHaveBeenCalledWith(
      {
        squad_id: 2,
      },
      expect.anything() // update status not called
    );
  });

  it('suports squad multi select', async () => {
    const onSave = jest.fn();

    act(() => {
      render(
        <ExportSettings
          title="My Settings"
          onSave={onSave}
          onCancel={() => {}}
          isOpen
        >
          <ExportSettings.CommonFields.Squads
            fieldKey="squad_id"
            defaultValue={[]}
            isMulti
          />
        </ExportSettings>
      );
    });

    const select = screen.queryByLabelText('Squads');
    const parent = select.closest('.kitmanReactSelect');

    // Waiting for squads to be loaded in dropdown
    await waitForElementToBeRemoved(
      parent.getElementsByClassName('kitmanReactSelect__loading-indicator')[0]
    );

    // See packages/services/src/mocks/handlers/getSquads.js for test data in handler
    await selectEvent.select(select, 'Academy Squad');

    await userEvent.click(screen.getByRole('button', { name: 'Download' }));

    expect(onSave).toHaveBeenCalledWith(
      {
        squad_id: [2],
      },
      expect.anything() // update status not called
    );

    onSave.mockClear();

    await selectEvent.select(select, 'International Squad');

    await userEvent.click(screen.getByRole('button', { name: 'Download' }));

    expect(onSave).toHaveBeenCalledWith(
      {
        squad_id: [2, 1],
      },
      expect.anything() // update status not called
    );
  });

  it('supports caching', async () => {
    // Assertions are in util so telling jest that this test has valid assertions
    expect.hasAssertions();

    const onSave = jest.fn();
    const renderComponent = async () => {
      let comp;
      act(() => {
        comp = render(
          <ExportSettings
            title="My Settings"
            onSave={onSave}
            onCancel={() => {}}
            settingsKey="CommonFields.Squads|Cache"
            isOpen
          >
            <ExportSettings.CommonFields.Squads
              fieldKey="squad_id"
              defaultValue={null}
              isCached
            />
          </ExportSettings>
        );
      });
      const select = screen.queryByLabelText('Squads');
      const parent = select.closest('.kitmanReactSelect');

      // Waiting for squads to be loaded in dropdown
      await waitForElementToBeRemoved(
        parent.getElementsByClassName('kitmanReactSelect__loading-indicator')[0]
      );

      return comp;
    };

    const component = await renderComponent();
    const select = screen.queryByLabelText('Squads');

    // Selecting an item
    // See packages/services/src/mocks/handlers/getSquads.js for test data in handler
    await selectEvent.select(select, 'Academy Squad');

    // Clicking download
    await clickDownload();

    // Testing the correct state is on the form
    expectFormState(onSave, {
      squad_id: 2,
    });

    // Clearing mocks
    onSave.mockClear();

    // unmounting component to clear any local states
    component.unmount();

    // Rendering the component again and downloading
    await renderComponent();
    await clickDownload();

    // Component should have the same state as before
    expectFormState(onSave, {
      squad_id: 2,
    });
  });
});
