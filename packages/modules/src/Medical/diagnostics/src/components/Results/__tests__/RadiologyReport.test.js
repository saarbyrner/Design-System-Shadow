import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import moment from 'moment-timezone';
import {
  mockedDiagnosticContextValue,
  MockedDiagnosticContextProvider,
} from '@kitman/modules/src/Medical/shared/contexts/DiagnosticContext/utils/mocks';
import { mockedDiagnosticRadiologyResultsContextValue } from '@kitman/modules/src/Medical/shared/contexts/DiagnosticResultsContext/utils/mocks';
import RadiologyReport from '../RadiologyReport';

describe('<RadiologyReport />', () => {
  beforeEach(() => {
    moment.tz.setDefault('UTC');
  });

  afterEach(() => {
    moment.tz.setDefault();
  });

  const props = {
    t: i18nextTranslateStub(),
  };

  it('renders the correct headings & section content when completed_at is empty', () => {
    render(
      <MockedDiagnosticContextProvider
        diagnosticContext={mockedDiagnosticContextValue}
      >
        <RadiologyReport
          {...props}
          resultBlocks={
            mockedDiagnosticRadiologyResultsContextValue.resultBlocks.results[0]
          }
        />
      </MockedDiagnosticContextProvider>
    );

    const checkBox = screen.getByRole('checkbox');
    expect(checkBox).toBeInTheDocument();

    const heading = screen.getByRole('heading', { level: 2 }).textContent;
    expect(heading).toEqual('Results');

    const findingsHeading = screen.getAllByRole('heading', { level: 4 });
    expect(findingsHeading[1]).toHaveTextContent('Findings');

    const radiologyDataHeadings = screen.getAllByRole('heading', { level: 5 });
    expect(radiologyDataHeadings.length).toBe(3);

    expect(radiologyDataHeadings[0]).toHaveTextContent(
      'SERVED! Clinical History'
    );

    expect(radiologyDataHeadings[1]).toHaveTextContent('Technique');
    expect(radiologyDataHeadings[2]).toHaveTextContent('Comparison');

    expect(
      screen.getByText(
        'Contiguous axial images of the left foot were obtained without intravenous contrast. Coronal and sagittal'
      )
    ).toBeInTheDocument();
  });

  it('renders the correct headings & section content when completed_at is valid', () => {
    render(
      <MockedDiagnosticContextProvider
        diagnosticContext={mockedDiagnosticContextValue}
      >
        <RadiologyReport
          {...props}
          resultBlocks={{
            ...mockedDiagnosticRadiologyResultsContextValue.resultBlocks
              .results[0],
            completed_at: '2023-05-06T00:00:00+01:00',
          }}
        />
      </MockedDiagnosticContextProvider>
    );

    const checkBox = screen.getByRole('checkbox');
    expect(checkBox).toBeInTheDocument();

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Results - 05/05/2023 11:00 pm');

    const findingsHeading = screen.getAllByRole('heading', { level: 4 });
    expect(findingsHeading[1]).toHaveTextContent('Findings');

    const radiologyDataHeadings = screen.getAllByRole('heading', { level: 5 });
    expect(radiologyDataHeadings.length).toBe(3);

    expect(radiologyDataHeadings[0]).toHaveTextContent(
      'SERVED! Clinical History'
    );

    expect(radiologyDataHeadings[1]).toHaveTextContent('Technique');
    expect(radiologyDataHeadings[2]).toHaveTextContent('Comparison');

    expect(
      screen.getByText(
        'Contiguous axial images of the left foot were obtained without intravenous contrast. Coronal and sagittal'
      )
    ).toBeInTheDocument();
  });

  it('does not render formatted_text content when formatted_text is null', () => {
    render(
      <MockedDiagnosticContextProvider
        diagnosticContext={mockedDiagnosticContextValue}
      >
        <RadiologyReport
          {...props}
          resultBlocks={{
            ...mockedDiagnosticRadiologyResultsContextValue.resultBlocks
              .results[0],
            result: {
              ...mockedDiagnosticRadiologyResultsContextValue.resultBlocks
                .results[0].result,
              formatted_text: null,
            },
          }}
        />
      </MockedDiagnosticContextProvider>
    );

    expect(
      screen.queryByRole('heading', { level: 5, name: 'Formatted Head 1' })
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Formatted Body 1')).not.toBeInTheDocument();
  });
});
