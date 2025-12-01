// @flow
import {
  extension,
  PlainExtension,
  CreateExtensionPlugin,
  // $FlowIssue[cannot-resolve-module] - flow can't find the types, similar to https://github.com/facebook/draft-js/issues/1974
} from '@remirror/core';
import { filterTransaction } from './utils';

export interface CharacterLimitOptions {
  limit?: number;
}

// This extension is inspired by: https://github.com/ueberdosis/tiptap/blob/main/packages/extension-character-count/src/character-count.ts
export class CharacterLimitExtension extends PlainExtension<CharacterLimitOptions> {
  get name() {
    return 'characterLimit';
  }

  createPlugin(): CreateExtensionPlugin {
    return {
      filterTransaction: (transaction, state) =>
        filterTransaction(transaction, state, this.options.limit),
    };
  }
}

extension({ defaultSettings: { limit: 65535 } })(CharacterLimitExtension);
