import { useState } from "react"
import { GraphEditor } from "../GraphEditor/GraphEditor"
import { Alert, Snackbar } from "@mui/material"

export const App = () => {
  const [error, setError] = useState('')

  return (
    <div>
      <Snackbar style={{ zIndex: 99999 }} open={!!error} autoHideDuration={4000} onClose={() => setError('')} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setError('')} severity="error" variant="filled" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      <GraphEditor setError={setError} />
    </div>
  )
}
