const grids = {
  association_organisation: {
    columns: [
      { field: 'organisations', headerName: 'Club', flex: 2, type: 'avatar' },
      { field: 'total_squads', headerName: 'Total Teams', type: 'text' },
      { field: 'total_staff', headerName: 'Total Staff', type: 'text' },
      { field: 'total_athletes', headerName: 'Total Players', type: 'text' },
      { field: 'address', headerName: 'State / Province', type: 'text' },
      { field: 'amount_paid', headerName: 'Amount paid', type: 'text' },
      { field: 'wallet', headerName: 'Club wallet', type: 'text' },
    ],
  },
  association_athlete: {
    columns: [
      { field: 'athlete', headerName: 'Player', flex: 2, type: 'avatar' },
      {
        field: 'organisations',
        headerName: 'Club(s)',
        type: 'avatar',
        flex: 2,
      },
      { field: 'leagues', headerName: 'League(s)', type: 'text' },
      { field: 'date_of_birth', headerName: 'DOB', type: 'text' },
      { field: 'position', headerName: 'Position', type: 'text' },
      {
        field: 'registration_status',
        headerName: 'Status',
        type: 'status',
        flex: 2,
      },
    ],
  },
  association_staff: {
    columns: [
      { field: 'user', headerName: 'Coach', flex: 2, type: 'avatar' },
      { field: 'club', headerName: 'Team', type: 'avatar' },
      { field: 'id_number', headerName: 'ID Number', type: 'text' },
      { field: 'address', headerName: 'State / Province', type: 'text' },
      { field: 'date_of_birth', headerName: 'DOB', type: 'text' },
      { field: 'registration_status', headerName: 'Status', type: 'status' },
    ],
  },

  association_squad: {
    columns: [
      { field: 'name', headerName: 'Team', type: 'link' },
      { field: 'total_coaches', headerName: 'Total Staff', type: 'text' },
      { field: 'total_athletes', headerName: 'Total Players', type: 'text' },
    ],
  },
  organisation_athlete: {
    columns: [
      { field: 'athlete', headerName: 'Player', flex: 2, type: 'avatar' },
      { field: 'leagues', headerName: 'League(s)', type: 'text' },
      { field: 'teams', headerName: 'Team', type: 'link' },
      { field: 'address', headerName: 'State / Province', type: 'text' },
      { field: 'date_of_birth', headerName: 'DOB', type: 'text' },
      { field: 'jersey_no', headerName: 'Jersey No', type: 'text' },
      { field: 'type', headerName: 'Type', type: 'text' },
      { field: 'registration_status', headerName: 'Status', type: 'status' },
    ],
  },
  organisation_staff: {
    columns: [
      { field: 'user', headerName: 'Coach', flex: 2, type: 'avatar' },
      { field: 'id_number', headerName: 'ID Number', type: 'text' },
      { field: 'address', headerName: 'State / Province', type: 'text' },
      { field: 'date_of_birth', headerName: 'DOB', type: 'text' },
      { field: 'registration_status', headerName: 'Status', type: 'status' },
    ],
  },
  organisation_squad: {
    columns: [
      { field: 'name', headerName: 'Team', type: 'link' },
      { field: 'total_coaches', headerName: 'Total Staff', type: 'text' },
      { field: 'total_athletes', headerName: 'Total Players', type: 'text' },
    ],
  },
  registrations: {
    columns: [
      {
        field: 'organisations',
        headerName: 'Club(s)',
        type: 'avatar',
        flex: 2,
      },
      { field: 'leagues', headerName: 'League(s)', type: 'text' },
      { field: 'date_of_birth', headerName: 'DOB', type: 'text' },
      { field: 'position', headerName: 'Position', type: 'text' },
      {
        field: 'registration_status',
        headerName: 'Status',
        type: 'status',
        flex: 2,
      },
    ],
  },
  profile_squads: {
    columns: [
      { field: 'teams', headerName: 'Team', type: 'link' },
      { field: 'address', headerName: 'State / Province', type: 'text' },
      { field: 'date_of_birth', headerName: 'DOB', type: 'text' },
      { field: 'jersey_no', headerName: 'Jersey No', type: 'text' },
      { field: 'type', headerName: 'Type', type: 'text' },
      {
        field: 'registration_status',
        headerName: 'Status',
        type: 'status',
      },
    ],
  },
};

export default grids;
