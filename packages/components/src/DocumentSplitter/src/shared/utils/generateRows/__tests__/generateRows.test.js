import generateRows from '@kitman/components/src/DocumentSplitter/src/shared/utils/generateRows';
import { SPLIT_DOCUMENT_MODES } from '@kitman/components/src/DocumentSplitter/src/shared/consts';

describe('generateRows function', () => {
  describe('When a single player is selected', () => {
    const singlePlayerDocDetails = {
      fileName: 'file.pdf',
      documentDate: '2024-04-03T00:00:00+00:00',
      documentCategories: [{ id: 1, label: 'some category' }],
      associatedIssues: [],
      players: [{ id: 1, label: 'some player' }],
    };

    it('creates a single row for player when mode is SPLIT_DOCUMENT_MODES.intoSections', () => {
      const splitOptions = {
        splitDocument: SPLIT_DOCUMENT_MODES.intoSections,
        numberOfSections: 1,
        splitEvery: null,
        splitFrom: 1,
      };
      const totalPages = 10;
      const rows = generateRows(
        singlePlayerDocDetails,
        splitOptions,
        totalPages
      );

      expect(rows.length).toEqual(1);
      expect(rows[0]).toEqual({
        id: 1,
        pages: '1-10', // Player gets all the pages
        player: singlePlayerDocDetails.players[0],
        categories: singlePlayerDocDetails.documentCategories,
        associatedIssues: [],
        fileName: singlePlayerDocDetails.fileName,
        dateOfDocument: singlePlayerDocDetails.documentDate,
        hasConstraintsError: false,
      });
    });

    it('abides the splitFrom value when mode is SPLIT_DOCUMENT_MODES.intoSections', () => {
      const splitOptions = {
        splitDocument: SPLIT_DOCUMENT_MODES.intoSections,
        numberOfSections: 1,
        splitEvery: null,
        splitFrom: 5,
      };
      const totalPages = 10;
      const rows = generateRows(
        singlePlayerDocDetails,
        splitOptions,
        totalPages
      );

      expect(rows.length).toEqual(1);
      expect(rows[0]).toEqual({
        id: 1,
        pages: '5-10', // Player gets all the pages from page 5 ( inclusive )
        player: singlePlayerDocDetails.players[0],
        categories: singlePlayerDocDetails.documentCategories,
        associatedIssues: [],
        fileName: singlePlayerDocDetails.fileName,
        dateOfDocument: singlePlayerDocDetails.documentDate,
        hasConstraintsError: false,
      });
    });

    it('creates n rows for player when mode is SPLIT_DOCUMENT_MODES.intoSections', () => {
      const splitOptions = {
        splitDocument: SPLIT_DOCUMENT_MODES.intoSections,
        numberOfSections: 3,
        splitEvery: null,
        splitFrom: 1,
      };
      const totalPages = 12;
      const rows = generateRows(
        singlePlayerDocDetails,
        splitOptions,
        totalPages
      );
      expect(rows.length).toEqual(3);

      expect(rows[0]).toEqual({
        id: 1,
        pages: '1-4',
        player: singlePlayerDocDetails.players[0],
        categories: singlePlayerDocDetails.documentCategories,
        associatedIssues: [],
        fileName: singlePlayerDocDetails.fileName,
        dateOfDocument: singlePlayerDocDetails.documentDate,
        hasConstraintsError: false,
      });
      expect(rows[1]).toEqual({
        id: 2,
        pages: '5-8',
        player: singlePlayerDocDetails.players[0],
        categories: singlePlayerDocDetails.documentCategories,
        associatedIssues: [],
        fileName: singlePlayerDocDetails.fileName,
        dateOfDocument: singlePlayerDocDetails.documentDate,
        hasConstraintsError: false,
      });
      expect(rows[2]).toEqual({
        id: 3,
        pages: '9-12',
        player: singlePlayerDocDetails.players[0],
        categories: singlePlayerDocDetails.documentCategories,
        associatedIssues: [],
        fileName: singlePlayerDocDetails.fileName,
        dateOfDocument: singlePlayerDocDetails.documentDate,
        hasConstraintsError: false,
      });
    });

    it('creates n rows for player when mode is SPLIT_DOCUMENT_MODES.everyX', () => {
      const splitOptions = {
        splitDocument: SPLIT_DOCUMENT_MODES.everyX,
        numberOfSections: null,
        splitEvery: 3,
        splitFrom: 1,
      };
      const totalPages = 12; // 12 divide by 3 = 4. 4 rows with 3 pages per row
      const rows = generateRows(
        singlePlayerDocDetails,
        splitOptions,
        totalPages
      );
      expect(rows.length).toEqual(4);

      expect(rows[0]).toEqual({
        id: 1,
        pages: '1-3',
        player: singlePlayerDocDetails.players[0],
        categories: singlePlayerDocDetails.documentCategories,
        associatedIssues: [],
        fileName: singlePlayerDocDetails.fileName,
        dateOfDocument: singlePlayerDocDetails.documentDate,
        hasConstraintsError: false,
      });
      expect(rows[1]).toEqual({
        id: 2,
        pages: '4-6',
        player: singlePlayerDocDetails.players[0],
        categories: singlePlayerDocDetails.documentCategories,
        associatedIssues: [],
        fileName: singlePlayerDocDetails.fileName,
        dateOfDocument: singlePlayerDocDetails.documentDate,
        hasConstraintsError: false,
      });
      expect(rows[2]).toEqual({
        id: 3,
        pages: '7-9',
        player: singlePlayerDocDetails.players[0],
        categories: singlePlayerDocDetails.documentCategories,
        associatedIssues: [],
        fileName: singlePlayerDocDetails.fileName,
        dateOfDocument: singlePlayerDocDetails.documentDate,
        hasConstraintsError: false,
      });
      expect(rows[3]).toEqual({
        id: 4,
        pages: '10-12',
        player: singlePlayerDocDetails.players[0],
        categories: singlePlayerDocDetails.documentCategories,
        associatedIssues: [],
        fileName: singlePlayerDocDetails.fileName,
        dateOfDocument: singlePlayerDocDetails.documentDate,
        hasConstraintsError: false,
      });
    });

    it('abides the splitFrom value when mode is SPLIT_DOCUMENT_MODES.everyX with from page', () => {
      const splitOptions = {
        splitDocument: SPLIT_DOCUMENT_MODES.everyX,
        numberOfSections: null,
        splitEvery: 5,
        splitFrom: 3, // inclusive
      };
      const totalPages = 12; // Starting from page 3 we get 2 rows with 5 pages each
      const rows = generateRows(
        singlePlayerDocDetails,
        splitOptions,
        totalPages
      );
      expect(rows.length).toEqual(2);

      expect(rows[0]).toEqual({
        id: 1,
        pages: '3-7',
        player: singlePlayerDocDetails.players[0],
        categories: singlePlayerDocDetails.documentCategories,
        associatedIssues: [],
        fileName: singlePlayerDocDetails.fileName,
        dateOfDocument: singlePlayerDocDetails.documentDate,
        hasConstraintsError: false,
      });
      expect(rows[1]).toEqual({
        id: 2,
        pages: '8-12',
        player: singlePlayerDocDetails.players[0],
        categories: singlePlayerDocDetails.documentCategories,
        associatedIssues: [],
        fileName: singlePlayerDocDetails.fileName,
        dateOfDocument: singlePlayerDocDetails.documentDate,
        hasConstraintsError: false,
      });
    });
  });

  describe('When multiple players are selected', () => {
    const multiplePlayers = {
      fileName: 'file.pdf',
      documentDate: '2024-04-03T00:00:00+00:00',
      documentCategories: [{ id: 1, label: 'some category' }],
      players: [
        { id: 1, label: 'some player' },
        { id: 2, label: 'some other player' },
      ],
    };

    it('creates a row per player when mode is SPLIT_DOCUMENT_MODES.intoSections', () => {
      const splitOptions = {
        splitDocument: SPLIT_DOCUMENT_MODES.intoSections,
        numberOfSections: 2, // Here the number matches the number of players
        splitEvery: null,
        splitFrom: 1,
      };
      const totalPages = 8;
      const rows = generateRows(multiplePlayers, splitOptions, totalPages);
      expect(rows.length).toEqual(2);

      expect(rows[0]).toEqual({
        id: 1,
        pages: '1-4',
        player: multiplePlayers.players[0],
        categories: multiplePlayers.documentCategories,
        associatedIssues: [],
        fileName: multiplePlayers.fileName,
        dateOfDocument: multiplePlayers.documentDate,
        hasConstraintsError: false,
      });
      expect(rows[1]).toEqual({
        id: 2,
        pages: '5-8',
        player: multiplePlayers.players[1],
        categories: multiplePlayers.documentCategories,
        associatedIssues: [],
        fileName: multiplePlayers.fileName,
        dateOfDocument: multiplePlayers.documentDate,
        hasConstraintsError: false,
      });
    });

    it('assigns any remaining rows to the last player when mode is SPLIT_DOCUMENT_MODES.intoSections', () => {
      const splitOptions = {
        splitDocument: SPLIT_DOCUMENT_MODES.intoSections,
        numberOfSections: 3, // Here the number exceeds the number of players
        splitEvery: null,
        splitFrom: 1,
      };
      const totalPages = 12;
      const rows = generateRows(multiplePlayers, splitOptions, totalPages);
      expect(rows.length).toEqual(3); // numberOfSections is respected

      expect(rows[0]).toEqual({
        id: 1,
        pages: '1-4',
        player: multiplePlayers.players[0],
        categories: multiplePlayers.documentCategories,
        associatedIssues: [],
        fileName: multiplePlayers.fileName,
        dateOfDocument: multiplePlayers.documentDate,
        hasConstraintsError: false,
      });
      expect(rows[1]).toEqual({
        id: 2,
        pages: '5-8',
        player: multiplePlayers.players[1],
        categories: multiplePlayers.documentCategories,
        associatedIssues: [],
        fileName: multiplePlayers.fileName,
        dateOfDocument: multiplePlayers.documentDate,
        hasConstraintsError: false,
      });
      expect(rows[2]).toEqual({
        id: 3,
        pages: '9-12',
        player: multiplePlayers.players[1],
        categories: multiplePlayers.documentCategories,
        associatedIssues: [],
        fileName: multiplePlayers.fileName,
        dateOfDocument: multiplePlayers.documentDate,
        hasConstraintsError: false,
      });
    });

    // TODO: Additional test on everyX
  });
});
