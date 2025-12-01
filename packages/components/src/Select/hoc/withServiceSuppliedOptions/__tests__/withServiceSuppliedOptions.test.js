import { render, waitFor } from '@testing-library/react';
import withServiceSuppliedOptions from '../index';

const serviceResponse = [
  { id: 1, name: 'Session Type 1', another_property: 'A' },
  { id: 2, name: 'Session Type 2', another_property: 'B' },
];

const mappedResponse = [
  {
    label: 'Session Type 1',
    value: 1,
    id: 1,
    name: 'Session Type 1',
    another_property: 'A',
  },
  {
    label: 'Session Type 2',
    value: 2,
    id: 2,
    name: 'Session Type 2',
    another_property: 'B',
  },
];

const renderHOC = ({
  service = jest.fn().mockResolvedValue(serviceResponse),
  configOverrides = {},
  componentProps = {},
} = {}) => {
  const WrappedComponent = jest.fn(() => null);
  const statusChangeCallback = jest.fn();
  const WrappedSelect = withServiceSuppliedOptions(WrappedComponent, service, {
    dataId: 'my_id',
    onStatusChangedCallback: statusChangeCallback,
    ...configOverrides,
  });

  const defaultProps = {
    appendToBody: true,
    value: undefined,
    label: 'test',
    onChange: jest.fn(),
    onClear: jest.fn(),
  };

  render(<WrappedSelect {...defaultProps} {...componentProps} />);

  return {
    WrappedComponent,
    service,
    statusChangeCallback,
  };
};

describe('withServiceSuppliedOptions HOC', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the wrapped component', () => {
    const { WrappedComponent } = renderHOC();
    expect(WrappedComponent).toHaveBeenCalled();
  });

  it('forwards props to the wrapped component', () => {
    const { WrappedComponent } = renderHOC();
    const firstCallProps = WrappedComponent.mock.calls[0][0];

    expect(firstCallProps.label).toBe('test');
  });

  it('initially renders with no options, loading state, and disabled', () => {
    const { WrappedComponent } = renderHOC();
    const firstCallProps = WrappedComponent.mock.calls[0][0];

    expect(firstCallProps.options).toEqual([]);
    expect(firstCallProps.isLoading).toBe(true);
    expect(firstCallProps.isDisabled).toBe(true);
  });

  it('respects enableWhileLoading configuration', () => {
    const { WrappedComponent } = renderHOC({
      configOverrides: { enableWhileLoading: true },
    });
    const firstCallProps = WrappedComponent.mock.calls[0][0];

    expect(firstCallProps.isDisabled).toBeUndefined();
  });

  it('provides options after a successful service call and clears loading / disabled states', async () => {
    const { WrappedComponent } = renderHOC();

    await waitFor(() => {
      const lastCallProps =
        WrappedComponent.mock.calls[WrappedComponent.mock.calls.length - 1][0];
      expect(lastCallProps.isLoading).toBe(false);
    });

    const lastCallProps =
      WrappedComponent.mock.calls[WrappedComponent.mock.calls.length - 1][0];

    expect(lastCallProps.options).toEqual(mappedResponse);
    expect(lastCallProps.isDisabled).toBeUndefined();
  });

  it('can delay the service call when instructed', async () => {
    const { WrappedComponent, service } = renderHOC({
      componentProps: { performServiceCall: false },
    });

    const firstCallProps = WrappedComponent.mock.calls[0][0];
    expect(firstCallProps.options).toEqual([]);
    expect(firstCallProps.isLoading).toBe(true);
    expect(firstCallProps.isDisabled).toBe(true);
    expect(service).not.toHaveBeenCalled();
  });

  it('invokes the status callback on success with the dataId', async () => {
    const { statusChangeCallback } = renderHOC();

    await waitFor(() => {
      expect(statusChangeCallback).toHaveBeenCalledWith(
        'SUCCESS',
        'my_id',
        null
      );
    });
  });

  it('invokes the status callback on failure with the rejection reason', async () => {
    const rejectionReason = { serverInfo: 'something' };
    const { statusChangeCallback } = renderHOC({
      service: jest.fn().mockRejectedValue(rejectionReason),
    });

    await waitFor(() => {
      expect(statusChangeCallback).toHaveBeenCalledWith(
        'FAILURE',
        'my_id',
        rejectionReason
      );
    });
  });

  it('allows custom mapping of service data', async () => {
    const customMapping = (data) =>
      data.map((entry) => ({
        label: entry.name,
        value: entry.id.toString(),
        custom_property: entry.another_property,
      }));

    const { WrappedComponent } = renderHOC({
      configOverrides: { mapToOptions: customMapping },
    });

    await waitFor(() => {
      const lastCallProps =
        WrappedComponent.mock.calls[WrappedComponent.mock.calls.length - 1][0];
      expect(lastCallProps.options).toEqual([
        { label: 'Session Type 1', value: '1', custom_property: 'A' },
        { label: 'Session Type 2', value: '2', custom_property: 'B' },
      ]);
    });
  });

  it('returns the full option object when onChangeFullOptionObject is provided', async () => {
    const onChangeFullOptionObject = jest.fn();

    const { WrappedComponent } = renderHOC({
      componentProps: { onChangeFullOptionObject },
    });

    await waitFor(() => {
      const lastCallProps =
        WrappedComponent.mock.calls[WrappedComponent.mock.calls.length - 1][0];
      expect(lastCallProps.options).toEqual(mappedResponse);
    });

    const lastCallProps =
      WrappedComponent.mock.calls[WrappedComponent.mock.calls.length - 1][0];

    lastCallProps.onChange(2);

    expect(onChangeFullOptionObject).toHaveBeenCalledWith(mappedResponse[1]);
  });
});
