import React from 'react';
import { render } from '@testing-library/react-native';
import { CharacterCard } from './character-card';

// Mock BaseCard
jest.mock('@/shared/ui/atoms/base-card', () => ({
    BaseCard: ({ children }: any) => <>{children}</>,
}));

describe('CharacterCard', () => {
    it('renders character details', () => {
        const { getByText } = render(
            <CharacterCard
                name="Gimli"
                race="Dwarf"
                charClass="Warrior"
                level={10}
            />
        );
        expect(getByText('Gimli')).toBeTruthy();
        expect(getByText(/Level 10 Dwarf Warrior/i)).toBeTruthy();
    });
});
