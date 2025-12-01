import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import { data } from '@kitman/services/src/mocks/handlers/planning/getEventAttachmentCategories';
import { AddLinksTranslated as AddLinks } from '../common/AddLinks';

describe('<AddLinks />', () => {
  const mockedOptions = data.map((response) => ({
    value: response.id,
    label: response.name,
  }));
  const props = {
    event: {
      type: 'session_event',
      season_type_id: 1,
      field_condition: 2,
      temperature: 30,
      unUploadedFiles: [],
      unUploadedLinks: [],
    },
    categoryOptions: mockedOptions,
    onUpdateEventDetails: jest.fn(),
    setAllCategoryOptions: jest.fn(),
    t: i18nextTranslateStub(),
  };

  const displayLink = (uri) => {
    return uri.startsWith('//') ? uri.substring(2) : uri || '';
  };

  it('renders the unUploaded links properly', async () => {
    const propsWithUnUploadedLinks = {
      ...props,
      event: {
        ...props.event,
        unUploadedLinks: [
          {
            title: 'my custom title',
            uri: '//www.google.com',
            id: 4,
            event_attachment_category_ids: [13],
          },
          {
            title: 'other',
            uri: '//www.google.org',
            id: 6,
            event_attachment_category_ids: [21],
          },
        ],
      },
    };

    act(() => {
      render(<AddLinks {...propsWithUnUploadedLinks} />);
    });

    const inputFields = screen.getAllByRole('textbox');

    await waitFor(() => {
      // add link area
      expect(inputFields[0]).toHaveValue('');
      expect(inputFields[1]).toHaveValue('');

      // first unuploaded link, uri
      expect(inputFields[2]).toHaveValue(
        displayLink(propsWithUnUploadedLinks.event.unUploadedLinks[0].uri)
      );
      // title
      expect(inputFields[3]).toHaveValue(
        propsWithUnUploadedLinks.event.unUploadedLinks[0].title
      );
      // categories
      expect(screen.getByText(mockedOptions[0].label)).toBeInTheDocument();

      // second unuploaded link
      expect(inputFields[5]).toHaveValue(
        displayLink(propsWithUnUploadedLinks.event.unUploadedLinks[1].uri)
      );
      // title
      expect(inputFields[6]).toHaveValue(
        propsWithUnUploadedLinks.event.unUploadedLinks[1].title
      );
      // categories
      expect(screen.getByText(mockedOptions[1].label)).toBeInTheDocument();
    });
  });

  it('renders the add link fields properly', () => {
    act(() => {
      render(<AddLinks {...props} />);
    });

    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Link')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('calls on updateEventDetails with correct payload', async () => {
    act(() => {
      render(<AddLinks {...props} />);
    });

    const inputFields = screen.getAllByRole('textbox');

    await userEvent.type(inputFields[0], 'my title');
    await userEvent.type(inputFields[1], 'www.kitman.com');

    await userEvent.click(screen.getByText('Add'));

    expect(props.onUpdateEventDetails).toHaveBeenCalledWith({
      unUploadedLinks: [{ title: 'my title', uri: 'www.kitman.com', id: 0 }],
    });
  });

  it('calls on updateEventDetails with correct payload when switching categories', async () => {
    const propsWithUnUploadedLinks = {
      ...props,
      event: {
        ...props.event,
        unUploadedLinks: [
          {
            title: 'my custom title',
            uri: '//www.google.com',
            id: 4,
            event_attachment_category_ids: [mockedOptions[0].value],
          },
        ],
      },
    };
    await act(async () => render(<AddLinks {...propsWithUnUploadedLinks} />));

    await userEvent.click(screen.getByText(mockedOptions[0].label));
    expect(screen.getByText(mockedOptions[1].label)).toBeInTheDocument();
    await userEvent.click(screen.getByText(mockedOptions[1].label));
    // reset the dropdown that sets all categories at once
    expect(props.setAllCategoryOptions).toHaveBeenCalled();
    // expect both category options to be selected now
    expect(props.onUpdateEventDetails).toHaveBeenCalledWith({
      unUploadedLinks: [
        {
          title: 'my custom title',
          uri: '//www.google.com',
          id: 4,
          event_attachment_category_ids: [
            mockedOptions[0].value,
            mockedOptions[1].value,
          ],
        },
      ],
    });
  });
});
