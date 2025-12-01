// @flow
import { useState, useCallback, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { withNamespaces } from 'react-i18next';
import { DropdownWrapper } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { getDirectMessageChannelUniqueName } from '../utils';
import ChannelAvatar from './ChannelAvatar';
import type {
  ChatChannel,
  SearchableItem,
  SearchableItemGroups,
  UserRole,
} from '../types';

type Props = {
  searchableItemGroups: SearchableItemGroups,
  maxDisplayableResults: number,
  directChannels: Array<ChatChannel>,
  userRole: UserRole,
  // Callbacks
  onSwitchedChannel: Function,
  onDirectMessageUser: Function,
};

const ChatChannelSearch = (props: I18nProps<Props>) => {
  const [userSearchInput, setUserSearchInput] = useState<string>(''); // This is the live state of the input field value
  const [searchTerm, setSearchTerm] = useState<string>(''); // This input field value lowercased and trimmed at the start
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>(''); // This is the debounced value of above searchTerm to slow triggering of search
  const [debouncedResults, setDebouncedResults] = useState<
    Array<SearchableItem>
  >([]); // The search results for the current debouncedSearchTerm value capped in length to maxDisplayableResults
  const [matchesCount, setMatchesCount] = useState<number>(0); // How may matches for the debouncedSearchTerm are there ( can be > than maxDisplayableResults)

  // Flatten things we can search into order we want results to display in and memorize it
  // Having this here will make any user driven filtering easier (radio buttons to pick if they are searching for staff or athletes etc)
  const memoedFlatSearchableItems = useMemo(
    () => [
      ...props.searchableItemGroups.staff,
      ...props.searchableItemGroups.athletes,
      ...props.searchableItemGroups.userChannels,
    ],
    [props.searchableItemGroups] // Will only recalc when props.searchableItemGroups changes
  );

  const filterSearchableItems = (term: string): Array<SearchableItem> => {
    if (term === '') {
      setMatchesCount(0);
      return [];
    }
    const termWords = term.split(' ');
    const filtered = memoedFlatSearchableItems.filter((searchableItem) => {
      let wordsMatched = 0;

      for (let i = 0; i < termWords.length; i++) {
        if (
          searchableItem.split_searchable_values.find((element) =>
            element.startsWith(termWords[i])
          ) !== undefined
        ) {
          wordsMatched += 1;
        } else {
          break;
        }
      }
      return wordsMatched === termWords.length;
    });
    setMatchesCount(filtered.length);
    if (filtered.length > props.maxDisplayableResults) {
      return filtered.slice(0, props.maxDisplayableResults);
    }
    return filtered;
  };

  const debouncer = useCallback(
    debounce((term: string) => {
      setDebouncedSearchTerm(term);
      setDebouncedResults(filterSearchableItems(term));
    }, 800),
    [] // will only be created once
  );

  const updateSearchTerm = (term: string) => {
    setSearchTerm(term);
    debouncer(term);
  };

  const onResultClicked = (result: SearchableItem) => {
    if (result.result_type === 'channel') {
      props.onSwitchedChannel(result.identifier);
    } else {
      // Otherwise we are looking for a DM channel and should create if does not exist
      const directMessageUniqueName = getDirectMessageChannelUniqueName(
        props.userRole.identity,
        result.identifier
      );
      const existingDirectMessageChannel = props.directChannels.find(
        (channel) => channel.uniqueName === directMessageUniqueName
      );
      if (existingDirectMessageChannel) {
        props.onSwitchedChannel(existingDirectMessageChannel.sid);
      } else if (props.userRole.permissions.canCreateDirectChannel) {
        props.onDirectMessageUser(
          result.identifier,
          result.user_id.toString(),
          result.result_type,
          result.display_name
        );
      } // Else do nothing for now
    }
  };

  const displayCachedSearchResults = () => {
    if (searchTerm === '') {
      return (
        <div className="chatChannelSearch__suggestions">
          {props.t('Search for a channel to join')}
        </div>
      );
    }

    // Mask the initial delay from typing first character to the debounce catching up
    if (debouncedSearchTerm !== searchTerm && debouncedSearchTerm === '') {
      return (
        <div className="chatChannelSearch__searching">
          <span>{props.t('Searching ...')}</span>
        </div>
      );
    }

    if (!debouncedResults || debouncedResults.length < 1) {
      return (
        <div className="chatChannelSearch__noResult">
          <span>{props.t('No results found')}</span>
        </div>
      );
    }

    return debouncedResults.map((result: SearchableItem) => {
      let fullDisplayName;
      let channelType = 'private';
      switch (result.result_type) {
        case 'staff':
          channelType = 'direct';
          fullDisplayName = `${result.display_name} : ${props.t('Staff')}`;
          break;
        case 'athlete':
          channelType = 'direct';
          if (result.groups && result.groups.length > 0) {
            fullDisplayName = `${result.display_name} (${result.groups
              .map((g) => g.name)
              .join(', ')})`;
            break;
          }
          fullDisplayName = result.display_name;
          break;
        default:
          fullDisplayName = result.display_name;
      }
      return (
        <div
          key={`${result.result_type}_${result.identifier}`}
          className={`chatChannelSearch__result chatChannelSearch__result--${result.result_type}`}
          onClick={() => {
            onResultClicked(result);
          }}
        >
          <ChannelAvatar
            channelFriendlyName={result.display_name}
            url={result.avatar_url || ''}
            size="SMALL"
            channelType={channelType}
          />
          {fullDisplayName}
        </div>
      );
    });
  };

  return (
    <div className="chatChannelSearch">
      <div className="chatChannelSearch__label">{props.t('New Message:')}</div>
      <div className="chatChannelSearch__input">
        <DropdownWrapper
          hasSearch
          showDropdownButton={false}
          searchTerm={userSearchInput}
          onTypeSearchTerm={(term) => {
            setUserSearchInput(term);
            updateSearchTerm(term.trimStart().toLowerCase()); // Term can't start with whitespace
          }}
        >
          <div className="chatChannelSearch__results">
            {displayCachedSearchResults()}
            {userSearchInput !== '' &&
              matchesCount > props.maxDisplayableResults && (
                <div className="chatChannelSearch__resultsCount">{`${(
                  matchesCount - props.maxDisplayableResults
                ).toString()} ${props.t('other matches')}`}</div>
              )}
          </div>
        </DropdownWrapper>
      </div>
    </div>
  );
};

export const ChatChannelSearchTranslated = withNamespaces()(ChatChannelSearch);
export default ChatChannelSearch;
