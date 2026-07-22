// @vitest-environment jsdom
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { MemoryRouter } from 'react-router-dom';
import Design4 from '../Design4';
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

vi.mock('../../../components/sensitivities/Allergies', () => ({
  default: () => <div data-testid="allergies" />
}));

vi.mock('../../../components/buttons/FavoriteHeart', () => ({
  default: () => <div data-testid="favorite-heart" />
}));

const mockRestaurant = {
  _id: 'rest1',
  displayName: 'My Restaurant'
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
          name: 'גולדסטאר',
          nameEn: 'Goldstar',
          description: 'בירה ישראלית',
          price: 25,
          img: 'goldstar.jpg',
          hide: false
        }
      ]
    }
  ]
};

describe('Design4 Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <Design4 menu={{ _id: 'rest1', restaurantName: 'myrest' }} />
      </MemoryRouter>
    );
  };

  it('renders nested sub-categories as flat structure gracefully, keeping images and likes', async () => {
    fetchRestaurant.mockResolvedValueOnce(mockRestaurant);
    fetchCategoriesAndDishes.mockResolvedValueOnce({
      categories: mockCategories,
      dishes: mockNestedDishes
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('My Restaurant')).toBeInTheDocument();
    });

    // Check category tab
    expect(screen.getByText('בירות')).toBeInTheDocument();

    // Check dish inside sub-category is flattened
    expect(screen.getByText('גולדסטאר')).toBeInTheDocument();
    expect(screen.getByText('בירה ישראלית')).toBeInTheDocument();
    expect(screen.getByText('₪ 25')).toBeInTheDocument();
    
    // Check if image and heart are rendered (they should be, as capabilities are true)
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'goldstar.jpg');
    expect(screen.getByTestId('favorite-heart')).toBeInTheDocument();
  });
});
