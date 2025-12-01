import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import ExportSettings from '../index';

const clickDownload = () =>
  userEvent.click(screen.getByRole('button', { name: 'Download' }));

const expectFormState = (onSaveMock, formState) =>
  expect(onSaveMock).toHaveBeenCalledWith(
    formState,
    expect.anything() // will test updateStatus callback down the line
  );

describe('<ExportSettings />', () => {
  it('displays a supplied title and any children when open', async () => {
    render(
      <ExportSettings
        title="My Settings"
        onSave={() => {}}
        onCancel={() => {}}
        isOpen
      >
        <div>Export settings</div>
      </ExportSettings>
    );

    await waitFor(() =>
      expect(screen.queryByText('My Settings')).toBeInTheDocument()
    );
    expect(screen.queryByText('Export settings')).toBeInTheDocument();
  });

  it('does not display a supplied title and any children when closed', async () => {
    render(
      <ExportSettings
        title="My Settings"
        onSave={() => {}}
        onCancel={() => {}}
        isOpen={false}
      >
        <div>Export settings</div>
      </ExportSettings>
    );

    expect(screen.queryByText('My Settings')).not.toBeVisible();
    expect(screen.queryByText('Export settings')).not.toBeVisible();
  });

  it('displays an active download button if no requiredKeys', async () => {
    render(
      <ExportSettings
        title="My Settings"
        onSave={() => {}}
        onCancel={() => {}}
        isOpen
      >
        <ExportSettings.Field fieldKey="requiredField" defaultValue="">
          {({ value, onChange }) => (
            <input value={value} onChange={(e) => onChange(e.target.value)} />
          )}
        </ExportSettings.Field>
      </ExportSettings>
    );

    const downloadButton = screen.getByRole('button', { name: 'Download' });
    expect(downloadButton).toBeEnabled();
  });

  it('displays save button with a custom title', async () => {
    render(
      <ExportSettings
        title="My Settings"
        onSave={() => {}}
        onCancel={() => {}}
        saveButtonTitle="Export"
        isOpen
      >
        <ExportSettings.Field fieldKey="requiredField" defaultValue="">
          {({ value, onChange }) => (
            <input value={value} onChange={(e) => onChange(e.target.value)} />
          )}
        </ExportSettings.Field>
      </ExportSettings>
    );

    expect(
      screen.queryByRole('button', { name: 'Download' })
    ).not.toBeInTheDocument();
    const exportButton = screen.getByRole('button', { name: 'Export' });
    expect(exportButton).toBeEnabled();
  });

  it('displays an inactive download button if requiredKeys not fulfilled', async () => {
    render(
      <ExportSettings
        title="My Settings"
        onSave={() => {}}
        onCancel={() => {}}
        requiredKeys={['requiredField']}
        isOpen
      >
        <ExportSettings.Field fieldKey="requiredField" defaultValue="">
          {({ value, onChange }) => (
            <input value={value} onChange={(e) => onChange(e.target.value)} />
          )}
        </ExportSettings.Field>
      </ExportSettings>
    );

    const downloadButton = screen.getByRole('button', { name: 'Download' });
    expect(downloadButton).toBeDisabled();
  });

  it('displays an active download button if requiredKeys fulfilled', async () => {
    render(
      <ExportSettings
        title="My Settings"
        onSave={() => {}}
        onCancel={() => {}}
        requiredKeys={['requiredField']}
        isOpen
      >
        <ExportSettings.Field fieldKey="requiredField" defaultValue="">
          {({ value, onChange }) => (
            <input
              data-testid="testRequiredField"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          )}
        </ExportSettings.Field>
      </ExportSettings>
    );
    await userEvent.type(
      screen.getByTestId('testRequiredField'),
      'Valid value'
    );
    const downloadButton = screen.getByRole('button', { name: 'Download' });
    expect(downloadButton).toBeEnabled();
  });

  it('triggers the onCancel callback when closing the sidepanel', async () => {
    const onCancel = jest.fn();
    const { container } = render(
      <ExportSettings
        title="My Settings"
        onSave={() => {}}
        onCancel={onCancel}
        isOpen
      >
        <div>Export settings</div>
      </ExportSettings>
    );

    await userEvent.click(container.getElementsByClassName('icon-close')[0]);

    expect(onCancel).toHaveBeenCalled();
  });

  it('can use a field that resets its value when closing', async () => {
    const onSave = jest.fn();
    const TestComponent = () => {
      const [isOpen, setIsOpen] = useState(true);

      return (
        <>
          <button type="button" onClick={() => setIsOpen(!isOpen)}>
            Toggle my button
          </button>
          <ExportSettings
            title="My Settings"
            onSave={onSave}
            onCancel={() => {}}
            isOpen={isOpen}
          >
            <ExportSettings.Field
              fieldKey="testKey"
              defaultValue="default input value"
              shouldResetValueOnClose
            >
              {({ value, onChange }) => (
                <input
                  data-testid="testInput"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                />
              )}
            </ExportSettings.Field>
          </ExportSettings>
        </>
      );
    };

    render(<TestComponent />);

    // Checking sidepanel is visible
    await expect(screen.getByText('My Settings')).toBeVisible();

    await userEvent.type(screen.getByTestId('testInput'), ' with update');

    await clickDownload();

    expectFormState(onSave, {
      testKey: 'default input value with update',
    });

    // Closing sidepanel
    await userEvent.click(
      screen.getByRole('button', { name: 'Toggle my button' })
    );

    // Checking it is closed
    await expect(screen.getByText('My Settings')).not.toBeVisible();

    // Opening again
    await userEvent.click(
      screen.getByRole('button', { name: 'Toggle my button' })
    );

    // Checking sidepanel is visible
    await expect(screen.getByText('My Settings')).toBeVisible();

    await clickDownload();

    expectFormState(onSave, {
      testKey: 'default input value',
    });
  });

  describe('when saving a field', () => {
    it('returns value of the field(s) that you modified', async () => {
      const onSave = jest.fn();
      render(
        <ExportSettings
          title="My Settings"
          onSave={onSave}
          onCancel={() => {}}
          isOpen
        >
          <ExportSettings.Field fieldKey="testKey" defaultValue="">
            {({ value, onChange }) => (
              <input
                data-testid="testInput"
                value={value}
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          </ExportSettings.Field>
          <ExportSettings.Field fieldKey="testKey2" defaultValue="">
            {({ value, onChange }) => (
              <input
                data-testid="testInput2"
                value={value}
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          </ExportSettings.Field>
          <ExportSettings.Field
            fieldKey="testKey3"
            defaultValue="testDefaultValue"
          >
            {({ value, onChange }) => (
              <input
                data-testid="testInput3"
                value={value}
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          </ExportSettings.Field>
        </ExportSettings>
      );

      await userEvent.type(screen.getByTestId('testInput'), 'test input 1');
      await userEvent.type(screen.getByTestId('testInput2'), 'test input 2');

      await userEvent.click(screen.getByRole('button', { name: 'Download' }));

      expect(onSave).toHaveBeenCalledWith(
        {
          testKey: 'test input 1',
          testKey2: 'test input 2',
          testKey3: 'testDefaultValue',
        },
        expect.anything() // will test updateStatus callback down the line
      );

      await userEvent.type(screen.getByTestId('testInput2'), ' update');

      onSave.mockClear();

      await userEvent.click(screen.getByRole('button', { name: 'Download' }));

      expect(onSave).toHaveBeenCalledWith(
        {
          testKey: 'test input 1',
          testKey2: 'test input 2 update',
          testKey3: 'testDefaultValue',
        },
        expect.anything()
      );
    });

    it('returns a callback that allows you to trigger toast status updates', async () => {
      // We're setting up the sequence for the test here asynchronously
      // using timers and jest.useFakeTimers() we can trigger the toast
      // to be visible with different pieces of text based on the test cases
      const onSave = (_, updateStatus) => {
        // set the status to loading
        updateStatus('LOADING', 'Loading', 'We are loading data');

        setTimeout(() => {
          updateStatus('SUCCESS', 'Success', 'We successfully loaded');
        }, 1000);

        setTimeout(() => {
          updateStatus('ERROR', 'Error', 'There was an error');
        }, 2000);

        setTimeout(() => {
          updateStatus('DONE', '', '');
        }, 3000);
      };

      render(
        <ExportSettings
          title="My Settings"
          onSave={onSave}
          onCancel={() => {}}
          isOpen
        >
          <ExportSettings.Field fieldKey="testKey" defaultValue="">
            {({ value, onChange }) => (
              <input
                data-testid="testInput"
                value={value}
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          </ExportSettings.Field>
        </ExportSettings>
      );

      await userEvent.click(screen.getByRole('button', { name: 'Download' }));

      expect(screen.getByText('Loading')).toBeInTheDocument();
      expect(screen.getByText('We are loading data')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText('Loading')).not.toBeInTheDocument();
        expect(
          screen.queryByText('We are loading data')
        ).not.toBeInTheDocument();
      });

      expect(screen.getByText('Success')).toBeInTheDocument();
      expect(screen.getByText('We successfully loaded')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText('Success')).not.toBeInTheDocument();
        expect(
          screen.queryByText('We successfully loaded')
        ).not.toBeInTheDocument();
      });

      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('There was an error')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText('Error')).not.toBeInTheDocument();
        expect(
          screen.queryByText('There was an error')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('when caching fields', () => {
    it('persists values when a component unmounts and remounts', async () => {
      const onSave = jest.fn();

      const renderComponent = () =>
        render(
          <ExportSettings
            title="My Settings"
            onSave={onSave}
            onCancel={() => {}}
            isOpen
            settingsKey="MySettingsCache"
          >
            <ExportSettings.Field fieldKey="testKey" defaultValue="" isCached>
              {({ value, onChange }) => (
                <div>
                  <label id="test-cached-id">Test Cached Field</label>
                  <input
                    type="text"
                    aria-labelledby="test-cached-id"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                  />
                </div>
              )}
            </ExportSettings.Field>
          </ExportSettings>
        );
      const getField = () => screen.getByLabelText('Test Cached Field');

      // Render the component
      const component = renderComponent();

      // Type a value into the field
      await userEvent.type(getField(), 'Updated value');

      // check it has updated correctly
      expect(getField()).toHaveValue('Updated value');

      // unmount the component completely
      component.unmount();

      // render the component again
      renderComponent();

      // Expect that it retains the original value
      expect(getField()).toHaveValue('Updated value');
    });

    it('throws an error when a cached field is updated and there is no settingsKey', () => {
      // This component will throw an error by design and thats what we are testing
      // So will just add a mock implmentation so it doesnt junk up the test console
      const consoleErrorFn = jest
        .spyOn(console, 'error')
        .mockImplementation(() => jest.fn());

      expect(() =>
        render(
          <ExportSettings
            title="My Settings"
            onSave={() => {}}
            onCancel={() => {}}
            isOpen
          >
            <ExportSettings.Field fieldKey="testKey" defaultValue="" isCached>
              {({ value, onChange }) => (
                <div>
                  <label id="test-cached-id">Test Cached Field</label>
                  <input
                    type="text"
                    aria-labelledby="test-cached-id"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                  />
                </div>
              )}
            </ExportSettings.Field>
          </ExportSettings>
        )
      ).toThrow(
        '<ExportSettings /> component needs a settingsKey before you can cache an <ExportSettings.Field />'
      );

      // restoring the mock
      consoleErrorFn.mockRestore();
    });

    it('overrides a defaultValue when cached', async () => {
      const onSave = jest.fn();

      const renderComponent = () =>
        render(
          <ExportSettings
            title="My Settings"
            onSave={onSave}
            onCancel={() => {}}
            isOpen
            settingsKey="MySettingsCache2"
          >
            <ExportSettings.Field
              fieldKey="testKey"
              defaultValue="default"
              isCached
            >
              {({ value, onChange }) => (
                <div>
                  <label id="test-cached-id">Test Cached Field</label>
                  <input
                    type="text"
                    aria-labelledby="test-cached-id"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                  />
                </div>
              )}
            </ExportSettings.Field>
          </ExportSettings>
        );
      const getField = () => screen.getByLabelText('Test Cached Field');

      // Render the component
      const component = renderComponent();

      // expects it to have the default value
      expect(getField()).toHaveValue('default');

      // Clears the field
      await userEvent.clear(getField());

      // Type a value into the field
      await userEvent.type(getField(), 'update');

      // check it has updated correctly
      expect(getField()).toHaveValue('update');

      // unmount the component completely
      component.unmount();

      // render the component again
      renderComponent();

      // Expect that it retains the original value
      expect(getField()).toHaveValue('update');
    });

    it('handles cached fields and uncached fields in the same form', async () => {
      const renderComponent = () =>
        render(
          <ExportSettings
            title="My Settings"
            onSave={() => {}}
            onCancel={() => {}}
            isOpen
            settingsKey="MySettingsCache3"
          >
            <ExportSettings.Field
              fieldKey="cachedField"
              defaultValue=""
              isCached
            >
              {({ value, onChange }) => (
                <div>
                  <label id="cached-field-id">Test Cached Field</label>
                  <input
                    type="text"
                    aria-labelledby="cached-field-id"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                  />
                </div>
              )}
            </ExportSettings.Field>
            <ExportSettings.Field fieldKey="testKey2" defaultValue="">
              {({ value, onChange }) => (
                <div>
                  <label id="uncached-field-id">Test UnCached Field</label>
                  <input
                    type="text"
                    aria-labelledby="uncached-field-id"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                  />
                </div>
              )}
            </ExportSettings.Field>
          </ExportSettings>
        );
      const getCachedField = () => screen.getByLabelText('Test Cached Field');
      const getUnCachedField = () =>
        screen.getByLabelText('Test UnCached Field');

      // Render the component
      const component = renderComponent();

      // Type a value into the field
      await userEvent.type(getCachedField(), 'update cached field');
      await userEvent.type(
        getUnCachedField(),
        'update field that is not cached'
      );

      // check they have updated correctly
      expect(getCachedField()).toHaveValue('update cached field');
      expect(getUnCachedField()).toHaveValue('update field that is not cached');

      // unmount the component completely
      component.unmount();

      // render the component again
      renderComponent();

      // Expect that the cached field retains the value but the uncached value is clear
      expect(getCachedField()).toHaveValue('update cached field');
      expect(getUnCachedField()).toHaveValue('');
    });
  });
});
