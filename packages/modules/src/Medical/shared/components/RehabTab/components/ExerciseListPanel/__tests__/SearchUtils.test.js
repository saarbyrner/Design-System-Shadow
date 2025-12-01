import filterFavourites from '../searchUtils';

describe('filterFavourites', () => {
  it('Correctly filters values when searching in starts with search mode', () => {
    expect(
      filterFavourites(
        '4 Way Ankle',
        '3 Way Ankle',
        'starts_with'
      ) /* 1). search term 2). favourite 3). search mode */
    ).toEqual(false);

    expect(filterFavourites('3 Way', '3 Way Ankle', 'starts_with')).toEqual(
      true
    );
  });

  it('Correctly filters values when searching in contains search mode', () => {
    expect(
      filterFavourites(
        '4 Way Ankle',
        '3 Way Ankle',
        'contains'
      ) /* 1). search term 2). favourite 3). search mode */
    ).toEqual(true);

    expect(
      filterFavourites('4 Way Ankle', '3 wayward stankle drops', 'contains')
    ).toEqual(true);

    expect(
      filterFavourites('4 Way Ankle', '12345 hip-way trust', 'contains')
    ).toEqual(false);

    expect(filterFavourites('3 Way', '3 trust flies', 'contains')).toEqual(
      false
    );
  });
});
