import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from 'i18next';
import { getMockDataForExercise } from '@kitman/services/src/mocks/handlers/rehab/getExercises';

import {
  i18nextTranslateStub,
  renderWithProvider,
  storeFake,
} from '@kitman/common/src/utils/test_utils';
import {
  useLazyGetExercisesQuery,
  useGetExercisesByIdQuery,
} from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import RehabExercisesFilter from '../RehabExercisesFilter';

jest.mock(
  '@kitman/modules/src/Medical/shared/redux/services/medicalShared',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/Medical/shared/redux/services/medicalShared'
    ),
    useLazyGetExercisesQuery: jest.fn(),
    useGetExercisesByIdQuery: jest.fn(),
  })
);

const store = {
  medicalSharedApi: {
    useLazyGetExercisesQuery: jest.fn(),
    useGetExercisesByIdQuery: jest.fn(),
  },
};

const renderComponent = (props) => {
  renderWithProvider(<RehabExercisesFilter {...props} />, storeFake(store));
};

describe('<RehabExercisesFilter />', () => {
  beforeEach(() => {
    useLazyGetExercisesQuery.mockReturnValue([
      jest.fn().mockReturnValue({
        data: getMockDataForExercise(),
        isError: false,
        isLoading: false,
        isFetching: false,
      }),
    ]);
    useGetExercisesByIdQuery.mockReturnValue({
      data: [],
      isError: false,
      isLoading: false,
      isFetching: false,
    });
  });

  const onChangeMock = jest.fn();
  const onClickRemoveMock = jest.fn();
  const i18nT = i18nextTranslateStub(i18n);

  const props = {
    t: i18nT,
    organisationId: 1,
    value: [],
    onChange: onChangeMock,
    onClickRemove: onClickRemoveMock,
  };

  it('renders correctly', async () => {
    const user = userEvent.setup();
    renderComponent(props);
    await screen.findByText('Exercises');
    expect(screen.getByLabelText('Search Exercises')).toBeInTheDocument();
    expect(screen.getByText('Contains')).toBeInTheDocument();

    const input = screen.getByRole('combobox', { name: 'Search Exercises' });
    expect(input).toBeEnabled();
    await user.click(input);
    const exerciseOption = screen.getByRole('option', {
      name: '1/2 Kneeling Ankle Mobility',
    });
    expect(exerciseOption).toBeInTheDocument();
    await user.click(exerciseOption);
    expect(onChangeMock).toHaveBeenCalledWith([80]);
  });

  it('calls onClickRemove when close button clicked', async () => {
    const user = userEvent.setup();
    renderComponent(props);
    await screen.findByText('Exercises');
    const removeButton = screen.getAllByRole('button')[0];
    expect(removeButton).toHaveClass('icon-close');

    expect(removeButton).toBeInTheDocument();
    await user.click(removeButton);
    expect(onClickRemoveMock).toHaveBeenCalled();
  });
});
