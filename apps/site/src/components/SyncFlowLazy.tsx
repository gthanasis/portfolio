'use client'

import dynamic from 'next/dynamic'

// React Flow is the heaviest thing on the page; load it only in the browser,
// after first paint, instead of in the main bundle.
export const SyncFlowLazy = dynamic(() => import('./SyncFlow').then((m) => m.SyncFlow), {
  ssr: false,
  loading: () => <div className="rf" aria-hidden="true" />,
})
