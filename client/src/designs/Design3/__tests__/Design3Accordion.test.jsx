// @vitest-environment jsdom
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import Design3Accordion from '../Design3Accordion';

expect.extend(matchers);

vi.mock('../../../context/LanguageContext', () => ({
  useLanguage: () => ({ language: 'he' })
}));

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
          hide: false
        }
      ]
    }
  ]
};

describe('Design3Accordion Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nested sub-categories as flat structure gracefully', () => {
    render(<Design3Accordion categories={mockCategories} dishes={mockNestedDishes} />);

    // Check category header
    const button = screen.getByText('בירות');
    expect(button).toBeInTheDocument();

    // Open the accordion
    fireEvent.click(button);

    // Check dish inside sub-category is flattened
    expect(screen.getByText('גולדסטאר')).toBeInTheDocument();
    expect(screen.getByText('בירה ישראלית')).toBeInTheDocument();
    expect(screen.getByText('₪ 25')).toBeInTheDocument();
  });
});
