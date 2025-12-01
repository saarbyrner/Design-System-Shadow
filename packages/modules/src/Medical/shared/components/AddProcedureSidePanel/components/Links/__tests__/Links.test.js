import { act } from 'react-dom/test-utils';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Links from '..';

const getById = (id) => {
  return screen.getByTestId(`AddProcedureSidePanel|${id}`);
};

describe('<Links />', () => {
  const props = {
    isLinkValidationCheckAllowed: [],
    setIsLinkValidationCheckAllowed: jest.fn(),
    onClearQueuedLinks: jest.fn(),
    onRemoveLink: jest.fn(),
    onSetLinkUri: jest.fn(),
    onSetLinkTitle: jest.fn(),
    onSaveLink: jest.fn(),
    procedureIndex: 0,
    formState: {
      queuedProcedures: [
        {
          key: 1,
          linkTitle: '',
          linkUri: '',
          queuedLinks: [
            {
              title: '',
              uri: '',
              id: 0,
            },
          ],
          queuedAttachmentTypes: [],
        },
      ],
    },
    t: (text) => text,
  };

  it('renders the default <Links /> component with correct elements', () => {
    act(() => {
      render(<Links {...props} />);
    });

    expect(getById('Links')).toBeInTheDocument();

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Links'
    );

    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Link')).toBeInTheDocument();

    const addLinkButton = screen.getByRole('button', { name: 'Add' });
    expect(addLinkButton).toBeInTheDocument();

    const availableInputs = screen.getAllByRole('textbox');
    expect(availableInputs).toHaveLength(2);
  });

  // This component is only concerned about firing said functions with the procedureIndex
  it('correctly calls props.onClearQueuedLinks when clearing queuedLinks', async () => {
    act(() => {
      render(<Links {...props} procedureIndex={89} />);
    });

    fireEvent.click(screen.getAllByRole('button')[0]);

    expect(props.onClearQueuedLinks).toHaveBeenCalledWith(89);
  });

  it('correctly calls props.onSetLinkTitle & props.onSetLinkUri when filling fields', async () => {
    act(() => {
      render(<Links {...props} procedureIndex={89} />);
    });

    const linkTitle = screen.getAllByRole('textbox')[0];
    const linkUri = screen.getAllByRole('textbox')[1];

    await userEvent.type(linkTitle, 'Raidio Teilifis Eireann');
    await userEvent.type(linkUri, 'https://rte.ie');

    // Following will be called on each keystroke on the relevant input
    expect(props.onSetLinkTitle).toHaveBeenCalledTimes(23);
    expect(props.onSetLinkUri).toHaveBeenCalledTimes(14);
  });

  it('correctly calls props.onSaveLink when adding a Link', async () => {
    render(<Links {...props} procedureIndex={98} />);

    const linkTitle = screen.getAllByRole('textbox')[0];
    const linkUri = screen.getAllByRole('textbox')[1];

    await userEvent.type(linkTitle, 'Raidio Teilifis Eireann');
    await userEvent.type(linkUri, 'https://rte.ie');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(props.onSaveLink).toHaveBeenCalledWith(98);
  });

  it('correctly calls props.onRemoveLink when removing a Link', async () => {
    act(() => {
      render(
        <Links
          {...props}
          procedureIndex={0}
          formState={{
            queuedProcedures: [
              {
                key: 1,
                linkTitle: '',
                linkUri: '',
                queuedLinks: [
                  {
                    title: 'Raidio Teilifis Eireann',
                    uri: 'https://rte.ie',
                    id: 0,
                  },
                ],
              },
            ],
          }}
        />
      );
    });

    expect(screen.getByText('Raidio Teilifis Eireann')).toBeInTheDocument();
    expect(screen.getByText('https://rte.ie')).toBeInTheDocument();

    const singleLink = getById('SingleLink');

    const removeLinkButton = within(singleLink).getByRole('button');
    await userEvent.click(removeLinkButton);
    expect(props.onRemoveLink).toHaveBeenCalledWith(0);
  });
});
