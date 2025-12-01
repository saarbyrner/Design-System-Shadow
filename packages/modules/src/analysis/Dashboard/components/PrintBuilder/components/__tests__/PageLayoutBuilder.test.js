import { screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import PageLayoutBuilder from '../PageLayoutBuilder';
import { renderWithContext } from './testUtils';
import { MM_TO_PX, PAGE_DIMENSIONS_MM } from '../../constants';
import {
  DERIVED_PAGES_FROM_MOCKS,
  MOCK_WIDGETS,
} from '../../__tests__/mockData';

describe('PrintBuilder|<PageLayoutBuilder />', () => {
  const t = i18nextTranslateStub();
  const defaultProps = {
    t,
    pages: DERIVED_PAGES_FROM_MOCKS,
    pageWidthPx: PAGE_DIMENSIONS_MM.a4.long * MM_TO_PX,
    pageHeight: PAGE_DIMENSIONS_MM.a4.long,
    pageWidth: PAGE_DIMENSIONS_MM.a4.short,
    onUpdateLayout: () => {},
    handleReset: () => {},
  };

  it('renders a react-grid-layout per page supplied', () => {
    const { container } = renderWithContext(
      <PageLayoutBuilder {...defaultProps} />
    );

    expect(container.getElementsByClassName('react-grid-layout').length).toBe(
      DERIVED_PAGES_FROM_MOCKS.length
    );

    expect(container.getElementsByClassName('react-grid-item').length).toBe(
      MOCK_WIDGETS.length
    );
  });

  it('renders the widget titles in the placeholders', () => {
    renderWithContext(<PageLayoutBuilder {...defaultProps} />);

    [
      'Widget 1',
      'Widget 2',
      'Widget 3',
      'Widget 4',
      'Widget 5',
      'Widget 6',
      'Widget 7',
      'Widget 8',
      'Widget 9',
      'Widget 10',
    ].forEach((widgetTitle) => {
      expect(screen.queryByText(widgetTitle)).toBeInTheDocument();
    });
  });
});
