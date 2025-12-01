// @flow
import moment from 'moment';

function store(storage: Object, key: string, data: Object, timeout = null) {
  const expiration = timeout && moment().add(timeout, 'seconds').format();
  storage.setItem(key, JSON.stringify({ data, expiration }));
}

function retrieve(storage, key, data) {
  if (typeof key === 'string') {
    try {
      // $FlowFixMe -- key will always be a string as per line #14
      const item = JSON.parse(storage.getItem(key));
      const expired =
        !!item.expiration && moment(item.expiration).isBefore(moment());
      if (expired) {
        storage.removeItem(key);
        return data;
      }
      return item.data || data;
    } catch (err) {
      return data;
    }
  }
  return data;
}

export function localStore(
  key: string,
  data: Object,
  timeout: number | null = null
) {
  store(localStorage, key, data, timeout);
}

export function localRetrieve(key: string, data: Object = null) {
  return retrieve(localStorage, key, data);
}
