import { screen } from '@testing-library/react';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { annotation } from '@kitman/modules/src/Annotations/components/AnnotationModal/resources/AnnotationDummyData';
import AnnotationModalContainer from '../AnnotationModal';

const containerProps = {
  users: [
    {
      id: 1,
      name: 'Jon Doe',
    },
    {
      id: 2,
      name: 'John Appleseed',
    },
    {
      id: 27280,
      name: 'Gustavo Lazaro Amendola',
    },
  ],
  annotationTypes: [
    {
      organisation_annotation_type_id: 1,
    },
  ],
  timeRange: {
    start_time: '2019-01-29T00:00:00.000+00:00',
    end_time: '2020-01-30T23:59:59.000+00:00',
  },
};

const mockStore = {
  notesWidget: {
    notesModal: {
      isNotesModalOpen: false,
    },
    population: {
      applies_to_squad: true,
      position_groups: [],
      positions: [],
      athletes: [],
      all_squads: false,
      squads: [],
    },
    time_scope: {
      time_period: 'this_season',
      start_time: undefined,
      end_time: undefined,
      time_period_length: null,
    },
    time_range: {
      start_time: '2019-01-29T00:00:00.000+00:00',
      end_time: '2020-01-30T23:59:59.000+00:00',
    },
    widget_annotation_types: [
      {
        organisation_annotation_type_id: 1,
      },
    ],
    widgetId: 123,
    availableAthletes: [
      {
        id: 1,
        title: 'Jon Doe',
      },
      {
        id: 2,
        title: 'John Appleseed',
      },
      {
        id: 27280,
        title: 'Gustavo Lazaro Amendola',
      },
    ],
    toast: {
      fileOrder: [],
      fileMap: {},
    },
  },
  annotation: {
    ...annotation(),
  },
};

describe('AnnotationModal Container', () => {
  const openModalStore = {
    ...mockStore,
    notesWidget: {
      ...mockStore.notesWidget,
      notesModal: {
        isNotesModalOpen: true,
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    renderWithStore(
      <AnnotationModalContainer {...containerProps} />,
      {},
      openModalStore
    );

    expect(screen.getByText('Edit Note')).toBeInTheDocument();
    expect(screen.getByText('Note type')).toBeInTheDocument();
    expect(screen.getByText('Note title')).toBeInTheDocument();
  });

  it('renders the modal closed by default', () => {
    renderWithStore(
      <AnnotationModalContainer {...containerProps} />,
      {},
      mockStore
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders the modal open when isNotesModalOpen is true', () => {
    renderWithStore(
      <AnnotationModalContainer {...containerProps} />,
      {},
      openModalStore
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('renders the list of athletes', () => {
    renderWithStore(
      <AnnotationModalContainer {...containerProps} />,
      {},
      openModalStore
    );

    expect(screen.getByText('#sport_specific__Athlete')).toBeInTheDocument();
    expect(screen.getByText('Jon Doe')).toBeInTheDocument();
    expect(screen.getByText('John Appleseed')).toBeInTheDocument();
  });
});
