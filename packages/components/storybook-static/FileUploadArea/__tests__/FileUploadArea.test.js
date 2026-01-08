import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import FileUploadArea from '../index';

describe('FileUploadContainer', () => {
  let component;
  window.featureFlags = {};

  const testFiles = [{ filename: 'testfile.jpg' }];

  describe('render with container bin removal', () => {
    const mockOnClickAction = jest.fn();

    beforeEach(() => {
      component = render(
        <FileUploadArea
          showActionButton
          areaTitle="Attach file(s)"
          actionIcon="icon-bin"
          attachedFiles={testFiles}
          updateFiles={jest.fn}
          removeFiles={false}
          testIdPrefix="test-container-id"
          isFileError={false}
          t={i18nextTranslateStub()}
          onClickActionButton={mockOnClickAction}
        />
      );
    });

    it('renders the appropriate container elements', () => {
      expect(
        component.getByTestId('test-container-id|FileAttachment')
      ).toBeInTheDocument();
      expect(component.getByText('Attach file(s)')).toBeInTheDocument();
      expect(component.getByRole('button').children[0]).toHaveClass('icon-bin');
    });

    it('calls the on click action method when clicked', async () => {
      await userEvent.click(component.getByRole('button'));
      expect(mockOnClickAction).toHaveBeenCalled();
    });
  });

  describe('render without container bin removal', () => {
    beforeEach(() => {
      component = render(
        <FileUploadArea
          showActionButton={false}
          areaTitle="Attach file(s)"
          attachedFiles={testFiles}
          setAttachedFiles={jest.fn}
          removeFiles={false}
          testIdPrefix="test-container-id"
          isFileError={false}
          t={i18nextTranslateStub()}
        />
      );
    });

    it('does not render the container removal bin', () => {
      expect(component.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('render with a optional sub text span', () => {
    beforeEach(() => {
      component = render(
        <FileUploadArea
          showActionButton={false}
          areaTitle="Attach file(s)"
          attachedFiles={testFiles}
          setAttachedFiles={jest.fn}
          removeFiles={false}
          testIdPrefix="test-container-id"
          isFileError={false}
          t={i18nextTranslateStub()}
          areaTitleSubtext="Any supported file type"
        />
      );
    });

    it('renders the optional sub text', () => {
      expect(
        component.getByText('Any supported file type')
      ).toBeInTheDocument();
    });
  });
});
