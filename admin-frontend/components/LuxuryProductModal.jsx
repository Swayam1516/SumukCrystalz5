'use client';

import React from 'react';
import AdvancedProductWorkspace from './AdvancedProductWorkspace';

/**
 * Backward-compatible LuxuryProductModal wrapper that renders the full
 * 10-Tab AdvancedProductWorkspace.
 */
export default function LuxuryProductModal(props) {
  return <AdvancedProductWorkspace {...props} />;
}
