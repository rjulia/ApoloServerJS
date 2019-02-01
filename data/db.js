import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/clientes', {useNewUrlParser: true});

mongoose.set('setFindAndModify', false);
mongoose.set('useFindAndModify', false);


const clientsSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    empresa: String,
    emails: Array,
    edad: Number,
    tipo: String,
    pedidos: Array,
})

const Clients = mongoose.model('clients', clientsSchema);


const productsSchema = new mongoose.Schema({
    name: String,
    price: Number,
    stock: Number,
})

const Products = mongoose.model('products', productsSchema);

export { Clients, Products }