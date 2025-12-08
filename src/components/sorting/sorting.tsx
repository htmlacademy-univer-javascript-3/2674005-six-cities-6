import React, { useState } from 'react';

export enum SortType {
  Popular = 'Popular',
  PriceLowToHigh = 'Price: low to high',
  PriceHighToLow = 'Price: high to low',
  TopRatedFirst = 'Top rated first'
}

type SortingProps = {
  currentSort: SortType;
  onSortChange: (sort: SortType) => void;
};

function Sorting({ currentSort, onSortChange }: SortingProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const handleSortClick = (sort: SortType) => {
    onSortChange(sort);
    setIsOpen(false);
  };

  return (
    <form className="places__sorting" action="#" method="get">
      <span className="places__sorting-caption">Sort by</span>
      <span
        className="places__sorting-type"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsOpen(!isOpen);
          }
        }}
      >
        {currentSort}
        <svg className="places__sorting-arrow" width="7" height="4">
          <use xlinkHref="#icon-arrow-select"></use>
        </svg>
      </span>
      {isOpen && (
        <ul className="places__options places__options--custom places__options--opened">
          {Object.values(SortType).map((sort) => (
            <li
              key={sort}
              className={`places__option ${sort === currentSort ? 'places__option--active' : ''}`}
              tabIndex={0}
              onClick={() => handleSortClick(sort)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleSortClick(sort);
                }
              }}
            >
              {sort}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}

export default Sorting;
