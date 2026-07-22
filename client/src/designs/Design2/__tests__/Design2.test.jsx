// @vitest-environment jsdom
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { MemoryRouter } from 'react-router-dom';
import Design2 from '../Design2';
import axiosInstance from '../../../utils/baseUrl';
import { fetchCategoriesAndDishes } from '../../../utils/fetchData';

expect.extend(matchers);

// Mock dependencies
vi.mock('../../../utils/baseUrl', () => ({
  default: {
    get: vi.fn()
  }
}));

vi.mock('../../../utils/fetchData', () => ({
  fetchCategoriesAndDishes: vi.fn(),
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

vi.mock('../../../components/sensitivities/IconDescription', () => ({
  default: () => <div data-testid="icon-description" />
}));

const mockRestaurant = {
  _id: 'rest1',
  displayName: 'My Elegant Restaurant',
  restaurantName: 'elegant'
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
          name: 'גולדסטאר IPA',
          nameEn: 'Goldstar IPA',
          description: 'בירה ישראלית מרירה',
          price: 25,
          hide: false
        }
      ]
    },
    {
      _id: 'dish2',
      name: 'קוקטייל הבית',
      description: 'ללא תת-קטגוריה',
      price: 45,
      hide: false
    }
  ]
};

describe('Design2 Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <Design2 menu={{ _id: 'rest1', restaurantName: 'elegant' }} />
      </MemoryRouter>
    );
  };

  it('renders nested sub-categories and flat dishes correctly based on config', async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: mockRestaurant });
    fetchCategoriesAndDishes.mockResolvedValueOnce({
      categories: mockCategories,
      dishes: mockNestedDishes
    });

    renderComponent();

    // Verify restaurant API call
    expect(axiosInstance.get).toHaveBeenCalledWith('/user/find?name=elegant');

    // Wait for the UI to update
    await waitFor(() => {
      expect(screen.getByText('My Elegant Restaurant')).toBeInTheDocument();
    });

    // Check category header
    expect(screen.getByText('בירות')).toBeInTheDocument();

    // Check sub-category header
    expect(screen.getByText('IPA')).toBeInTheDocument();

    // Check dish inside sub-category
    expect(screen.getByText('גולדסטאר IPA')).toBeInTheDocument();
    expect(screen.getByText('25₪')).toBeInTheDocument();

    // Check flat dish
    expect(screen.getByText('קוקטייל הבית')).toBeInTheDocument();
  });
});
