// @flow
import { data as mockCSVAthlete } from '@kitman/modules/src/shared/MassUpload/services/mocks/data/mock_athlete_csv';

export const mockColumns = [
  {
    id: 'FirstName',
    row_key: 'FirstName',
    content: <div>FirstName</div>,
  },
  {
    id: 'LastName',
    row_key: 'LastName',
    content: <div>LastName Status</div>,
  },
  {
    id: 'Email',
    row_key: 'Email',
    content: <div>Email</div>,
  },
  {
    id: 'DOB',
    row_key: 'DOB',
    content: <div>DOB</div>,
  },
  {
    id: 'SquadName',
    row_key: 'SquadName',
    content: <div>SquadName</div>,
  },
  {
    id: 'Country',
    row_key: 'Country',
    content: <div>Country</div>,
  },
  {
    id: 'Position',
    row_key: 'Position',
    content: <div>Position</div>,
  },
];

export const mockValidRows = mockCSVAthlete.validData;

// $FlowIgnore test_utils
export const mockInvalidRows = mockCSVAthlete.invalidData.map((row) => ({
  ...row,
  classnames: {
    is__error: true,
  },
}));

// $FlowIgnore test_utils
export const mockRows = [...mockValidRows, ...mockInvalidRows].map(
  (data, index) => ({
    id: index,
    cells: [
      {
        id: 'FirstName',
        content: <span>{data.FirstName}</span>,
      },
      {
        id: 'LastName',
        content: <span>{data.LastName}</span>,
      },
      {
        id: 'Email',
        content: <span>{data.Email}</span>,
      },
      {
        id: 'DOB',
        content: <span>{data.DOB}</span>,
      },
      {
        id: 'SquadName',
        content: <span>{data.SquadName}</span>,
      },
      {
        id: 'Country',
        content: <span>{data.Country}</span>,
      },
      {
        id: 'Position',
        content: <span>{data.Position}</span>,
      },
    ],
    classnames: {
      athlete__row: true,
      // $FlowIgnore
      ...data.classnames,
    },
  })
);

export const MockMassUploadNew = () => <div>test component</div>;
