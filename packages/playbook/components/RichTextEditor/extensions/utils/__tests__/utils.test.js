// $FlowIssue[cannot-resolve-module] - flow can't find the types, similar to https://github.com/facebook/draft-js/issues/1974
import { CountExtension } from '@remirror/extension-count';
import { filterTransaction } from '..';

jest.mock('@remirror/extension-count');

const mockTransactionValid = {
  doc: {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'd',
          },
        ],
      },
    ],
  },
  steps: [],
  docs: [],
  mapping: {
    maps: [],
    from: 0,
    to: 0,
  },
  curSelectionFor: 0,
  updated: 0,
  meta: {
    __state_override__: {},
  },
  time: 1704213756586,
  curSelection: {
    type: 'text',
    anchor: 2,
    head: 2,
  },
  storedMarks: null,
  docChanged: true,
  getMeta: () => false,
};

const mockTransactionInvalid = {
  doc: {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'ddsadsadsadsadsadsadsadsadsada',
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'ddsadsadsadsadsadsadsadsadsada',
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'ddsadsadsadsadsadsadsadsadsada',
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'ddsadsadsadsadsadsadsadsadsada',
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'ddsadsadsadsadsadsadsadsadsada',
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'ddsadsadsadsadsadsadsadsadsada',
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'ddsadsadsadsadsadsadsadsadsada',
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'ddsadsadsadsadsadsadsadsadsada',
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'dd',
          },
        ],
      },
    ],
  },
  steps: [],
  docs: [],
  mapping: {
    maps: [],
    from: 0,
    to: 0,
  },
  curSelectionFor: 0,
  updated: 0,
  meta: {
    __state_override__: {},
  },
  time: 1704213914171,
  curSelection: {
    type: 'text',
    anchor: 259,
    head: 259,
  },
  storedMarks: null,
  docChanged: true,
  getMeta: () => false,
};

const mockStateValid = {
  doc: {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'd',
          },
        ],
      },
    ],
  },
  selection: {
    type: 'text',
    anchor: 2,
    head: 2,
  },
};

const mockStateInvalid = {
  doc: {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'ddsadsadsadsadsadsadsadsadsada',
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'ddsadsadsadsadsadsadsadsadsada',
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'ddsadsadsadsadsadsadsadsadsada',
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'ddsadsadsadsadsadsadsadsadsada',
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'ddsadsadsadsadsadsadsadsadsada',
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'ddsadsadsadsadsadsadsadsadsada',
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'ddsadsadsadsadsadsadsadsadsada',
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'ddsadsadsadsadsadsadsadsadsada',
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'dd',
          },
        ],
      },
    ],
  },
  selection: {
    type: 'text',
    anchor: 259,
    head: 259,
  },
};

describe('filterTransaction', () => {
  it('returns the correct response when remaining characters > 0', () => {
    CountExtension.mockImplementation(() => ({
      getCharacterCount: (doc) => ('docChanged' in doc ? 11 : 10),
    }));

    const response = filterTransaction(
      mockTransactionValid,
      mockStateValid,
      250
    );

    expect(response).toEqual(true);
  });

  it('returns the correct response when remaining characters = 0', () => {
    CountExtension.mockImplementation(() => ({
      getCharacterCount: (doc) => ('docChanged' in doc ? 251 : 250),
    }));

    const response = filterTransaction(
      mockTransactionInvalid,
      mockStateInvalid,
      250
    );

    expect(response).toEqual(false);
  });
});
