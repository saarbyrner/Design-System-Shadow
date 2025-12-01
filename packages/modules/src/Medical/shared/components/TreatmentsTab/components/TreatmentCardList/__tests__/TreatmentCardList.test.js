import { screen, render } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { data } from '@kitman/modules/src/Medical/shared/components/TreatmentsTab/__tests__/mocks/getTreatmentSessions';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import treatmentCardListReducer from '@kitman/modules/src/Medical/shared/redux/reducers/treatmentCardList';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import TreatmentCardList from '..';

jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical', () => ({
  ...jest.requireActual(
    '@kitman/modules/src/Medical/shared/redux/services/medical'
  ),
  useGetTreatmentSessionOptionsQuery: jest.fn().mockReturnValue({
    data: {
      issues_options: [],
      treatable_area_options: [],
      treatment_modality_options: [],
    },
    error: false,
    isLoading: false,
  }),
}));

jest.mock(
  '@kitman/modules/src/Medical/shared/redux/services/medicalShared',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/Medical/shared/redux/services/medicalShared'
    ),
    useGetAthleteDataQuery: jest.fn().mockReturnValue({
      data: {
        id: 123,
        fullname: 'firstname lastname',
        position: 'Position',
        avatar_url: '',
      },
      error: false,
      isLoading: false,
    }),
  })
);

setI18n(i18n);

describe('<TreatmentCardList />', () => {
  const baseProps = {
    initialiseState: jest.fn(),
    isLoading: false,
    isReviewMode: false,
    onReachingEnd: jest.fn(),
    removeSelectedAthlete: jest.fn(),
    selectedAthletes: [],
    showAthleteInformation: false,
    staffUsers: [],
    treatmentSessions: data.treatment_sessions,
    t: i18nextTranslateStub(),
  };

  const preloadedState = {
    treatmentCardList: {
      athleteTreatments: {
        123: {
          athlete_id: 123,
          date: '2021-08-12T16:00:00Z',
          user_id: null,
          start_time: '2021-08-12T16:00:00Z',
          end_time: '2021-08-12T16:30:00Z',
          timezone: 'Europe/Dublin',
          title: '',
          treatments_attributes: [],
          annotation_attributes: { content: '' },
        },
        456: {
          athlete_id: 456,
          date: '2021-08-12T16:00:00Z',
          user_id: null,
          start_time: '2021-08-12T16:00:00Z',
          end_time: '2021-08-12T16:30:00Z',
          timezone: 'Europe/Dublin',
          title: '',
          treatments_attributes: [],
          annotation_attributes: { content: '' },
        },
      },
      invalidEditTreatmentCards: [],
    },
  };

  test('renders the list of treatments', () => {
    const store = configureStore({
      reducer: {
        treatmentCardList: treatmentCardListReducer,
      },
      preloadedState,
    });
    render(
      <Provider store={store}>
        <TreatmentCardList {...baseProps} />
      </Provider>
    );
    // We expect one TreatmentCard rendered per treatment session
    // The inner content contains the practitioner fullname text
    expect(screen.getByText('firstname lastname')).toBeInTheDocument();
  });

  describe('when isReviewMode is true', () => {
    test('renders an EditTreatmentCard for each selected athlete', () => {
      const store = configureStore({
        reducer: {
          treatmentCardList: treatmentCardListReducer,
        },
        preloadedState,
      });
      render(
        <Provider store={store}>
          <TreatmentCardList
            {...baseProps}
            isReviewMode
            selectedAthletes={[123, 456]}
          />
        </Provider>
      );

      // Two remove athlete icon buttons should be present (one per card)
      const removeButtons = screen.getAllByRole('button', { name: '' });
      expect(removeButtons.length).toBeGreaterThanOrEqual(2);
    });
  });
});
