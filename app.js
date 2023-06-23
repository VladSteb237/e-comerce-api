require('dotenv').config();
require('express-async-errors');

// express
const express = require('express');
const app = express();
// rest of the packages
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitizer = require('express-mongo-sanitize');
// connect to DB
const connectDB = require('./db/connect');
// routers
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const orderRouter = require('./routes/orderRoutes');
// middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(rateLimiter({
    window: 15 * 60 * 1000,
    max: 60,
}));
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitizer());

//app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use(express.static('./public'));
app.use(fileUpload());

// routes
// app.get('/api/v1', (req, res) => {
//     //console.log(req.cookies);
//     console.log(req.signedCookies);
//     res.send('<h1>E-Commerce store API...</h1>');
// });
// app.get('/', (req, res) => {
//     console.log(req.cookies);
//     res.send('<h1>E-Commerce store API...</h1>');
// });
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/orders', orderRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port, () => {
            console.log(`SERVER is listening on PORT ${port}...`);
        })
    } catch (error) {
        console.log(error);
    }
};
start();

//const { MongoClient, ServerApiVersion } = require("mongodb");
// Replace the placeholder with your Atlas connection string
//const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.kccfccf.mongodb.net/E-COMERCE?retryWrites=true&w=majority`;
//const uri = "mongodb+srv://john:1234@cluster0.kccfccf.mongodb.net/E-COMERCE?retryWrites=true&w=majority";
//const uri = process.env.MONGO_URL;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });
// async function run() {
//     try {
//         // Connect the client to the server (optional starting in v4.7)
//         await client.connect();

//         // Send a ping to confirm a successful connection
//         await client.db("admin").command({ ping: 1 });
//         //console.log(`Pinged your deployment. You successfully connected to MongoDB! ${port}`);
//         app.listen(port, () =>
//             console.log(`SERVER is listening on PORT ${port}...`)
//         );
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }
// run().catch(console.dir);

//const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@coding-blog-t0xf0.mongodb.net/<dbname>`