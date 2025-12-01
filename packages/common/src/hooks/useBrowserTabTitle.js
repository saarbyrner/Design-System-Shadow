// @flow
import { useEffect } from 'react';

import { browserHistory } from '@kitman/common/src/variables';

const { defaultTitle } = browserHistory;

// useBrowserTabTitle is a hook for setting the document’s title
// (document.title). title can be either a string or an array of strings which
// will be concatenated and separated by vertical bars. The array option is to
// provide the possibilty of adding context to the title (see examples). When a
// component unmounts, the hook sets the title back to the default one. The
// hook doesn’t translate passed strings.
//
// Examples:
//
// useBrowserTabTitle(props.t('Title')) // ‘Title’
//
// useBrowserTabTitle([props.t('Title')]) // ‘Title’
//
// useBrowserTabTitle([   // ‘Area | Sub-Area | Title’
//   props.t('Area'),     //
//   props.t('Sub-Area'), //
//   props.t('Title'),    //
// ])
export default <T: ?(string | Array<?string>)>(title: T): T => {
  useEffect(() => {
    let newTitle: ?string;
    if (
      Array.isArray(title) &&
      title.every((part) => typeof part === 'string')
    ) {
      newTitle = title.filter((part) => part !== '').join(' | ');
    } else if (typeof title === 'string') {
      newTitle = title;
    }
    document.title = newTitle || defaultTitle;
    return () => {
      document.title = defaultTitle;
    };
  }, [title]);
  return title;
};
