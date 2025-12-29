import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Sorting, { SortType } from './sorting';

describe('Sorting Component', () => {
  it('should render current sort type', () => {
    const handleSortChange = vi.fn();

    render(<Sorting currentSort={SortType.Popular} onSortChange={handleSortChange} />);

    expect(screen.getByText(SortType.Popular)).toBeInTheDocument();
  });

  it('should not show options list initially', () => {
    const handleSortChange = vi.fn();

    render(<Sorting currentSort={SortType.Popular} onSortChange={handleSortChange} />);

    const optionsList = screen.queryByRole('list');
    expect(optionsList).not.toBeInTheDocument();
  });

  it('should show options list when clicking on sort type', async () => {
    const user = userEvent.setup();
    const handleSortChange = vi.fn();

    render(<Sorting currentSort={SortType.Popular} onSortChange={handleSortChange} />);

    const sortTypeButton = screen.getByText(SortType.Popular);
    await user.click(sortTypeButton);

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
  });

  it('should highlight active sort option', async () => {
    const user = userEvent.setup();
    const handleSortChange = vi.fn();

    render(<Sorting currentSort={SortType.TopRatedFirst} onSortChange={handleSortChange} />);

    const sortTypeButton = screen.getByText(SortType.TopRatedFirst);
    await user.click(sortTypeButton);

    const activeOption = screen.getByText(SortType.TopRatedFirst, { selector: '.places__option' });
    expect(activeOption).toHaveClass('places__option--active');
  });

  it('should call onSortChange when selecting a sort option', async () => {
    const user = userEvent.setup();
    const handleSortChange = vi.fn();

    render(<Sorting currentSort={SortType.Popular} onSortChange={handleSortChange} />);

    const sortTypeButton = screen.getByText(SortType.Popular);
    await user.click(sortTypeButton);

    const priceOption = screen.getByText(SortType.PriceLowToHigh);
    await user.click(priceOption);

    expect(handleSortChange).toHaveBeenCalledWith(SortType.PriceLowToHigh);
    expect(handleSortChange).toHaveBeenCalledTimes(1);
  });

  it('should close options list after selecting an option', async () => {
    const user = userEvent.setup();
    const handleSortChange = vi.fn();

    render(<Sorting currentSort={SortType.Popular} onSortChange={handleSortChange} />);

    const sortTypeButton = screen.getByText(SortType.Popular);
    await user.click(sortTypeButton);
    
    expect(screen.getByRole('list')).toBeInTheDocument();

    const priceOption = screen.getByText(SortType.PriceHighToLow);
    await user.click(priceOption);

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('should toggle options list when clicking on sort type multiple times', async () => {
    const user = userEvent.setup();
    const handleSortChange = vi.fn();

    render(<Sorting currentSort={SortType.Popular} onSortChange={handleSortChange} />);

    const sortTypeButton = screen.getByText(SortType.Popular);
    
    await user.click(sortTypeButton);
    expect(screen.getByRole('list')).toBeInTheDocument();

    await user.click(sortTypeButton);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('should open options list when pressing Enter key', async () => {
    const user = userEvent.setup();
    const handleSortChange = vi.fn();

    render(<Sorting currentSort={SortType.Popular} onSortChange={handleSortChange} />);

    const sortTypeButton = screen.getByText(SortType.Popular);
    sortTypeButton.focus();
    await user.keyboard('{Enter}');

    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('should select option when pressing Enter key on it', async () => {
    const user = userEvent.setup();
    const handleSortChange = vi.fn();

    render(<Sorting currentSort={SortType.Popular} onSortChange={handleSortChange} />);

    const sortTypeButton = screen.getByText(SortType.Popular);
    await user.click(sortTypeButton);

    const option = screen.getByText(SortType.PriceLowToHigh);
    option.focus();
    await user.keyboard('{Enter}');

    expect(handleSortChange).toHaveBeenCalledWith(SortType.PriceLowToHigh);
  });

  it('should render all sort types in options list', async () => {
    const user = userEvent.setup();
    const handleSortChange = vi.fn();

    render(<Sorting currentSort={SortType.Popular} onSortChange={handleSortChange} />);

    const sortTypeButton = screen.getByText(SortType.Popular);
    await user.click(sortTypeButton);

    expect(screen.getByText(SortType.Popular, { selector: '.places__option' })).toBeInTheDocument();
    expect(screen.getByText(SortType.PriceLowToHigh)).toBeInTheDocument();
    expect(screen.getByText(SortType.PriceHighToLow)).toBeInTheDocument();
    expect(screen.getByText(SortType.TopRatedFirst)).toBeInTheDocument();
  });
});
