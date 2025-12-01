// @flow

// $FlowIssue[cannot-resolve-module] - flow can't find the types, similar to https://github.com/facebook/draft-js/issues/1974
import { Transaction, EditorState } from '@remirror/core-types';
// $FlowIssue[cannot-resolve-module] - flow can't find the types, similar to https://github.com/facebook/draft-js/issues/1974
import { CountExtension } from '@remirror/extension-count';

export const filterTransaction = (
  transaction: Transaction,
  state: EditorState,
  limit: number
) => {
  const count = new CountExtension();

  // Nothing has changed or no limit is defined. Ignore it.
  if (
    !transaction.docChanged ||
    limit === 0 ||
    limit === null ||
    limit === undefined
  ) {
    return true;
  }

  const oldSize = count.getCharacterCount(state);
  const newSize = count.getCharacterCount(transaction);

  // Everything is in the limit. Good.
  if (newSize <= limit) {
    return true;
  }

  // The limit has already been exceeded but will be reduced.
  if (oldSize > limit && newSize > limit && newSize <= oldSize) {
    return true;
  }

  // The limit has already been exceeded and will be increased further.
  if (oldSize > limit && newSize > limit && newSize > oldSize) {
    return false;
  }

  const isPaste = transaction.getMeta('paste');

  // Block all exceeding transactions that were not pasted.
  if (!isPaste) {
    return false;
  }

  // For pasted content, we try to remove the exceeding content.
  const pos = transaction.selection.$head.pos;
  const over = newSize - limit;
  const from = pos - over;
  const to = pos;

  // It’s probably a bad idea to mutate transactions within `filterTransaction`
  // but for now this is working fine.
  transaction.deleteRange(from, to);

  // In some situations, the limit will continue to be exceeded after trimming.
  // This happens e.g. when truncating within a complex node (e.g. table)
  // and ProseMirror has to close this node again.
  // If this is the case, we prevent the transaction completely.
  const updatedSize = count.getCharacterCount(transaction);

  if (updatedSize > limit) {
    return false;
  }

  return true;
};
