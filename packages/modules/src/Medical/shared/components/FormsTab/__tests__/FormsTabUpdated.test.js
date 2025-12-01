import { render, screen, act, within, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import ResizeObserverPolyfill from 'resize-observer-polyfill';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { useSearchFormAnswerSetsQuery } from '@kitman/services/src/services/formAnswerSets';
import { data as testData } from '@kitman/services/src/services/formAnswerSets/api/mocks/handlers/search';
import FormsTabUpdated, {
  convertFormAnswerSetToSummary,
} from '../FormsTabUpdated';
import { useGetFormTypesQuery } from '../../../redux/services/medical';

jest.mock('../../../redux/services/medical');
jest.mock('@kitman/services/src/services/formAnswerSets');

describe('convertFormAnswerSetToSummary', () => {
  it('converts a AnswerSet to FormSummary', () => {
    const answerSet = testData.data[0];
    const expectedResult = {
      athlete: {
        availability: 'unavailable',
        avatarUrl:
          'https://s3:9000/injpro-staging-public/avatar.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=dummy1234%2F20241015%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Date=20241015T140807Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Signature=2ad7faa20b8cfe65f9e4b1b642c35158e26c53a4d76b5933b1bbe729557bce95',
        firstname: 'Robbie',
        fullname: 'Robbie Brady',
        id: 1,
        lastname: 'Brady',
        position: {
          id: 1,
          name: 'Left Back',
          order: 1,
        },
      },
      completionDate: '2024-07-02T14:56:51Z',
      concussionDiagnosed: undefined,
      editorFullName: 'Cathal Diver',
      expiryDate: undefined,
      formType: 'Man of the Match Winners',
      formTypeFullName: 'Players who have won man of the match for ireland',
      id: 1,
      linkedIssue: undefined,
      status: 'complete',
    };

    const result = convertFormAnswerSetToSummary(answerSet);
    expect(result).toEqual(expectedResult);
  });
});

describe('<FormsTabUpdated />', () => {
  const { ResizeObserver } = window;
  beforeEach(() => {
    delete window.ResizeObserver;
    window.ResizeObserver = ResizeObserverPolyfill;
    window.HTMLElement.prototype.getBoundingClientRect = jest.fn(() => {
      return {
        width: 1000,
        height: 1000,
      };
    });
  });

  afterEach(() => {
    window.ResizeObserver = ResizeObserver;
    jest.resetAllMocks();
  });

  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const store = storeFake({
    medicalApi: {},
  });

  afterAll(() => {
    jest.clearAllMocks();
    window.featureFlags = {};
  });

  const props = {
    reloadData: false,
    formCategory: 'medical',
    t: i18nextTranslateStub(),
  };

  describe('Data display', () => {
    beforeEach(() => {
      i18nextTranslateStub();

      useSearchFormAnswerSetsQuery.mockReturnValue({
        data: testData,
        isLoading: false,
        isError: false,
      });
      useGetFormTypesQuery.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
      });
    });

    it('displays the FormsTabUpdated data from new endpoint after loading', async () => {
      await act(async () => {
        render(
          <Provider store={store}>
            <FormsTabUpdated {...props} />
          </Provider>
        );
      });

      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'All forms'
      );

      const grid = screen.getByRole('grid');
      const headers = within(grid).getAllByRole('columnheader');
      expect(headers).toHaveLength(4);

      expect(headers[0]).toHaveTextContent('Athlete');
      expect(headers[1]).toHaveTextContent('Form Type');
      expect(headers[2]).toHaveTextContent('Completion Date');
      expect(headers[3]).toHaveTextContent('Examiner');

      const rows = within(grid).getAllByRole('row');
      expect(rows).toHaveLength(3);

      const cellsFirstRow = within(rows[1]).getAllByRole('gridcell');

      expect(cellsFirstRow[0]).toHaveTextContent('Robbie Brady');
      expect(cellsFirstRow[1]).toHaveTextContent('Man of the Match Winners');
      expect(cellsFirstRow[2]).toHaveTextContent('July 2, 2024');
      expect(cellsFirstRow[3]).toHaveTextContent('Cathal Diver');

      expect(
        screen.getByLabelText('pagination navigation')
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Go to previous page' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Go to next page' })
      ).toBeInTheDocument();
    });
  });
});
