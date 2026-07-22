// @vitest-environment jsdom
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Design1Dish from '../Design1Dish';
import axiosInstance from '../../../utils/baseUrl';
import { toggleLikeLocal, reportLikeToDB } from '../../../utils/likeList';

// Mock dependencies
vi.mock('../../../utils/baseUrl', () => ({
  default: {
    get: vi.fn()
  }
}));

vi.mock('../../../context/LanguageContext', () => ({
  useLanguage: () => ({ language: 'he' }),
  LanguageProvider: ({ children }) => <>{children}</>
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

vi.mock('../../../utils/likeList', () => ({
  toggleLikeLocal: vi.fn(),
  reportLikeToDB: vi.fn()
}));

const mockDishes = {
  category: "Pizzas",
  subCategories: [
    {
      name: "Classic",
      dishes: [
        {
          _id: 'dish1',
          name: 'פיצה מרגריטה',
          nameEn: 'Pizza Margherita',
          description: 'רוטב עגבניות ומוצרלה',
          descriptionEn: 'Tomato sauce and mozzarella',
          price: 55,
          img: 'pizza.jpg',
          hide: false,
          categoryNameEn: 'Pizzas'
        }
      ]
    },
    {
      name: "Hidden Category",
      dishes: [
        {
          _id: 'dish2',
          name: 'מנה מוסתרת',
          description: 'לא אמורה להופיע',
          price: 40,
          img: 'hidden.jpg',
          hide: true
        }
      ]
    }
  ]
};

describe('Design1Dish Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={['/testUser/testCategory/Pizzas']}>
        <Routes>
          <Route path="/:userId/:categoryId/:categoryName" element={<Design1Dish />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('fetches and renders the flat data structure correctly', async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: mockDishes });

    renderComponent();

    // Verify API call
    expect(axiosInstance.get).toHaveBeenCalledWith('/dish/getDish/testUser/testCategory');

    // Wait for the UI to update
    await waitFor(() => {
      expect(screen.getByText('פיצה מרגריטה')).toBeInTheDocument();
    });

    // Check that the dish properties are rendered
    expect(screen.getByText('רוטב עגבניות ומוצרלה')).toBeInTheDocument();
    expect(screen.getByText('55 ₪')).toBeInTheDocument();
    
    // Check that hidden dish is not rendered
    expect(screen.queryByText('מנה מוסתרת')).not.toBeInTheDocument();
  });

  it('handles the "like" clicks correctly', async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: mockDishes });

    renderComponent();

    // Wait for the dish to render and find the favorite heart button
    const heartButton = await screen.findByRole('button', { name: /add to favorites/i });
    expect(heartButton).toBeInTheDocument();

    // Click the like button
    fireEvent.click(heartButton);

    // Verify that the local like functionality was triggered immediately
    expect(toggleLikeLocal).toHaveBeenCalledWith('dish1');
    
    // The DB call is debounced by 500ms, so we wait for it
    await waitFor(() => {
      expect(reportLikeToDB).toHaveBeenCalledWith('dish1');
    }, { timeout: 1000 });
  });
});
