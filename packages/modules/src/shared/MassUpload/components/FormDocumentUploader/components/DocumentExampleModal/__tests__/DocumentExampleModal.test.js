import { screen, render } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import DocumentExampleModal from '../index';

describe('<DocumentExampleModal/>', () => {
  const i18nT = i18nextTranslateStub();

  const props = {
    t: i18nT,
    openModal: true,
    setOpenModal: jest.fn(),
    exampleFile: { filename: 'this-is-my-file.pdf' },
  };
  beforeEach(() => {
    i18nextTranslateStub();
  });

  it('renders <DocumentExampleModal/> and relevant info', () => {
    render(<DocumentExampleModal {...props} />);
    const closeButton = screen.getByRole('button', {
      name: 'Close',
      hidden: true,
    });
    expect(closeButton).toBeInTheDocument();
    expect(screen.getByText('this-is-my-file.pdf')).toBeInTheDocument();
  });

  it('doesnt render modal if openModal is false', () => {
    render(<DocumentExampleModal {...props} openModal={false} />);
    const closeButton = screen.queryByRole('button', {
      name: 'Close',
      hidden: true,
    });
    expect(closeButton).not.toBeInTheDocument();
  });
});
