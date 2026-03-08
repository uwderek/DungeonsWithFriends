import React from 'react';
import { render } from '@testing-library/react-native';
import { SkeletonCard } from './skeleton-card';

describe('SkeletonCard', () => {
    it('renders correctly', () => {
        const { getByTestId, toJSON } = render(<SkeletonCard />);
        expect(toJSON()).toBeTruthy();
    });
});
