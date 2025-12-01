import { screen } from '@testing-library/react';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import ImageUploadModalContainer from '../ImageUploadModal';

describe('ImageUploadModal Container', () => {
  const preloadedState = {
    athleteChat: {
      imageUploadModal: {
        isOpen: true,
      },
      searchableItemGroups: { staff: [], athletes: [] },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal when isOpen is true in the state', () => {
    renderWithRedux(<ImageUploadModalContainer />, {
      preloadedState,
      useGlobalStore: false,
    });

    expect(screen.getByText(/add a channel avatar/i)).toBeInTheDocument();
  });

  it('does not render the modal when isOpen is false', () => {
    const closedState = {
      ...preloadedState,
      athleteChat: {
        ...preloadedState.athleteChat,
        imageUploadModal: {
          isOpen: false,
        },
      },
    };

    const { container } = renderWithRedux(<ImageUploadModalContainer />, {
      preloadedState: closedState,
      useGlobalStore: false,
    });

    expect(container).toBeEmptyDOMElement();
  });
});
