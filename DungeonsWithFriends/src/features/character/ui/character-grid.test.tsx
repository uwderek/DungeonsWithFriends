import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CharacterGrid } from './character-grid';

describe('CharacterGrid', () => {
  const mockCharacters = [
    { id: '1', name: 'Kaelith', race: 'Elf', class: 'Wizard', level: 5 },
    { id: '2', name: 'Thorin', race: 'Dwarf', class: 'Fighter', level: 4 },
  ];

  it('renders title and characters', () => {
    const { getByText } = render(
      <CharacterGrid title="Adventurers" characters={mockCharacters as any} />
    );

    expect(getByText('Adventurers')).toBeTruthy();
    expect(getByText('Kaelith')).toBeTruthy();
    expect(getByText('Thorin')).toBeTruthy();
  });

  it('calls onCharacterPress when a character is clicked', () => {
    const onCharacterPress = jest.fn();
    const { getByText } = render(
      <CharacterGrid characters={mockCharacters as any} onCharacterPress={onCharacterPress} />
    );

    fireEvent.press(getByText('Kaelith'));
    expect(onCharacterPress).toHaveBeenCalledWith('1');
  });

  it('falls back to console.log when onCharacterPress is not provided', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const { getByText } = render(
      <CharacterGrid characters={mockCharacters as any} />
    );

    fireEvent.press(getByText('Kaelith'));
    expect(consoleSpy).toHaveBeenCalledWith('Character clicked:', '1');
    consoleSpy.mockRestore();
  });
});
