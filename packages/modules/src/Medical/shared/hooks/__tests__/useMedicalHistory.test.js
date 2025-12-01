import { renderHook } from '@testing-library/react-hooks';
import {
  TestProviders,
  renderWithProvider,
} from '@kitman/common/src/utils/test_utils';
import { waitFor } from '@testing-library/react';
import useMedicalHistory from '../useMedicalHistory';
import { saveMedicalHistory } from '../../redux/actions';
import { data } from '../../../../../../services/src/mocks/handlers/getAthleteMedicalHistory';

describe('useMedicalHistory', () => {
  it('returns initial data', async () => {
    const {
      result: { current },
    } = renderHook(
      () => useMedicalHistory({ athleteId: 123, initialFetch: false }),
      {
        wrapper: ({ children }) => (
          <TestProviders
            store={{
              medicalHistory: {},
            }}
          >
            {children}
          </TestProviders>
        ),
      }
    );

    expect(current).toHaveProperty('isLoading');
    expect(current).toHaveProperty('fetchMedicalHistory');
    expect(current.data).toEqual({
      tue: [],
      vaccinations: [],
    });
  });
  it('fetches medical history', async () => {
    const storeFake = (state) => ({
      default: () => {},
      subscribe: () => {},
      dispatch: jest.fn(),
      getState: () => ({ ...state }),
    });

    const renderTestComponent = () => {
      const Compenent = () => {
        useMedicalHistory({ athleteId: 123, initialFetch: true });
        return null;
      };

      return renderWithProvider(
        <Compenent />,
        storeFake({
          medicalHistory: {},
        })
      );
    };

    const values = renderTestComponent();

    await waitFor(
      () => {
        expect(values.store.dispatch).toHaveBeenCalledWith(
          saveMedicalHistory(123, data)
        );
      },
      { timeout: 2000 }
    );
  });
});
