import { render, screen } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import { data as mockInboundData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/fetchInboundElectronicFile.mock';
import { data as mockOutboundData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/fetchOutboundElectronicFile.mock';
import { mockState } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/mockData.mock';
import Dialog from '@kitman/modules/src/ElectronicFiles/shared/components/Dialog';

setI18n(i18n);

jest.mock(
  '@kitman/modules/src/ElectronicFiles/shared/services/electronicFiles'
);

const defaultProps = {
  title: 'Dialog Title',
  t: i18nextTranslateStub(),
};

const initialState = mockState;

const renderComponent = (state = initialState, props = defaultProps) => {
  return render(
    <Provider store={storeFake(state)}>
      <Dialog {...props} />
    </Provider>
  );
};

describe('<Dialog />', () => {
  it('renders closed dialog correctly', () => {
    renderComponent();

    expect(
      screen.queryByRole('heading', { name: 'Dialog Title', level: 2 })
    ).not.toBeInTheDocument();
  });

  it('renders dialog with correct title when title prop is passed', () => {
    renderComponent(initialState, {
      ...defaultProps,
      title: 'Custom Dialog Title',
    });

    expect(
      screen.queryByRole('heading', { name: 'Custom Dialog Title', level: 2 })
    ).not.toBeInTheDocument();
  });

  it('renders dialog correctly', () => {
    renderComponent({
      ...initialState,
      dialogSlice: {
        ...initialState.dialogSlice,
        open: true,
      },
    });

    expect(
      screen.getByRole('heading', { name: 'Dialog Title', level: 2 })
    ).toBeInTheDocument();
  });

  it('renders dialog with attachments correctly', () => {
    renderComponent({
      ...initialState,
      dialogSlice: {
        ...initialState.dialogSlice,
        open: true,
        attachments: mockOutboundData.data?.attachments,
      },
    });

    expect(
      screen.getByRole('heading', { name: '1 attachment', level: 2 })
    ).toBeInTheDocument();
    expect(screen.getByText('liverpool.jpg - 34.7 kB')).toBeInTheDocument();
  });

  it('renders dialog with allocations correctly', () => {
    renderComponent({
      ...initialState,
      dialogSlice: {
        ...initialState.dialogSlice,
        open: true,
        allocations: mockInboundData.data?.efax_allocations,
      },
    });

    expect(
      screen.getByRole('heading', { name: 'Attached to 2 players', level: 2 })
    ).toBeInTheDocument();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Pages: 1-5')).toBeInTheDocument();

    expect(screen.getByText('Joe Bloggs')).toBeInTheDocument();
    expect(screen.getByText('Pages: 6-10')).toBeInTheDocument();
  });
});
