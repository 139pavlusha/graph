import { useRef, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Alert, Snackbar } from '@mui/material'

import { GraphEditor } from '../GraphEditor/GraphEditor'
import { ResultPage } from '../Result/Result'
import { EdgeData, ShapeData } from '../../types'
import { Point } from 'framer-motion'

export const App = () => {
  const stageRef = useRef<any>(null)
  const [shapes, setShapes] = useState<ShapeData[]>([])
  const [count, setCount] = useState(0)
  const [edges, setEdges] = useState<EdgeData[]>([])
  const [edgeCount, setEdgeCount] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [stagePos, setStagePos] = useState<Point>({ x: 0, y: 0 })
  const [error, setError] = useState('')

  return (
    <BrowserRouter basename='/graph'>
      <Snackbar
        style={{ zIndex: 99999 }}
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setError('')}
          severity='error'
          variant='filled'
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Routes>
        <Route path='/' element={<GraphEditor
          stageRef={stageRef}
          shapes={shapes} setShapes={setShapes}
          count={count} setCount={setCount}
          edges={edges} setEdges={setEdges}
          edgeCount={edgeCount} setEdgeCount={setEdgeCount}
          zoom={zoom} setZoom={setZoom}
          stagePos={stagePos} setStagePos={setStagePos}
          setError={setError}
        />} />
        <Route path='/result' element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  )
}
