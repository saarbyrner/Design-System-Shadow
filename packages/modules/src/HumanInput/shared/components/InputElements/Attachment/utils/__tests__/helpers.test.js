import { render, screen } from '@testing-library/react';
import { getIdleLabel } from '../helpers';

describe('helpers', () => {
  describe('getIdleLabel', () => {
    it('should transform the accepted file types', () => {
      const acceptedFilesTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const maxSize = '10mb';
      render(getIdleLabel(acceptedFilesTypes, maxSize));

      expect(
        screen.getByText('Click to upload', { exact: false })
      ).toBeInTheDocument();
      expect(
        screen.getByText('or drag and drop', { exact: false })
      ).toBeInTheDocument();
      expect(
        screen.getByText('JPEG, JPG, PNG', { exact: false })
      ).toBeInTheDocument();
      expect(
        screen.getByText('Max file size: ', { exact: false })
      ).toBeInTheDocument();
      expect(screen.getByText('10mb', { exact: false })).toBeInTheDocument();
    });

    it('should render a different set of accepted file types', () => {
      const acceptedFilesTypes = ['application/pdf', 'text/csv'];
      render(getIdleLabel(acceptedFilesTypes));

      expect(
        screen.getByText('Click to upload', { exact: false })
      ).toBeInTheDocument();
      expect(
        screen.getByText('or drag and drop', { exact: false })
      ).toBeInTheDocument();
      expect(
        screen.getByText('PDF, CSV', { exact: false })
      ).toBeInTheDocument();
    });
  });
});
