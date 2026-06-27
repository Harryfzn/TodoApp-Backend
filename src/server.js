import express from 'express'
import path, { dirname } from "path";
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import authMiddleware from './middleware/authMiddleware.js';

const app = express()
const PORT = process.env.PORT || 5003

// GET the file path from the url of the current module
const __filename = fileURLToPath(import.meta.url)
// get directory name from path
const __dirname = dirname(__filename)

//middleware
app.use(express.json())
//serve the httml dari public directory
app.use(express.static(path.join(__dirname, '../public')))

//serving the httml file dari public dir
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Routes
app.use('/auth', authRoutes)
app.use('/todos', authMiddleware, todoRoutes)

app.listen(PORT, () => {
    console.log(`server has started on: ${PORT}`)
})