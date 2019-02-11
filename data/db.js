import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/clientes', {useNewUrlParser: true});
mongoose.set('setFindAndModify', false);
mongoose.set('useFindAndModify', false);



const clientsSchema = new mongoose.Schema({
    name: String,
    surname: String,
     namecomplete: String,
    company: String,
    emails: Array,
    years: Number,
    type: String,
    orders: Array,
    seller: mongoose.Types.ObjectId,
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
    client: mongoose.Types.ObjectId,
    state: String
})



const Orders = mongoose.model('orders', orderSchema);


const usersSchema = new mongoose.Schema({
    user: String,
    name: String,
    rol: String,
    password: String,
})

// hashear loos password antes de guardarlos

usersSchema.pre('save', function (next) {

    // si es password no esta modificado ejecutar la siguiente funcionj
    if(!this.isModified('password')){
        return next()
    }
    bcrypt.genSalt(10, (err, salt)=>{
        if(err) return next(err);
        bcrypt.hash(this.password, salt, (err, hash)=>{
            if(err) return next(err);
            this.password = hash;
            next();
        })
    })
    
})


const Users = mongoose.model('users', usersSchema)


export { Clients, Products, Orders, Users }