import { useAtomValue, useSetAtom } from 'jotai'
import { Alert, Snackbar } from '@mui/material'
import { notificationQueueAtom, popNotificationAtom } from '../notificationStore'

export default function Notifications() {
  const queue = useAtomValue(notificationQueueAtom)
  const pop = useSetAtom(popNotificationAtom)

  const current = queue[0]

  return (
    <Snackbar
      open={Boolean(current)}
      autoHideDuration={1000}
      onClose={(_e, reason) => {
        if (reason === 'clickaway') return
        pop()
      }}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      {current ? (
        <Alert
          onClose={() => pop()}
          severity={current.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {current.message}
        </Alert>
      ) : undefined}
    </Snackbar>
  )
}
