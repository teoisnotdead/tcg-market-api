import app from './src/app.js'
import { PORT } from './src/config/settings.js'

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})