const path = require('path');

const express = require('express');
const csrf = require('csurf');
const expressSession = require('express-session');

const createSessionConfig = require('./config/session');
const db = require('./data/database');

const addCrfsTokenMiddleware = require('./middlewares/csrf-token');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const checkAuthStatusMiddleware = require('./middlewares/check-auth');
const protectRoutesMiddleware = require('./middlewares/protect-routes');
const cartMiddleware = require('./middlewares/cart');
const updateCartPricesMiddleware = require('./middlewares/update-cart-prices');
const notFoundMiddleware = require('./middlewares/not-found');

const adminRoutes = require('./routes/admin-routes');
const authRoutes = require('./routes/auth-routes');
const baseROutes = require('./routes/base-routes');
const productRoutes = require('./routes/product-routes');
const cartRoutes = require('./routes/cart-routes');
const ordersRoutes = require('./routes/orders-routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use('/products/assets',express.static('product-data'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(csrf());

app.use(cartMiddleware);
app.use(updateCartPricesMiddleware);

app.use(addCrfsTokenMiddleware);
app.use(checkAuthStatusMiddleware);

app.use(baseROutes);
app.use(authRoutes);
app.use(productRoutes);
app.use('/cart', cartRoutes);
app.use(protectRoutesMiddleware);
app.use('/admin', adminRoutes);
app.use('/orders', ordersRoutes);

app.use(notFoundMiddleware);

app.use(errorHandlerMiddleware);

db.connectToDatebase().then(function() {
    app.listen(3000);
}).catch(function(e) {
    console.log('Failed to connect to the database');
    console.log(e);
})


