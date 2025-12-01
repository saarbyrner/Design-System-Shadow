// @flow

// ... existing types ...

/**
 * Generic type for functions that update properties of an object type.
 * Ensures type safety by requiring the key to be a valid property of T
 * and the value to match the property's type.
 *
 * @example
 * type MyState = { name: string, age: number };
 * const updateState: StateUpdater<MyState> = (key, value) => {
 *   // key must be 'name' | 'age'
 *   // value must match the type of the property
 * };
 * updateState('name', 'John'); // ✅ Valid
 * updateState('age', 25);      // ✅ Valid
 * updateState('name', 25);     // ❌ Flow error
 * updateState('invalid', 'x'); // ❌ Flow error
 */
export type StateUpdater<T: Object> = <TKey: $Keys<T>>(
  key: TKey,
  value: $ElementType<T, TKey>
) => void;
