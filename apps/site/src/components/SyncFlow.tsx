'use client'

import { useEffect, useRef, useState } from 'react'
import { ReactFlow, BaseEdge, getBezierPath, Handle, Position, type EdgeProps, type NodeProps, type Node, type Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useMedia } from '@/lib/useMedia'

type BoxData = { label: string; vertical: boolean; hub?: boolean }
type StreamData = { dur: number; offset: number; still: boolean }

function Box({ data }: NodeProps<Node<BoxData>>) {
  const v = data.vertical
  return (
    <div className={`rf-node${data.hub ? ' hub' : ''}`}>
      <Handle type="target" position={v ? Position.Top : Position.Left} />
      {data.label}
      <Handle type="source" position={v ? Position.Bottom : Position.Right} />
    </div>
  )
}

// A plain edge with packets travelling along it, so the diagram reads as data moving.
function Stream({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }: EdgeProps<Edge<StreamData>>) {
  const [path] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition })
  const { dur = 1.6, offset = 0, still = false } = data ?? {}
  return (
    <>
      <BaseEdge id={id} path={path} className="rf-edge" />
      {!still &&
        [0, 1, 2].map((i) => (
          <circle key={i} r={2.6} className="rf-dot">
            <animateMotion dur={`${dur}s`} begin={`${-(dur / 3) * i - offset}s`} repeatCount="indefinite" path={path} />
          </circle>
        ))}
    </>
  )
}

const nodeTypes = { box: Box }
const edgeTypes = { stream: Stream }

function layout(vertical: boolean): Node<BoxData>[] {
  const P: Record<string, [number, number]> = vertical
    ? { a: [0, 0], b: [100, 0], c: [200, 0], k: [100, 100], pg: [30, 200], es: [170, 200] }
    : { a: [0, 0], b: [0, 60], c: [0, 120], k: [240, 60], pg: [480, 25], es: [480, 95] }
  const src = vertical ? 'source' : 'external source'
  const node = (id: string, label: string, hub = false): Node<BoxData> => ({
    id, type: 'box', position: { x: P[id][0], y: P[id][1] }, data: { label, vertical, hub }, draggable: false,
  })
  return [node('a', src), node('b', src), node('c', src), node('k', 'Kafka', true), node('pg', 'PostgreSQL'), node('es', 'Elasticsearch')]
}

function edges(still: boolean): Edge<StreamData>[] {
  const spec: [string, string, number, number][] = [['a', 'k', 1.8, 0], ['b', 'k', 1.6, 0.3], ['c', 'k', 2, 0.6], ['k', 'pg', 1.4, 0.2], ['k', 'es', 1.4, 0.9]]
  return spec.map(([s, t, dur, offset]) => ({ id: s + t, source: s, target: t, type: 'stream', data: { dur, offset, still } }))
}

export function SyncFlow() {
  const ref = useRef<HTMLDivElement>(null)
  // Mount only once visible: it can start inside the collapsed "more results",
  // and fitView needs real dimensions.
  const [visible, setVisible] = useState(false)
  const vertical = useMedia('(max-width: 560px)')
  const still = useMedia('(prefers-reduced-motion: reduce)')

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true)
        io.disconnect()
      }
    })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className="rf" role="img" aria-label="External sources stream into Kafka, which feeds PostgreSQL and Elasticsearch">
      {visible && (
        <ReactFlow
          key={vertical ? 'v' : 'h'}
          nodes={layout(vertical)}
          edges={edges(still)}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.12 }}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          preventScrolling={false}
        />
      )}
    </div>
  )
}
