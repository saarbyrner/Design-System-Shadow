import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axios } from '@kitman/common/src/utils/services';
import selectEvent from 'react-select-event';
import { SavedLineUpsSidePanelTranslated as SavedLineUpsSidePanel } from '..';

jest.mock('@kitman/common/src/utils/services');

describe('SavedLineUpsSidePanel', () => {
  const gameFormats = [
    { id: 1, name: 'Format 1' },
    { id: 2, name: 'Format 2' },
  ];

  const formations = [
    { id: 1, name: 'Formation 1' },
    { id: 2, name: 'Formation 2' },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: [
        {
          id: 1,
          name: '1st line up',
          organisation_format_id: 1,
          formation_id: 1,
          lineup_positions: [
            {
              athlete_id: 12,
              formation_position_view: {
                id: 1,
                field_id: 1,
                formation_id: 1,
                position: {
                  id: 98,
                  name: 'Forward',
                  order: 1,
                },
                x: 1,
                y: 1,
                order: 1,
              },
            },
            {
              athlete_id: 34,
              formation_position_view: {
                id: 1,
                field_id: 1,
                formation_id: 1,
                position: {
                  id: 98,
                  name: 'Forward',
                  order: 2,
                },
                x: 2,
                y: 2,
                order: 1,
              },
            },
          ],
          author: {
            firstname: 'wilfried',
            fullname: 'wilfried y',
            id: 1,
            lastname: 'y',
          },
        },
        {
          id: 2,
          name: '2nd line up',
          organisation_format_id: 2,
          formation_id: 2,
          lineup_positions: [
            {
              athlete_id: 56,
              formation_position_view: {
                id: 1,
                field_id: 1,
                formation_id: 1,
                position: {
                  id: 63,
                  name: 'Midfielder',
                  order: 1,
                },
                x: 3,
                y: 3,
                order: 3,
              },
            },
          ],
          author: {
            firstname: 'michael',
            fullname: 'michael y',
            id: 1,
            lastname: 'y',
          },
        },
      ],
    });
  });

  it('renders correctly', async () => {
    render(
      <SavedLineUpsSidePanel
        gameFormats={gameFormats}
        formations={formations}
        t={(t) => t}
        isOpen
        onClose={() => {}}
      />
    );

    const titleElement = screen.getByText('Saved Line-up templates');
    const filters = within(screen.getByTestId('filters'));
    const formatFilterLabel = filters.getByText('Format');
    const formationFilterLabel = filters.getByText('Formation');
    const addedByFilterLabel = filters.getByText('Added by');
    const tableHeader = within(screen.getByTestId('table-header'));
    const nameColumn = tableHeader.getByText('Name');
    const formatColumn = tableHeader.getByText('Format');
    const formationColumn = tableHeader.getByText('Formation');
    const addedByColumn = tableHeader.getByText('Added by');

    expect(titleElement).toBeInTheDocument();
    expect(formatFilterLabel).toBeInTheDocument();
    expect(formationFilterLabel).toBeInTheDocument();
    expect(addedByFilterLabel).toBeInTheDocument();
    expect(nameColumn).toBeInTheDocument();
    expect(formatColumn).toBeInTheDocument();
    expect(formationColumn).toBeInTheDocument();
    expect(addedByColumn).toBeInTheDocument();

    expect(await screen.findByText('1st line up')).toBeInTheDocument();
    expect(await screen.findByText('Format 1')).toBeInTheDocument();
    expect(await screen.findByText('Formation 1')).toBeInTheDocument();
    expect(await screen.findByText('wilfried y')).toBeInTheDocument();

    expect(await screen.findByText('2nd line up')).toBeInTheDocument();
    expect(await screen.findByText('Format 2')).toBeInTheDocument();
    expect(await screen.findByText('Formation 2')).toBeInTheDocument();
    expect(await screen.findByText('michael y')).toBeInTheDocument();
  });

  it('should filter the result via dropdown filters', async () => {
    render(
      <SavedLineUpsSidePanel
        gameFormats={gameFormats}
        formations={formations}
        t={(t) => t}
        isOpen
        onClose={() => {}}
      />
    );

    const wrapper = screen.getByTestId('filters');
    const formatFilter = wrapper.querySelector('#react-select-5-input');
    const formationFilter = wrapper.querySelector('#react-select-6-input');
    const addedByFilter = wrapper.querySelector('#react-select-7-input');

    selectEvent.openMenu(formatFilter);
    await selectEvent.select(formatFilter, 'Format 2');
    selectEvent.openMenu(formationFilter);
    await selectEvent.select(formationFilter, 'Formation 2');
    selectEvent.openMenu(addedByFilter);
    await selectEvent.select(addedByFilter, 'michael y');

    const body = within(screen.getByTestId('table-body'));

    expect(body.queryByText('1st line up')).not.toBeInTheDocument();
    expect(body.queryByText('Format 1')).not.toBeInTheDocument();
    expect(body.queryByText('Formation 1')).not.toBeInTheDocument();
    expect(body.queryByText('wilfried y')).not.toBeInTheDocument();

    expect(body.getByText('2nd line up')).toBeInTheDocument();
    expect(body.getByText('Format 2')).toBeInTheDocument();
    expect(body.getByText('Formation 2')).toBeInTheDocument();
    expect(body.getByText('michael y')).toBeInTheDocument();
  });

  it('should filter the result via search bar', async () => {
    render(
      <SavedLineUpsSidePanel
        gameFormats={gameFormats}
        formations={formations}
        t={(t) => t}
        isOpen
        onClose={() => {}}
      />
    );

    const wrapper = screen.getByTestId('search-bar');
    const searchBar = wrapper.querySelector('input');
    await userEvent.type(searchBar, 'michael');

    const body = within(screen.getByTestId('table-body'));

    expect(body.queryByText('1st line up')).not.toBeInTheDocument();
    expect(body.queryByText('Format 1')).not.toBeInTheDocument();
    expect(body.queryByText('Formation 1')).not.toBeInTheDocument();
    expect(body.queryByText('wilfried y')).not.toBeInTheDocument();

    expect(body.getByText('2nd line up')).toBeInTheDocument();
    expect(body.getByText('Format 2')).toBeInTheDocument();
    expect(body.getByText('Formation 2')).toBeInTheDocument();
    expect(body.getByText('michael y')).toBeInTheDocument();

    await userEvent.clear(searchBar);
    await userEvent.type(searchBar, 'wilfried');

    expect(body.queryByText('2nd line up')).not.toBeInTheDocument();
    expect(body.queryByText('Format 2')).not.toBeInTheDocument();
    expect(body.queryByText('Formation 2')).not.toBeInTheDocument();
    expect(body.queryByText('michael y')).not.toBeInTheDocument();

    expect(body.getByText('1st line up')).toBeInTheDocument();
    expect(body.getByText('Format 1')).toBeInTheDocument();
    expect(body.getByText('Formation 1')).toBeInTheDocument();
    expect(body.getByText('wilfried y')).toBeInTheDocument();

    await userEvent.clear(searchBar);
    await userEvent.type(searchBar, 'Format');

    expect(body.getByText('2nd line up')).toBeInTheDocument();
    expect(body.getByText('Format 2')).toBeInTheDocument();
    expect(body.getByText('Formation 2')).toBeInTheDocument();
    expect(body.getByText('michael y')).toBeInTheDocument();

    expect(body.getByText('1st line up')).toBeInTheDocument();
    expect(body.getByText('Format 1')).toBeInTheDocument();
    expect(body.getByText('Formation 1')).toBeInTheDocument();
    expect(body.getByText('wilfried y')).toBeInTheDocument();
  });
});
