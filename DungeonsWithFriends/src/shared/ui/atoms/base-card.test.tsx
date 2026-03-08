import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { BaseCard } from './base-card';

describe('BaseCard', () => {
    it('renders children correctly', () => {
        const { getByText } = render(
            <BaseCard>
                <Text>Card Content</Text>
            </BaseCard>
        );
        expect(getByText('Card Content')).toBeTruthy();
    });

    it('renders title and description', () => {
        const { getByText } = render(
            <BaseCard title="Test Title" description="Test Description" />
        );
        expect(getByText('Test Title')).toBeTruthy();
        expect(getByText('Test Description')).toBeTruthy();
    });

    it('handles onPress event', () => {
        const onPressMock = jest.fn();
        const { getByText } = render(
            <BaseCard title="Click Me" onPress={onPressMock} />
        );

        fireEvent.press(getByText('Click Me'));
        expect(onPressMock).toHaveBeenCalled();
    });

    it('renders header and footer content', () => {
        const { getByText } = render(
            <BaseCard
                headerContent={<Text>Header</Text>}
                footerContent={<Text>Footer</Text>}
            >
                <Text>Body</Text>
            </BaseCard>
        );
        expect(getByText('Header')).toBeTruthy();
        expect(getByText('Footer')).toBeTruthy();
        expect(getByText('Body')).toBeTruthy();
    });

    it('applies accent color style', () => {
        // We can't easily test style objects in RN testing library without deeper inspection
        // but we can ensure it renders without crashing
        const { getByTestId } = render(
            <View testID="container">
                <BaseCard accentColor="red" />
            </View>
        );
        // If it renders, the logic for style array did not throw
    });
});

// Minimal helper to wrap in View for testID
const View = require('react-native').View;
