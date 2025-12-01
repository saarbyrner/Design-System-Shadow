import {
  NameHeader,
  PublishedAtHeader,
  SquadsHeader,
  StatusHeader,
  VersionHeader,
  SquadHeader,
  ActivePlayersHeader,
  AssignedDateHeader,
  AssignedHeader,
} from '@kitman/modules/src/ConditionalFields/shared/components/CommonGridStyle/headers';
import { ROW_KEY } from '@kitman/modules/src/ConditionalFields/shared/types';
import {
  DefaultHeaderCell,
  CheckboxHeaderCell,
} from '@kitman/modules/src/ConditionalFields/shared/components/Cells';

describe('headers', () => {
  it('has a NameHeader', () => {
    expect(NameHeader).toEqual({
      id: ROW_KEY.name,
      row_key: ROW_KEY.name,
      content: <DefaultHeaderCell title="Name" />,
    });
  });
  it('has a PublishedAtHeader', () => {
    expect(PublishedAtHeader).toEqual({
      id: ROW_KEY.published_at,
      row_key: ROW_KEY.published_at,
      content: <DefaultHeaderCell title="Published on" />,
    });
  });
  it('has a SquadsHeader', () => {
    expect(SquadsHeader).toEqual({
      id: ROW_KEY.squads,
      row_key: ROW_KEY.squads,
      content: <DefaultHeaderCell title="Squads" />,
    });
  });
  it('has a StatusHeader', () => {
    expect(StatusHeader).toEqual({
      id: ROW_KEY.status,
      row_key: ROW_KEY.status,
      content: <DefaultHeaderCell title="Status" />,
    });
  });
  it('has a VersionHeader', () => {
    expect(VersionHeader).toEqual({
      id: ROW_KEY.version,
      row_key: ROW_KEY.version,
      content: <DefaultHeaderCell title="Version" />,
    });
  });
  it('has a SquadHeader', () => {
    expect(SquadHeader).toEqual({
      id: ROW_KEY.squad,
      row_key: ROW_KEY.squad,
      content: <DefaultHeaderCell title="Squad" />,
    });
  });
  it('has a NumberOfActivePlayersHeader', () => {
    expect(ActivePlayersHeader).toEqual({
      id: ROW_KEY.active_players,
      row_key: ROW_KEY.active_players,
      content: <DefaultHeaderCell title="Active players" />,
    });
  });
  it('has a AssignedHeader', () => {
    expect(
      JSON.stringify(AssignedHeader(false, false, false, jest.fn()))
    ).toStrictEqual(
      JSON.stringify({
        id: ROW_KEY.assigned,
        row_key: ROW_KEY.assigned,
        content: (
          <CheckboxHeaderCell
            title="Assigned"
            editMode={false}
            checked={false}
            indeterminate={false}
            onChange={jest.fn()}
          />
        ),
      })
    );
  });
  it('has a AssignedDateHeader', () => {
    expect(AssignedDateHeader).toEqual({
      id: ROW_KEY.assigned_date,
      row_key: ROW_KEY.assigned_date,
      content: <DefaultHeaderCell title="Assigned date" />,
    });
  });
});
