// @vitest-environment jsdom
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { MemoryRouter } from 'react-router-dom';
import Design5 from '../Design5';
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

vi.mock('../../../utils/cloudinaryUrl', () => ({
  toWebP: (url) => url
}));

// Mock DishCardDesign5 to avoid complex rendering inside the grid
vi.mock('../DishCardDesign5', () => ({
  default: ({ dish }) => (
    <div data-testid="dish-card">
      <span>{dish.name}</span>
      <span>{dish.description}</span>
      <span>₪ {dish.price}</span>
      {dish.img && <img src={dish.img} alt={dish.name} />}
    </div>
  )
}));

const mockRestaurant = {
  _id: 'rest1',
  displayName: 'My Restaurant Design 5'
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
          name: 'גולדסטאר 5',
          nameEn: 'Goldstar 5',
          description: 'בירה 5',
          price: 25,
          img: 'goldstar5.jpg',
          hide: false
        }
      ]
    }
  ]
};

describe('Design5 Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <Design5 menu={{ _id: 'rest1', restaurantName: 'myrest' }} />
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
      expect(screen.getByText('My Restaurant Design 5')).toBeInTheDocument();
    });

    // Check category tab
    expect(screen.getAllByText('בירות')[0]).toBeInTheDocument();

    // Check dish inside sub-category is flattened and rendered by the mock card
    expect(screen.getByText('גולדסטאר 5')).toBeInTheDocument();
    expect(screen.getByText('בירה 5')).toBeInTheDocument();
    expect(screen.getByText('₪ 25')).toBeInTheDocument();
  });
});
