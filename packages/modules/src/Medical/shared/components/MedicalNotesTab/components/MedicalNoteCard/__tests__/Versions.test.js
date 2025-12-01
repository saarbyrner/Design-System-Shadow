import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import moment from 'moment-timezone';
import { MockMedicalVersions } from '../mocks';

import Version from '../Version';

describe('<Version/>', () => {
  const i18nT = i18nextTranslateStub();

  beforeEach(() => {
    moment.tz.setDefault('UTC');
  });

  const props = {
    version: MockMedicalVersions[0],
    versionNumber: 1,
    t: i18nT,
  };

  it('renders the default content', () => {
    render(<Version {...props} />);
    expect(screen.getByTestId('Version|changeset')).toBeInTheDocument();
    expect(screen.getByTestId('Version|author')).toBeInTheDocument();
    expect(screen.getByTestId('Version|author')).toHaveTextContent(
      'Edit 1: Aug 4, 2022 by An Author'
    );
  });

  it('renders without an author', () => {
    const versionNoAuthor = { ...MockMedicalVersions[0], updated_by: null };

    render(<Version {...props} version={versionNoAuthor} />);
    expect(screen.getByTestId('Version|author')).toBeInTheDocument();
    expect(screen.getByTestId('Version|author')).toHaveTextContent(
      'Edit 1: Aug 4, 2022 by Unknown'
    );
  });

  it('renders the changed note values', () => {
    render(<Version {...props} />);
    const title = screen.getByTestId('Version|title');
    const annotationDate = screen.getByTestId('Version|annotation_date');
    const squads = screen.getByTestId('Version|squads');
    const content = screen.getByTestId('Version|content');
    const visibility = screen.getByTestId('Version|visibility');

    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(
      'Title updated from Old title to New title'
    );
    expect(annotationDate).toBeInTheDocument();
    expect(annotationDate).toHaveTextContent(
      'Date updated from Jul 25, 2022 to Jul 28, 2022'
    );
    expect(squads).toBeInTheDocument();
    expect(squads).toHaveTextContent(
      'Squad updated from Old Squad to New squad'
    );
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent('Note content updated to New content');
    expect(visibility).toBeInTheDocument();
    expect(visibility).toHaveTextContent(
      'Visibility updated from Old visibility to New visibility'
    );
  });

  it('renders correctly when null values are present in arrays', () => {
    render(<Version {...props} version={MockMedicalVersions[1]} />);
    const title = screen.getByTestId('Version|title');
    const annotationDate = screen.getByTestId('Version|annotation_date');
    const squads = screen.getByTestId('Version|squads');
    const content = screen.getByTestId('Version|content');
    const visibility = screen.getByTestId('Version|visibility');

    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Title updated from to New title');
    expect(annotationDate).toBeInTheDocument();
    expect(annotationDate).toHaveTextContent(
      'Date updated from to Jul 28, 2022'
    );
    expect(squads).toBeInTheDocument();
    expect(squads).toHaveTextContent('Squad updated from to New squad');
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent(
      'Note content updated from Note content updated to New content'
    );
    expect(visibility).toBeInTheDocument();
    expect(visibility).toHaveTextContent(
      'Visibility updated from to New visibility'
    );
  });
});
