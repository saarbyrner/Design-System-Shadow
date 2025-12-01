import { KITMAN_ICON_NAMES } from '@kitman/playbook/icons';
import {
  IMPORT_TYPES,
  IMPORT_TYPES_WITH_DELETE,
} from '@kitman/modules/src/shared/MassUpload/New/utils/consts';

import {
  transformImportsListToRows,
  renderSubmissionStatusCell,
  renderExportCsvColumn,
  renderDeleteImportCell,
  getColumns,
} from '../index';
import style from '../../styles';
import {
  SubmissionStatusChipIconFills,
  SubmissionStatusChipBackgroundColors,
} from '../consts';

describe('utils', () => {
  describe('transformImportsListToRows', () => {
    it('transforms the argument correctly', () => {
      const list = Array(3)
        .fill()
        .map((_, i) => ({
          id: i,
          createdAt: '2024-08-13T09:35:37+01:00',
          createdBy: { fullname: i },
          status: i,
          attachments: [
            {
              id: 1,
              url: 'test/url',
              filename: 'something.csv',
            },
            {
              id: 1,
              url: 'test/url',
              filename: 'errors.csv',
            },
          ],
          canDelete: true,
        }));

      expect(transformImportsListToRows(list)).toEqual(
        list.map((submission) => ({
          id: submission.id,
          submissionDate: submission.createdAt,
          submittedBy: submission.createdBy.fullname,
          submissionStatus: submission.status,
          exportSuccessCsv: submission.attachments[0].url,
          exportErrorCsv: submission.attachments[1].url,
          deleteImport: {
            canDelete: submission.canDelete,
            attachmentId: submission.attachments[0].id,
            submissionStatus: submission.status,
            importType: submission.importType,
          },
        }))
      );
    });

    it('return an empty array if no argument is passed', () => {
      expect(transformImportsListToRows()).toEqual([]);
    });

    it('transforms a completed submission correctly and sorts by date', () => {
      const list = [
        {
          id: 1,
          importType: IMPORT_TYPES.GrowthAndMaturation,
          createdAt: '2024-08-13T09:35:37+01:00',
          createdBy: { fullname: 1 },
          status: 'completed',
          importErrors: [{}],
          attachments: [
            {
              id: 1,
              url: 'test/url',
              filename: 'something.csv',
            },
            {
              id: 2,
              url: 'test/url',
              filename: 'errors.csv',
            },
          ],
          canDelete: true,
        },
        {
          id: 2,
          importType: IMPORT_TYPES.GrowthAndMaturation,
          createdAt: '2024-08-14T09:35:37+01:00',
          createdBy: { fullname: 2 },
          status: 'completed',
          importErrors: [],
          attachments: [
            {
              id: 1,
              url: 'test/url',
              filename: 'something.csv',
            },
            {
              id: 2,
              url: 'test/url',
              filename: 'errors.csv',
            },
          ],
          canDelete: false,
        },
      ];

      expect(transformImportsListToRows(list)).toEqual([
        {
          id: 2,
          submissionDate: '2024-08-14T09:35:37+01:00',
          submittedBy: 2,
          submissionStatus: 'completed',
          exportSuccessCsv: 'test/url',
          exportErrorCsv: 'test/url',
          deleteImport: {
            canDelete: false,
            attachmentId: 1,
            submissionStatus: 'completed',
            importType: IMPORT_TYPES.GrowthAndMaturation,
          },
        },
        {
          id: 1,
          submissionDate: '2024-08-13T09:35:37+01:00',
          submittedBy: 1,
          submissionStatus: 'errored',
          exportSuccessCsv: 'test/url',
          exportErrorCsv: 'test/url',
          deleteImport: {
            canDelete: true,
            attachmentId: 1,
            submissionStatus: 'errored',
            importType: IMPORT_TYPES.GrowthAndMaturation,
          },
        },
      ]);
    });
  });

  describe('renderSubmissionStatusCell', () => {
    const pending = {
      input: 'pending',
      expected: {
        backgroundColor: SubmissionStatusChipBackgroundColors.InProgress,
        props: {
          icon: {
            name: KITMAN_ICON_NAMES.ContrastOutlined,
            sx: style.getSubmissionStatusChipIconStyle(
              SubmissionStatusChipIconFills.InProgress
            ),
          },
          label: 'In progress',
        },
      },
    };

    const errored = {
      input: 'errored',
      expected: {
        backgroundColor: SubmissionStatusChipBackgroundColors.Unsuccessful,
        props: {
          icon: {
            name: KITMAN_ICON_NAMES.ErrorOutline,
            sx: style.getSubmissionStatusChipIconStyle(
              SubmissionStatusChipIconFills.Unsuccessful
            ),
          },
          label: 'Unsuccessful',
        },
      },
    };

    const tests = [
      pending,
      { ...pending, input: 'running' },
      {
        input: 'completed',
        expected: {
          backgroundColor: SubmissionStatusChipBackgroundColors.Completed,
          props: {
            icon: {
              name: KITMAN_ICON_NAMES.CheckCircleOutline,
              sx: style.getSubmissionStatusChipIconStyle(
                SubmissionStatusChipIconFills.Completed
              ),
            },
            label: 'Completed',
          },
        },
      },
      errored,
      { ...errored, input: 'a non-existing' },
    ];

    it.each(tests)(
      'returns a correct object for $input status',
      ({ input, expected }) => {
        const {
          props: {
            size,
            sx,
            label,
            icon: { props },
          },
        } = renderSubmissionStatusCell({ value: input });

        expect(size).toEqual('small');
        expect(sx).toEqual(
          style.getSubmissionStatusChipStyle(expected.backgroundColor)
        );
        expect(label).toEqual(expected.props.label);
        expect(props).toEqual(expected.props.icon);
      }
    );

    describe('getColumns', () => {
      const defaultColumns = [
        {
          field: 'submissionDate',
          headerName: 'Submission date',
          flex: 1,
          valueFormatter: expect.any(Function),
        },
        {
          field: 'submittedBy',
          headerName: 'Submitted by',
          flex: 1,
        },
        {
          field: 'submissionStatus',
          headerName: 'Submission status',
          flex: 2,
          renderCell: renderSubmissionStatusCell,
        },
        {
          field: 'exportSuccessCsv',
          headerName: 'Submitted file',
          flex: 1,
          renderCell: renderExportCsvColumn,
        },
        {
          field: 'exportErrorCsv',
          headerName: 'Errors file',
          flex: 1,
          renderCell: renderExportCsvColumn,
        },
      ];

      it('returns the default columns when FF is false', () => {
        expect(getColumns(IMPORT_TYPES.GrowthAndMaturation)).toEqual(
          defaultColumns
        );
      });

      it('returns the default columns when FF is true but import type is not in IMPORT_TYPES_WITH_DELETE', () => {
        window.setFlag(
          'cap-training-variable-importer-delete-imported-file',
          true
        );
        expect(getColumns('something_else')).toEqual(defaultColumns);
      });

      it('returns all columns when FF is true but import type is in IMPORT_TYPES_WITH_DELETE', () => {
        window.setFlag(
          'cap-training-variable-importer-delete-imported-file',
          true
        );

        expect(getColumns(IMPORT_TYPES_WITH_DELETE[0])).toEqual([
          ...defaultColumns,
          {
            field: 'deleteImport',
            flex: 1,
            type: 'actions',
            renderCell: renderDeleteImportCell,
          },
        ]);
      });
    });
  });
});
