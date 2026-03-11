import React from 'react';
import { render } from '@testing-library/react-native';
import { StatusBadge, StatusType } from './status-badge';

describe('StatusBadge', () => {
  it('renders correctly for active status', () => {
    const { getByText } = render(<StatusBadge status="active" />);
    expect(getByText('Active')).toBeTruthy();
  });

  it('renders correctly for upcoming status', () => {
    const { getByText } = render(<StatusBadge status="upcoming" />);
    expect(getByText('Upcoming')).toBeTruthy();
  });

  it('renders correctly for recruiting status', () => {
    const { getByText } = render(<StatusBadge status="recruiting" />);
    expect(getByText('Recruiting')).toBeTruthy();
  });

  it('renders status value for unknown status', () => {
    // Force unknown status for default case coverage
    const { getByText } = render(<StatusBadge status={'unknown' as any} />);
    expect(getByText('unknown')).toBeTruthy();
  });
});
