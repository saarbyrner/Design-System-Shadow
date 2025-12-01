import DefaultHeaderCell from '@kitman/modules/src/shared/MassUpload/New/components/DefaultHeaderCell';
import {
  CoachNameHeader,
  PlayerNameHeader,
  ClubHeader,
  TeamHeader,
  LocationHeader,
  DOBHeader,
  StatusHeader,
  IdNumberHeader,
  CoachCountHeader,
  PlayerCountHeader,
  OrganisationNameHeader,
  TotalTeamsHeader,
  TotalStaffHeader,
  TotalPlayersHeader,
  UnpaidBalanceHeader,
  RequirementHeader,
  AttachmentHeader,
  AdminStaffNoteHeader,
  OrganisationGridHeaders,
  RequirementsGridHeaders,
} from '../headers';

describe('headers', () => {
  it('has a CoachNameHeader', () => {
    expect(CoachNameHeader).toEqual({
      id: 'full_name',
      row_key: 'full_name',
      content: <DefaultHeaderCell title="Coach" />,
    });
  });
  it('has a PlayerNameHeader', () => {
    expect(PlayerNameHeader).toEqual({
      id: 'full_name',
      row_key: 'full_name',
      content: <DefaultHeaderCell title="Player" />,
    });
  });
  it('has a ClubHeader', () => {
    expect(ClubHeader).toEqual({
      id: 'club',
      row_key: 'club',
      content: <DefaultHeaderCell title="Club" />,
    });
  });

  it('has a TeamHeader', () => {
    expect(TeamHeader).toEqual({
      id: 'squad',
      row_key: 'squad',
      content: <DefaultHeaderCell title="Team" />,
    });
  });

  it('has a LocationHeader', () => {
    expect(LocationHeader).toEqual({
      id: 'location',
      row_key: 'location',
      content: <DefaultHeaderCell title="State / Province" />,
    });
  });
  it('has a DOBHeader', () => {
    expect(DOBHeader).toEqual({
      id: 'dob',
      row_key: 'dob',
      content: <DefaultHeaderCell title="DOB" />,
    });
  });
  it('has a StatusHeader', () => {
    expect(StatusHeader).toEqual({
      id: 'status',
      row_key: 'status',
      content: <DefaultHeaderCell title="Status" />,
    });
  });
  it('has a IdNumberHeader', () => {
    expect(IdNumberHeader).toEqual({
      id: 'id_number',
      row_key: 'id_number',
      content: <DefaultHeaderCell title="ID Number" />,
    });
  });
  it('has a CoachCountHeader', () => {
    expect(CoachCountHeader).toEqual({
      id: 'coaches',
      row_key: 'coaches',
      content: <DefaultHeaderCell title="Coaches" />,
    });
  });
  it('has a PlayerCountHeader', () => {
    expect(PlayerCountHeader).toEqual({
      id: 'players',
      row_key: 'players',
      content: <DefaultHeaderCell title="Players" />,
    });
  });

  it('has a OrganisationNameHeader', () => {
    expect(OrganisationNameHeader).toEqual({
      id: 'organisation_name',
      row_key: 'organisation_name',
      content: <DefaultHeaderCell title="Club" />,
    });
  });

  it('has a TotalTeamsHeader', () => {
    expect(TotalTeamsHeader).toEqual({
      id: 'total_teams',
      row_key: 'total_teams',
      content: <DefaultHeaderCell title="Total Teams" />,
    });
  });

  it('has a TotalStaffHeader', () => {
    expect(TotalStaffHeader).toEqual({
      id: 'total_staff',
      row_key: 'total_staff',
      content: <DefaultHeaderCell title="Total Staff" />,
    });
  });
  it('has a TotalPlayersHeader', () => {
    expect(TotalPlayersHeader).toEqual({
      id: 'total_players',
      row_key: 'total_players',
      content: <DefaultHeaderCell title="Total Players" />,
    });
  });
  it('has a UnpaidBalanceHeader', () => {
    expect(UnpaidBalanceHeader).toEqual({
      id: 'unpaid_balance',
      row_key: 'unpaid_balance',
      content: <DefaultHeaderCell title="Unpaid Balance" />,
    });
  });

  it('has a RequirementHeader', () => {
    expect(RequirementHeader).toEqual({
      id: 'requirement',
      row_key: 'requirement',
      content: <DefaultHeaderCell title="Requirement" />,
    });
  });

  it('has a AttachmentHeader', () => {
    expect(AttachmentHeader).toEqual({
      id: 'attachment_header',
      row_key: 'attachment_header',
      content: <DefaultHeaderCell title="Attachment" centered />,
    });
  });

  it('has a AdminStaffNoteHeader', () => {
    expect(AdminStaffNoteHeader).toEqual({
      id: 'admin_staff_note',
      row_key: 'admin_staff_note',
      content: <DefaultHeaderCell title="Note" centered />,
    });
  });

  it('has OrganisationGridHeaders', () => {
    expect(OrganisationGridHeaders).toEqual([
      OrganisationNameHeader,
      TotalTeamsHeader,
      TotalStaffHeader,
      TotalPlayersHeader,
      LocationHeader,
      UnpaidBalanceHeader,
    ]);
  });

  it('has RequirementsGridHeaders', () => {
    expect(RequirementsGridHeaders).toEqual([
      RequirementHeader,
      AdminStaffNoteHeader,
      StatusHeader,
    ]);
  });
});
