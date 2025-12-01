import { screen, fireEvent } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import GuardiansHeader from '@kitman/modules/src/AthleteProfile/src/components/AthleteGuardians/GuardiansHeader';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import GuardiansTab from '@kitman/modules/src/AthleteProfile/src/components/AthleteGuardians';
import { configureStore } from '@reduxjs/toolkit';
import guardiansTabSlice from '@kitman/modules/src/AthleteProfile/redux/slices/guardiansTabSlice';

describe('<GuardiansHeader />', () => {
  let baseProps;

  beforeEach(() => {
    baseProps = {
      t: i18nextTranslateStub(),
    };
  });

  it('renders the header component', () => {
    renderWithRedux(<GuardiansHeader {...baseProps} />);

    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('opens the guardian side panel when the Add button is clicked', () => {
    const reducer = {
      [guardiansTabSlice.name]: guardiansTabSlice.reducer,
    };

    const testStore = configureStore({ reducer });

    renderWithRedux(<GuardiansTab t={i18nextTranslateStub()} />, {
      mockedStore: testStore,
    });

    expect(screen.queryByRole('Add guardian')).not.toBeInTheDocument();

    const addButton = screen.getByRole('button', { name: /Add/i });
    fireEvent.click(addButton);

    expect(screen.getByText('Add guardian')).toBeInTheDocument();
  });
});
