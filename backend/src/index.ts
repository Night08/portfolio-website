
import express, {NextFunction, Request, Response} from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import connectToMongo from './db/dbConnect';

 // config environment variables
dotenv.config()

// setup server
const app = express()
const port = process.env.PORT || 3000


// making connection to mongodb
app.use( async (req: Request, res: Response, next: NextFunction) => {
    console.log("enter22")
    await connectToMongo(res);
    next();
})

// middlewares
app.use(cors())
app.use(express.json())

// app.use('/api/auth', require('./routes/auth'))
// app.use('/api/notes', require('./routes/notes'))

// routes
app.get('/', (req: Request, res: Response) => {
    res.send('leeelo');
})

app.listen(port, () => { console.log(`Server listening at http://localhost:${port}`)});