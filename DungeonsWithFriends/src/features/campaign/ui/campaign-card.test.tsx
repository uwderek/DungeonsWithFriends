import React from 'react';
import { render } from '@testing-library/react-native';
import { CampaignCard } from './campaign-card';

// Mock BaseCard to isolate unit test
jest.mock('@/shared/ui/atoms/base-card', () => {
    const { Text } = require('react-native');
    const React = require('react');
    return {
        BaseCard: ({ title, description, children, footerContent }: any) => (
            <>
                {title && <Text>{title}</Text>}
                {description && <Text>{description}</Text>}
                {children}
                {footerContent}
            </>
        ),
    };
});

describe('CampaignCard', () => {
    it('renders title and description via BaseCard', () => {
        const { getByText } = render(
            <CampaignCard title="Campaign Title" description="Campaign Description" />
        );
        expect(getByText('Campaign Title')).toBeTruthy();
        expect(getByText('Campaign Description')).toBeTruthy();
    });

    it('renders next session in footer', () => {
        const { getByText } = render(
            <CampaignCard
                title="Title"
                description="Desc"
                nextSession="Next Friday"
            />
        );
        expect(getByText(/Next Session/i)).toBeTruthy();
        expect(getByText('Next Friday')).toBeTruthy();
    });
});
