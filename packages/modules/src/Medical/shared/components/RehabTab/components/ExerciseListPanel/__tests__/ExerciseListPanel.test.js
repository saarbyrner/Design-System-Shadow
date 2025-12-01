import {
  screen,
  waitFor,
  within,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VirtuosoMockContext } from 'react-virtuoso';
import {
  i18nextTranslateStub,
  renderWithProvider,
  storeFake,
} from '@kitman/common/src/utils/test_utils';
import { useLazyGetExercisesQuery } from '@kitman/modules/src/Medical/shared/redux/services/medicalShared';
import { getMockDataForExercise } from '@kitman/services/src/mocks/handlers/rehab/getExercises';

import ExerciseListPanel from '../index';

jest.mock('@kitman/components/src/DelayedLoadingFeedback');
jest.mock(
  '@kitman/modules/src/Medical/shared/redux/services/medicalShared',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/Medical/shared/redux/services/medicalShared'
    ),
    useLazyGetExercisesQuery: jest.fn(),
  })
);

const store = {
  medicalSharedApi: {
    useLazyGetExercisesQuery: jest.fn(),
  },
};

const onClickActionButtonSpy = jest.fn();
const onClickedExerciseTemplateSpy = jest.fn();

const props = {
  organisationId: 1,
  isOpen: true,
  disabled: false,
  onClose: onClickActionButtonSpy,
  onClickedExerciseTemplate: onClickedExerciseTemplateSpy,
  t: i18nextTranslateStub(),
};

const renderDefault = () => {
  renderWithProvider(
    <VirtuosoMockContext.Provider
      value={{ viewportHeight: 160, itemHeight: 40 }}
    >
      <ExerciseListPanel {...props} />
    </VirtuosoMockContext.Provider>,
    storeFake(store)
  );
};

describe('<ExerciseListPanel />', () => {
  let spy;
  // We use React Portal to add the side panel to div 'issueMedicalProfile-Slideout'
  // Mock in as needs to be present in the test
  beforeAll(() => {
    spy = jest.spyOn(document, 'getElementById');
    const mockElement = document.createElement('div');
    mockElement.setAttribute('id', 'issueMedicalProfile-Slideout');
    document.body.appendChild(mockElement);
    spy.mockReturnValueOnce(mockElement);
  });

  beforeEach(() => {
    i18nextTranslateStub();
    useLazyGetExercisesQuery.mockReturnValue([
      jest.fn().mockReturnValue({
        data: getMockDataForExercise(),
        isError: false,
        isLoading: false,
      }),
    ]);
  });

  it('displays the correct content', async () => {
    renderDefault();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    await waitForElementToBeRemoved(screen.queryByText('Loading...'));
    // Once the data is loaded...
    await waitFor(() => {
      // check the correct headers are displayed
      expect(screen.getByText('Exercises')).toBeInTheDocument();
    });

    const exercises = screen.getAllByTestId('Rehab|ExerciseTemplate');
    expect(exercises).toHaveLength(4);

    const favouriteExercise = await within(exercises[0]).findByText(
      'Bicep Curls'
    );
    expect(favouriteExercise).toBeInTheDocument();
    const favouriteButton = await within(
      within(exercises[0]).getByTestId('Rehab|FavouriteButton')
    ).findByRole('button');
    expect(favouriteButton).toBeInTheDocument();
    expect(favouriteButton).toHaveClass('icon-star-filled');

    const nonFavouriteExercise = await within(exercises[2]).findByText(
      '3 Way Ankle'
    );
    expect(nonFavouriteExercise).toBeInTheDocument();
    const nonfavouriteButton = await within(
      within(exercises[2]).getByTestId('Rehab|FavouriteButton')
    ).findByRole('button');
    expect(nonfavouriteButton).toBeInTheDocument();
    expect(nonfavouriteButton).toHaveClass('icon-star');
  });

  it('favourites an exercise with the star button', async () => {
    renderDefault();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    await waitForElementToBeRemoved(screen.queryByText('Loading...'));
    // Once the data is loaded...
    await waitFor(() => {
      // check the correct headers are displayed
      expect(screen.getByText('Exercises')).toBeInTheDocument();
    });

    let exercises = screen.getAllByTestId('Rehab|ExerciseTemplate');
    expect(exercises).toHaveLength(4);
    await screen.findByText('Bird Dogs');
    const nonFavouriteExercise = await within(exercises[3]).findByText(
      'Bird Dogs'
    );

    expect(nonFavouriteExercise).toBeInTheDocument();

    const nonfavouriteButton = await within(
      within(exercises[3]).getByTestId('Rehab|FavouriteButton')
    ).findByRole('button');
    expect(nonfavouriteButton).toBeInTheDocument();
    expect(nonfavouriteButton).toHaveClass('icon-star');
    expect(nonfavouriteButton).not.toHaveClass('icon-star-filled');
    await userEvent.click(nonfavouriteButton);

    exercises = screen.getAllByTestId('Rehab|ExerciseTemplate');
    // Favouriting moves the exercise up the list
    const nowFavouriteExercise = await within(exercises[1]).findByText(
      'Bird Dogs'
    );

    expect(nowFavouriteExercise).toBeInTheDocument();

    const favouriteButton = await within(
      within(exercises[1]).getByTestId('Rehab|FavouriteButton')
    ).findByRole('button');
    expect(favouriteButton).toBeInTheDocument();
    expect(favouriteButton).toHaveClass('icon-star-filled');
  });

  it('returns the correct response to searching for an exercise', async () => {
    useLazyGetExercisesQuery.mockReturnValue([
      jest.fn().mockReturnValue({
        data: getMockDataForExercise('steamboat'),
        isError: false,
        isLoading: false,
      }),
    ]);

    renderDefault();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    await waitForElementToBeRemoved(screen.queryByText('Loading...'));
    // Once the data is loaded...
    await waitFor(() => {
      // check the correct headers are displayed
      expect(screen.getByText('Exercises')).toBeInTheDocument();
    });

    const search = screen.getByTestId('ExerciseListPanel|Search');
    expect(search).toBeInTheDocument();
    const input = search.querySelector('input');
    await userEvent.clear(input);
    await userEvent.type(input, 'steamboat');
    expect(
      screen.getByTestId('ExerciseListPanel|Search').querySelector('input')
    ).toHaveValue('steamboat');

    const foundExercise = await screen.findByText('Ankle Steamboats (4 Way)', {
      timeout: 5000,
    });
    expect(foundExercise).toBeInTheDocument();
  });

  it('returns the correct response to searching for another exercise', async () => {
    useLazyGetExercisesQuery.mockReturnValue([
      jest.fn().mockReturnValue({
        data: getMockDataForExercise('4 way ankle'),
        isError: false,
        isLoading: false,
      }),
    ]);

    renderDefault();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    await waitForElementToBeRemoved(screen.queryByText('Loading...'));
    // Once the data is loaded...
    await waitFor(() => {
      // check the correct headers are displayed
      expect(screen.getByText('Exercises')).toBeInTheDocument();
    });

    const search = screen.getByTestId('ExerciseListPanel|Search');
    expect(search).toBeInTheDocument();
    const input = search.querySelector('input');
    // await userEvent.clear(input);
    await userEvent.type(input, '4 way ankle');

    expect(
      screen.getByTestId('ExerciseListPanel|Search').querySelector('input')
    ).toHaveValue('4 way ankle');

    await waitFor(
      () => {
        expect(
          screen.getByText('1/2 Kneeling Ankle Mobility')
        ).toBeInTheDocument();
        expect(screen.getByText('3 Way Ankle')).toBeInTheDocument();
        expect(screen.getByText('1 way ankle')).toBeInTheDocument();
        expect(screen.getByText('2 way hip')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it('response to searching for a favourite', async () => {
    useLazyGetExercisesQuery.mockReturnValue([
      jest.fn().mockReturnValue({
        data: getMockDataForExercise('ankle'),
        isError: false,
        isLoading: false,
      }),
    ]);

    renderDefault();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    await waitForElementToBeRemoved(screen.queryByText('Loading...'));
    // Once the data is loaded...
    await waitFor(() => {
      // check the correct headers are displayed
      expect(screen.getByText('Exercises')).toBeInTheDocument();
    });

    const search = screen.getByTestId('ExerciseListPanel|Search');

    expect(search).toBeInTheDocument();

    const input = search.querySelector('input');
    await userEvent.clear(input);
    await userEvent.type(input, 'ankle');
    expect(
      screen.getByTestId('ExerciseListPanel|Search').querySelector('input')
    ).toHaveValue('ankle');

    await waitFor(() => {
      expect(
        screen.getByText('1/2 Kneeling Ankle Mobility')
      ).toBeInTheDocument();

      expect(screen.getByText('3 Way Ankle')).toBeInTheDocument();

      expect(screen.queryByText('Bird Dogs')).not.toBeInTheDocument();
    });
  });

  it('displays response to the close button', async () => {
    renderWithProvider(
      <VirtuosoMockContext.Provider
        value={{ viewportHeight: 160, itemHeight: 40 }}
      >
        <ExerciseListPanel {...props} />
      </VirtuosoMockContext.Provider>,
      storeFake(store)
    );

    const buttons = await screen.findAllByRole('button');

    await userEvent.click(buttons[0]);
    expect(onClickActionButtonSpy).toHaveBeenCalled();
  });

  it('calls onClickedExerciseTemplate when exercise clicked', async () => {
    renderDefault();

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    await waitForElementToBeRemoved(screen.queryByText('Loading...'));
    // Once the data is loaded...
    await waitFor(() => {
      // check the correct headers are displayed
      expect(screen.getByText('Exercises')).toBeInTheDocument();
    });

    const nonFavouriteExercise = await screen.findByText('3 Way Ankle');
    expect(nonFavouriteExercise).toBeInTheDocument();

    await userEvent.click(nonFavouriteExercise);
    expect(onClickedExerciseTemplateSpy).toHaveBeenCalled();
  });

  describe('When rehab-search-mode-options feature flag is on', () => {
    beforeEach(() => {
      window.featureFlags = {
        'rehab-search-mode-options': true,
      };
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    it('displays the search options', async () => {
      renderDefault();

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      await waitForElementToBeRemoved(screen.queryByText('Loading...'));

      expect(
        screen
          .getByTestId('ExerciseListPanel|SearchOptions')
          .querySelector('input')
      ).toBeInTheDocument();
    });
  });

  describe('When rehab-search-mode-options feature flag is off', () => {
    beforeEach(() => {
      window.featureFlags = {
        'rehab-search-mode-options': false,
      };
    });

    afterEach(() => {
      window.featureFlags = {};
    });

    it('does not display the search options', async () => {
      renderDefault();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      await waitForElementToBeRemoved(screen.queryByText('Loading...'));

      expect(
        screen.queryByTestId('ExerciseListPanel|SearchOptions')
      ).not.toBeInTheDocument();
    });
  });
});
