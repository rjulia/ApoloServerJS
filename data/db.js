import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/clientes', {useNewUrlParser: true});

mongoose.set('setFindAndModify', false);
mongoose.set('useFindAndModify', false);


const clientsSchema = new mongoose.Schema({
    name: String,
    surname: String,
    company: String,
    emails: Array,
    years: Number,
    type: String,
    orders: Array,
})

const Clients = mongoose.model('clients', clientsSchema);


const productsSchema = new mongoose.Schema({
    name: String,
    price: Number,
    stock: Number,
})

const Products = mongoose.model('products', productsSchema);

const orderSchema = new mongoose.Schema({
    order: Array,
    total: Number,
    date: Date,
    client: String,
    state: String
})

const Orders = mongoose.model('orders', orderSchema);

export { Clients, Products, Orders }