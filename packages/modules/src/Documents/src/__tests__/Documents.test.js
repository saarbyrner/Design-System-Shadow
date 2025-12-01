import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server, rest } from '@kitman/services/src/mocks/server';
import Documents from '../..';

// DelayedLoadingFeedback is mocked because it contains
// a timeout that complicates testing this component

jest.mock('@kitman/components/src/DelayedLoadingFeedback');

describe('<Documents />', () => {
  it('displays the correct document file names after loading', async () => {
    render(<Documents />);
    expect(screen.getByText('Loading ...')).toBeInTheDocument();
    await waitForElementToBeRemoved(screen.queryByText('Loading ...'));

    // Once the data is loaded...
    await waitFor(() => {
      expect(screen.getByText('mock-video.mp4')).toBeInTheDocument();
      expect(screen.getByText('mock-audio.mp3')).toBeInTheDocument();
      expect(screen.getByText('mock-image.jpg')).toBeInTheDocument();
    });
  });

  it('displays the error message when the request fails', async () => {
    // Stub the request to simulate a failing request
    server.use(
      rest.get('/ui/initial_data_documents', (req, res, ctx) =>
        res(ctx.status(500))
      )
    );

    render(<Documents />);
    expect(
      await screen.findByText('Something went wrong!')
    ).toBeInTheDocument();
  });

  describe('when downloading an existing document', () => {
    // To test this functionality, it is required
    // to override the window location object
    const windowLocation = window.location;

    beforeEach(() => {
      delete window.location;
      window.location = { ...windowLocation, assign: jest.fn() };
    });

    afterEach(() => {
      window.location = windowLocation;
    });

    it('sets the correct window location', async () => {
      render(<Documents />);
      await waitForElementToBeRemoved(screen.queryByText('Loading ...'));

      // Once the data is loaded, click the first row action button
      const documents = screen.getByTestId('Documents');
      const firstRowButton = documents.querySelector(
        '.dataGrid__rowActionsCell button'
      );
      await userEvent.click(firstRowButton);

      // Click download button
      await userEvent.click(
        screen.getByRole('button', {
          name: /download/i,
        })
      );

      expect(window.location.assign).toHaveBeenCalledWith(
        'http://www.mock-video-download.com'
      );
    });
  });

  describe('when uploading a new document', () => {
    const mockGoogleSheetFile = new File(
      ['mock-google-sheet'],
      'mock-google-sheet.csv',
      {
        type: 'document/csv',
      }
    );

    it('displays the success feedback and shows the new document', async () => {
      render(<Documents />);
      await waitForElementToBeRemoved(screen.queryByText('Loading ...'));

      // Upload file
      const fileInput = screen.getByLabelText(/upload file:/i);
      await userEvent.upload(fileInput, mockGoogleSheetFile);

      // Wait till the success feedback is shown
      await screen.findByText('mock-google-sheet.csv uploaded successfully');

      // Display the first content row with the uploaded document
      const documents = screen.getByTestId('Documents');
      const firstContentRow = documents.querySelector(
        '.dataGrid__body .dataGrid__row'
      );
      expect(firstContentRow).toHaveTextContent('mock-google-sheet.csv');
    });

    it('displays the error feedback when the request fails', async () => {
      // Stub the request to simulate a failing request
      server.use(
        rest.post('/documents', (req, res, ctx) => res(ctx.status(500)))
      );

      render(<Documents />);
      await waitForElementToBeRemoved(screen.queryByText('Loading ...'));

      // Upload file
      const fileInput = screen.getByLabelText(/upload file:/i);
      await userEvent.upload(fileInput, mockGoogleSheetFile);

      await waitFor(() => {
        expect(screen.getByText('Upload unsuccessful')).toBeInTheDocument();
      });
    });
  });

  describe('when deleting an existing document', () => {
    it('displays the delete modal and hides it after cancelling', async () => {
      render(<Documents />);
      await waitForElementToBeRemoved(screen.queryByText('Loading ...'));

      // Once the data is loaded, click the first row action button
      const documents = screen.getByTestId('Documents');
      const firstRowButton = documents.querySelector(
        '.dataGrid__rowActionsCell button'
      );
      await userEvent.click(firstRowButton);

      // Click delete button
      await userEvent.click(
        screen.getByRole('button', {
          name: /delete/i,
        })
      );

      const modalContentText = screen.getByText('Delete mock-video.mp4');
      expect(modalContentText).toBeInTheDocument();

      // Click cancel button
      const cancelButton = screen
        .getByTestId('Modal|Footer')
        .querySelector('button');
      await userEvent.click(cancelButton);

      expect(modalContentText).not.toBeInTheDocument();
    });

    it('displays the success feedback and remove the document correctly', async () => {
      render(<Documents />);
      await waitForElementToBeRemoved(screen.queryByText('Loading ...'));

      const documents = screen.getByTestId('Documents');
      const firstDocumentFileName = screen.getByText('mock-video.mp4');
      expect(firstDocumentFileName).toBeInTheDocument();

      // Click the first row action button
      const firstRowButton = documents.querySelector(
        '.dataGrid__rowActionsCell button'
      );
      await userEvent.click(firstRowButton);

      // Click delete button
      await userEvent.click(
        screen.getByRole('button', {
          name: /delete/i,
        })
      );

      // Click destruct button
      const destructButton = screen
        .getByTestId('Modal|Footer')
        .querySelectorAll('button')[1];
      await userEvent.click(destructButton);

      await waitFor(() => {
        expect(
          screen.getByText('mock-video.mp4 deleted successfully')
        ).toBeInTheDocument();
      });

      expect(firstDocumentFileName).not.toBeInTheDocument();
    });

    it('displays the error feedback when the request fails', async () => {
      render(<Documents />);
      await waitForElementToBeRemoved(screen.queryByText('Loading ...'));

      const documents = screen.getByTestId('Documents');

      // Click the first row action button
      const firstRowButton = documents.querySelector(
        '.dataGrid__rowActionsCell button'
      );
      await userEvent.click(firstRowButton);

      // Click delete button
      await userEvent.click(
        screen.getByRole('button', {
          name: /delete/i,
        })
      );

      // Stub the request to simulate a failing request
      server.use(
        rest.delete('/documents/124565', (req, res, ctx) =>
          res(ctx.status(500))
        )
      );

      // Click destruct button
      const destructButton = screen
        .getByTestId('Modal|Footer')
        .querySelectorAll('button')[1];
      await userEvent.click(destructButton);

      await waitFor(() => {
        expect(screen.getByText('Delete unsuccessful')).toBeInTheDocument();
      });
    });
  });
});
