import React from 'react';
import source from './AIDebtTreasuryPost.md?raw';
import { Markdown } from './Markdown';

export const AIDebtTreasuryPost: React.FC = () => <Markdown source={source} />;
