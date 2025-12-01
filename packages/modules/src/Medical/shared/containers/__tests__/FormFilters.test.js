import { render, screen } from '@testing-library/react';
import selectEvent from 'react-select-event';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import FormsFiltersContainer from '../FormFilters';
import { useGetFormTypesQuery } from '../../redux/services/medical';

jest.mock('../../redux/services/medical');

describe('<FormsFiltersContainer>', () => {
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

  beforeEach(() => {
    i18nextTranslateStub();
    useGetFormTypesQuery.mockReturnValue({
      data: [
        {
          id: 1,
          category: 'legal',
          group: 'x',
          key: 'test1',
          name: 'test1',
          fullname: null,
          form_type: 'one',
          config: null,
          enabled: true,
          created_at: '2023-05-19T10:58:06Z',
          updated_at: '2023-05-19T10:58:06Z',
        },
        {
          id: 2,
          category: 'medical',
          group: 'x',
          key: 'test2',
          name: 'test2',
          fullname: null,
          form_type: 'two',
          config: null,
          enabled: true,
          created_at: '2023-05-19T10:58:06Z',
          updated_at: '2023-05-19T10:58:06Z',
        },
        {
          id: 3,
          category: 'medical',
          group: 'x',
          key: 'test3',
          name: 'test3',
          fullname: null,
          form_type: 'three',
          config: null,
          enabled: true,
          created_at: '2023-05-19T10:58:06Z',
          updated_at: '2023-05-19T10:58:06Z',
        },
        {
          id: 3,
          category: 'physical',
          group: 'x',
          key: 'test4',
          name: 'test4',
          fullname: null,
          form_type: 'four',
          config: null,
          enabled: true,
          created_at: '2023-05-19T10:58:06Z',
          updated_at: '2023-05-19T10:58:06Z',
        },
      ],
      isLoading: false,
      isError: false,
    });
  });

  it('renders expected options', async () => {
    const props = {
      category: 'medical',
      onChangeFilter: jest.fn(),
    };
    const { container } = render(
      <Provider store={store}>
        <FormsFiltersContainer {...props} />
      </Provider>
    );
    selectEvent.openMenu(container.querySelector('.kitmanReactSelect input'));
    expect(screen.getByText('test1')).toBeInTheDocument();
    expect(screen.getByText('test2')).toBeInTheDocument();
    expect(screen.getByText('test3')).toBeInTheDocument();
    expect(screen.getByText('test4')).toBeInTheDocument();
    await userEvent.click(screen.getByText('test1'));
    expect(props.onChangeFilter).toHaveBeenCalledWith({
      athlete_id: undefined,
      category: 'legal',
      form_type: 'one',
      group: 'x',
      key: 'test1',
    });
  });
});
