import React from 'react';
import { render } from '@testing-library/react-native';
import { StoryCard } from './story-card';

// Mock BaseCard
jest.mock('@/shared/ui/atoms/base-card', () => {
    const { Text } = require('react-native');
    const React = require('react');
    return {
        BaseCard: ({ title, children, headerContent }: any) => (
            <>
                {title && <Text>{title}</Text>}
                {children}
                {headerContent}
            </>
        ),
    };
});

describe('StoryCard', () => {
    it('renders story content', () => {
        const { getByText } = render(
            <StoryCard
                title="Story Title"
                excerpt="Once upon a time..."
                date="Oct 20"
            />
        );
        expect(getByText('Story Title')).toBeTruthy();
        expect(getByText(/"Once upon a time..."/i)).toBeTruthy();
        expect(getByText('Oct 20')).toBeTruthy();
    });
});
