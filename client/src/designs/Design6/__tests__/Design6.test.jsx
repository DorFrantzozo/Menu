// @vitest-environment jsdom
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { MemoryRouter } from 'react-router-dom';
import Design6 from '../Design6';
import { fetchRestaurant, fetchCategoriesAndDishes } from '../../../utils/fetchData';

expect.extend(matchers);

// Mock dependencies
vi.mock('../../../utils/fetchData', () => ({
  fetchRestaurant: vi.fn(),
  fetchCategoriesAndDishes: vi.fn(),
  getRestaurantName: () => 'myrest',
  recordMenuView: vi.fn()
}));

vi.mock('../../../context/LanguageContext', () => ({
  useLanguage: () => ({ language: 'he' })
}));

vi.mock('../../../components/LanguageSelector/FloatingLanguageSelector', () => ({
  default: () => <div data-testid="floating-language-selector" />
}));

vi.mock('react-toastify', () => ({
  toast: { error: vi.fn() }
}));

// Mock FoodCard to simplify testing
vi.mock('../components/FoodCard', () => ({
  default: ({ dish }) => (
    <div data-testid="food-card">
      <span>{dish.name}</span>
      <span>{dish.description}</span>
      <span>₪ {dish.price}</span>
      {dish.img && <img src={dish.img} alt={dish.name} />}
    </div>
  )
}));

// Mock CategoryFilter
vi.mock('../components/CategoryFilter', () => ({
  default: ({ categories }) => (
    <div data-testid="category-filter">
      {categories.map(c => <span key={c._id}>{c.name}</span>)}
    </div>
  )
}));

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
global.IntersectionObserver = class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

const mockRestaurant = {
  _id: 'rest1',
  displayName: 'My Restaurant Design 6'
};

const mockCategories = [
  { _id: 'cat1', name: 'בירות', nameEn: 'Beers', hide: false, locationNumber: 1 }
];

const mockNestedDishes = {
  cat1: [
    {
      name: "IPA",
      dishes: [
        {
          _id: 'dish1',
          name: 'גולדסטאר 6',
          nameEn: 'Goldstar 6',
          description: 'בירה 6',
          price: 25,
          img: 'goldstar6.jpg',
          hide: false
        }
      ]
    }
  ]
};

describe('Design6 Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <Design6 menu={{ _id: 'rest1', restaurantName: 'myrest' }} />
      </MemoryRouter>
    );
  };

  it('renders nested sub-categories as flat structure gracefully', async () => {
    fetchRestaurant.mockResolvedValueOnce(mockRestaurant);
    fetchCategoriesAndDishes.mockResolvedValueOnce({
      categories: mockCategories,
      dishes: mockNestedDishes
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('myrest')).toBeInTheDocument();
    });

    // Check category tab
    expect(screen.getAllByText('בירות')[0]).toBeInTheDocument();

    // Check dish inside sub-category is flattened and rendered by the mock card
    expect(screen.getByText('גולדסטאר 6')).toBeInTheDocument();
    expect(screen.getByText('בירה 6')).toBeInTheDocument();
    expect(screen.getByText('₪ 25')).toBeInTheDocument();
  });
});
