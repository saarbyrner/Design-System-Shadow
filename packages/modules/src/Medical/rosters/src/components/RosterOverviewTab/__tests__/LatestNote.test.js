import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import LatestNote from '../LatestNote';

describe('<LatestNote />', () => {
  const props = {
    latestNote: {
      title: 'Note 2345',
      date: 'Nov 22, 22',
      content:
        'Hello? Hello? Anybody home? Huh? Think, McFly.<strong> Think! I gotta have time to go to dummy text I gotta have time to go to dummy text I gotta have time to go to dummy text value retrieval</strong>',
      restricted_annotation: false,
    },
    t: i18nextTranslateStub(),
  };

  it('renders the cell with the correct heading', () => {
    render(<LatestNote {...props} />);

    const noteCell = screen.getByRole('cell');
    const noteHeading = screen.getByRole('heading');

    expect(noteCell).toBeInTheDocument();
    expect(noteHeading).toBeInTheDocument();
    expect(noteHeading).toHaveTextContent('Nov 22, 22 - Note 2345');
  });

  it('renders the correct note content for short notes', () => {
    render(
      <LatestNote {...props} latestNote={{ content: 'Blah blah blah aaah' }} />
    );

    const noteCell = screen.getByRole('cell');
    const showMore = screen.queryByText('Show more');
    const noteContentContainer = noteCell.querySelector('section');
    const noteContent = screen.getByText('Blah blah blah aaah');

    expect(noteContentContainer).toBeInTheDocument();
    expect(noteContent).toBeInTheDocument();
    expect(showMore).not.toBeInTheDocument();
  });

  it('renders the correct note content and style for long notes', () => {
    render(<LatestNote {...props} />);

    const showMore = screen.getByText('Show more');

    // Ensure show more is not affected by the wrapping formatting as a result of the elipsis
    // when the text is cut off the closing strong tag is not ended - show more should not be affected by this
    expect(showMore).toHaveStyle({ fontWeight: '400' });
    expect(showMore).toHaveStyle({ fontStyle: 'normal' });
    expect(screen.getByTestId('NoteContent')).toHaveTextContent(
      'Hello? Hello? Anybody home? Huh? Think, McFly. Think! I gotta... Show more'
    );
    expect(
      screen.queryByText('go to dummy text value retrieval')
    ).not.toBeInTheDocument();
  });

  it('renders the full note on click', async () => {
    render(<LatestNote {...props} />);

    const noteCell = screen.getByRole('cell');
    const showMore = screen.getByText('Show more');
    const noteContentContainer = noteCell.querySelector('section');

    expect(screen.getByTestId('NoteContent')).toHaveTextContent(
      'Hello? Hello? Anybody home? Huh? Think, McFly. Think! I gotta... Show more'
    );
    expect(showMore).toBeInTheDocument();

    await userEvent.click(noteContentContainer);

    expect(showMore).not.toBeInTheDocument();
    expect(screen.getByTestId('NoteContent')).toHaveTextContent(
      'Hello? Hello? Anybody home? Huh? Think, McFly. Think! I gotta have time to go to dummy text I gotta have time to go to dummy text I gotta have time to go to dummy text value retrieval'
    );
  });

  it('renders the correct note content and style when text is cut of mid tag', () => {
    render(
      <LatestNote
        {...props}
        latestNote={{
          content:
            'I had a horrible nightmare. I dreamed that I went... back in time. It<strong>terrible. -- Sapiente et perferendis corporis voluptas. </strong> Ab numquam assumenda eos omnis ratione quis reiciendis. Rerum sint ex. Consequatur ducimus aperiam tempora veritatis in sit ab.',
        }}
      />
    );

    const showMore = screen.getByText('Show more');

    // Ensure show more is not affected by the wrapping formatting as a result of the elipsis
    // when the text is cut off the closing strong tag is not ended - show more should not be affected by this
    expect(showMore).toHaveStyle({ fontWeight: '400' });
    expect(screen.getByTestId('NoteContent')).toHaveTextContent(
      'I had a horrible nightmare. I dreamed that I went... back in time. It'
    );
    expect(screen.queryByText('<str')).not.toBeInTheDocument();

    // Render again but with text content at location where tag was in last render
    render(
      <LatestNote
        {...props}
        latestNote={{
          content:
            'I had a horrible nightmare. I dreamed that I wentItttt <strong>terrible. -- Sapiente et perferendis corporis voluptas. </strong> Ab numquam assumenda eos omnis ratione quis reiciendis. Rerum sint ex. Consequatur ducimus aperiam tempora veritatis in sit ab.',
        }}
      />
    );
    // Verifies that the tag is not rendered or treated like text when cut off
    expect(screen.getAllByTestId('NoteContent')[1]).toHaveTextContent(
      'I had a horrible nightmare. I dreamed that I wentItttt terribl... Show more'
    );
  });
});
