import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import Filter from '../../components/Filter';

describe('Manage Forms <Filter /> component', () => {
  let user;
  let baseProps;

  beforeEach(() => {
    user = userEvent.setup();
    baseProps = {
      searchText: '',
      searchStatus: '',
      searchScheduled: '',
      setSearchText: jest.fn(),
      setSearchStatus: jest.fn(),
      setSearchScheduled: jest.fn(),
      t: i18nextTranslateStub(),
    };
  });

  it('renders the search input and select filters', () => {
    render(<Filter {...baseProps} />);

    expect(screen.getByPlaceholderText('Search forms')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Scheduled')).toBeInTheDocument();
  });

  it('calls setSearchText when text is typed into the search input', async () => {
    render(<Filter {...baseProps} />);
    const searchInput = screen.getByPlaceholderText('Search forms');

    await fireEvent.change(searchInput, { target: { value: 'hello' } });

    expect(baseProps.setSearchText).toHaveBeenCalledWith('hello');
  });

  it('calls setSearchStatus when the status filter is changed', async () => {
    render(<Filter {...baseProps} />);

    // Find the select control by its placeholder text
    const statusSelect = screen.getByText('Status');
    await user.click(statusSelect);

    // Find and click the desired option
    const activeOption = await screen.findByText('Active');
    await user.click(activeOption);

    expect(baseProps.setSearchStatus).toHaveBeenCalledTimes(1);
    expect(baseProps.setSearchStatus).toHaveBeenCalledWith('active');
  });

  it('calls setSearchScheduled when the scheduled filter is changed', async () => {
    render(<Filter {...baseProps} />);

    // Find the select control by its placeholder text
    const scheduledSelect = screen.getByText('Scheduled');
    await user.click(scheduledSelect);

    // We need to be specific if the text appears twice (placeholder and option)
    const options = await screen.findAllByText('Scheduled');
    // The second element should be the option inside the dropdown
    await user.click(options[1]);

    expect(baseProps.setSearchScheduled).toHaveBeenCalledTimes(1);
    expect(baseProps.setSearchScheduled).toHaveBeenCalledWith('scheduled');
  });
});
