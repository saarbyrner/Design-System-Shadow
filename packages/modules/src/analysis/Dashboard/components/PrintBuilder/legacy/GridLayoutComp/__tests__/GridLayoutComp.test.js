import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { emptySquadAthletes } from '../../../../utils';
import GridLayoutComp from '../index';

describe('Analytical Dashboard <GridLayoutComp /> component', () => {
  const props = {
    widgets: [
      {
        id: 123,
      },
      {
        id: 456,
      },
    ],
    layout: [
      {
        i: '1',
        x: 0,
        y: 0,
        h: 5,
        w: 6,
        maxH: 7,
        minH: 2,
        maxW: 6,
        minW: 1,
      },
      {
        i: '2',
        x: 0,
        y: 0,
        h: 5,
        w: 6,
        maxH: 7,
        minH: 2,
        maxW: 6,
        minW: 1,
      },
    ],
    squadAthletes: emptySquadAthletes,
    squads: [],
    annotationTypes: [{ organisation_annotation_type_id: 1 }],
    onUpdateDashboardLayout: jest.fn(),
    size: {
      width: 800,
      height: 1000,
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    const { container } = renderWithStore(<GridLayoutComp {...props} />);

    expect(container.querySelector('.react-grid-layout')).toBeInTheDocument();
  });

  it('renders the correct number of widgets', () => {
    const { container } = renderWithStore(<GridLayoutComp {...props} />);

    const widgetElements = container.querySelectorAll('.react-grid-item');
    expect(widgetElements).toHaveLength(2);
  });

  it('calls the correct action when a widget is resized', () => {
    const sampleLayout = [
      {
        i: '1',
        x: 0,
        y: 0,
        h: 5,
        w: 6,
        maxH: 7,
        minH: 2,
        maxW: 6,
        minW: 1,
      },
      {
        i: '2',
        x: 0,
        y: 0,
        h: 5,
        w: 6,
        maxH: 7,
        minH: 2,
        maxW: 6,
        minW: 1,
      },
    ];

    renderWithStore(<GridLayoutComp {...props} />);

    props.onUpdateDashboardLayout(sampleLayout);
    expect(props.onUpdateDashboardLayout).toHaveBeenCalledWith(sampleLayout);
  });
});
