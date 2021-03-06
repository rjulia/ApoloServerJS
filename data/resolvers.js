import mongoose from "mongoose";
import { Clients, Products, Orders, Users } from "./db";
import { rejects } from "assert";
const ObjectId = mongoose.Types.ObjectId;

import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config({path: 'variables.env'});
import jwt from 'jsonwebtoken';

const createToken = (userObj, secret, expiresIn) => {
    const{ user} = userObj
    return jwt.sign({user}, secret, {expiresIn});
}

export const resolvers = {
  Query: {
    getClients: (root, { limit, offset, seller }) => {

      let filter;
      if(seller){
        filter = { seller: new ObjectId(seller)};
      }
      return Clients.find(filter)
        .sort({ age : 1 } )
        .limit(limit)
        .skip(offset)
    },
    getClient: (root, { id }) => {
      return new Promise((resolve, object) => {
        Clients.findById(id, (err, client) => {
          if (err) rejects(err);
          else resolve(client);
        });
      });
    },
    totalClients: root => {
      return new Promise((resolve, object) => {
        Clients.countDocuments({}, (err, count) => {
          if (err) rejects(err);
          else resolve(count);
        });
      });
    },
    getProducts: (root, { limit, offset, hasStock }) => {
      let filter;
      // con $gt puedes crear un filtro que su cantidad sea mayor de lo que le pases, MongoDB 
      // https://docs.mongodb.com/manual/reference/operator/query/gt/index.html
      if (hasStock) {
          filter = {stock: {$gt: 0}}
      }
      return Products.find(filter)
        .limit(limit)
        .skip(offset);
    },
    getProduct: (root, { id }) => {
      return new Promise((resolve, object) => {
        Products.findById(id, (err, product) => {
          if (err) rejects(err);
          else resolve(product);
        });
      });
    },
    totalProducts: root => {
      return new Promise((resolve, object) => {
        Products.countDocuments({}, (err, count) => {
          if (err) rejects(err);
          else resolve(count);
        });
      });
    },
    getOrders: (root, {client}) => {
      // cpara filtrar una base de datos de mongose, por un campo, le pasas entre llaves el valor que quieres filtrar de todos los campos dispobible, en este caso , por client e {cliente}
      // https://docs.mongodb.com/manual/reference/method/db.collection.find/index.html
      return new Promise((resolve, object) => {
        Orders.find({"client": client}, (err, order) => {
          if (err) rejects(err);
          else resolve(order);
        });
      });
    },
    topClients: (root) => {
      // https://docs.mongodb.com/manual/reference/command/aggregate/index.html
      // https://docs.mongodb.com/manual/reference/operator/aggregation/match/index.html
      // https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/
      // https://docs.mongodb.com/manual/reference/operator/aggregation/group/
      // https://docs.mongodb.com/manual/reference/operator/aggregation/sort/index.html

      return new Promise((resolve, object) => {
        Orders.aggregate([
          {
            $match: { state: "COMPLETE" }
          },
          {
            $group: {
              _id: "$client",
              total: { $sum: "$total" }
            }
          },
          {
            $lookup: {
              from: "clients",
              localField: "_id",
              foreignField: "_id",
              as: "client"
            }
          },
          {
            $sort: { total: -1 }
          },
          {
            $limit: 10
          }
        ],(err, result) => {
          if (err) rejects(err);
          else resolve(result);
        } );

      })
    },
    topSellers: (root) => {
      return new Promise((resolve, object) => {
        Orders.aggregate([
          {
            $match: { state: "COMPLETE" }
          },
          {
            $group: {
              _id: "$seller",
              total: { $sum: "$total" }
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "_id",
              as: "seller"
            }
          },
          {
            $sort: { total: -1 }
          },
          {
            $limit: 10
          }
        ],(err, result) => {
          if (err) rejects(err);
          else resolve(result);
        } );

      })
    },
    getUser:  (root, args, {currentUser}) => {
        if (!currentUser) {
          return null;
        }
        // obtener el usuario actual del request del JWT Verificado
        const user = Users.findOne({user: currentUser.user});
        return user;
    }
  },
  Mutation: {
    setClient: (root, { input }) => {
      const namecomplete = `${input.name} ${input.surname}`
      const newClient = new Clients({
        name: input.name,
        surname: input.surname,
        namecomplete: input.name + ' ' + input.surname,
        company: input.company,
        emails: input.emails,
        years: input.years,
        type: input.type,
        seller: input.seller
      });
      newClient.id = newClient._id;

      return new Promise((resolve, obj) => {
        newClient.save(err => {
          if (err) rejects(err);
          else resolve(newClient);
        });
      });
    },
    uploadClient: (root, { input }) => {
      return new Promise((resolve, obj) => {
        Clients.findOneAndUpdate(
          { _id: input.id },
          input,
          { new: true },
          (err, client) => {
            if (err) rejects(err);
            else resolve(client);
          }
        );
      });
    },
    deleteClient: (root, { id }) => {
      return new Promise((resolve, obj) => {
        Clients.findOneAndDelete({ _id: id }, err => {
          if (err) rejects(err);
          else resolve("Your file has been deleted.");
        });
      });
    },
    setProduct: (root, { input }) => {
      const newProduct = new Products({
        name: input.name,
        price: input.price,
        stock: input.stock
      });
      newProduct.id = newProduct._id;

      return new Promise((resolve, obj) => {
        newProduct.save(err => {
          if (err) rejects(err);
          else resolve(newProduct);
        });
      });
    },
    uploadProduct: (root, { input }) => {
      return new Promise((resolve, obj) => {
        Products.findOneAndUpdate(
          { _id: input.id },
          input,
          { new: true },
          (err, product) => {
            if (err) rejects(err);
            else resolve(product);
          }
        );
      });
    },
    deleteProduct: (root, { id }) => {
      return new Promise((resolve, obj) => {
        Products.findOneAndDelete({ _id: id }, err => {
          if (err) rejects(err);
          else resolve("Your file has been deleted.");
        });
      });
    },
    setOrders: (root, { input }) => {

      const newOrder = new Orders({
        order: input.order,				
				total: input.total,
				date: new Date(),			
				client: input.client,
        state: "PENDING", 
        seller: input.seller     
				});

      newOrder.id = newOrder._id;

      return new Promise((resolve, obj) => {
       
        newOrder.save(err => {
          if (err) rejects(err);
          else resolve(newOrder);
        });
      });
    },
    updateOrders: (root, { input }) => {

      return new Promise((resolve, obj)=> {
         // recorrer y actualizar la cantidad de productos con $inc de mongodb
        // es para variar un dato en otra collecion
        // https://docs.mongodb.com/manual/reference/operator/update/inc/index.html
        const {state} = input;
        let instruction;
        if (state === 'COMPLETE') {
          instruction = '-';
        } else if (state === 'CANCELLED') {
          instruction = '+';
        }
        input.order.forEach(order => {
            Products.updateOne({_id: order.id }, 
              { "$inc" : 
                { "stock" : `${instruction}${order.quantity}` }
              }, function (error) {
                  if(error) return new Error(error);
              }
            )
        });

        Orders.findOneAndUpdate(
          { _id: input.id },
          input,
          { new: true },
          (err, product) => {
            if (err) rejects(err);
            else resolve(product);
          }
        );
      })
    },
    createUser: async (root, { user, name, rol, password } ) =>{
        // revisar si hayalguno repetido
        const userExit = await Users.findOne({user})

        if(userExit) {
          throw new Error("This user already exit")
        }

        const newUser = await new Users({
            user,
            name,
            rol,
            password
        }).save()
        
        return "Create correctly";
    },
    authUser: async (root, { user, password } ) =>{
      // revisar si hayalguno repetido
      const userObj = await Users.findOne({user});

      if(!userObj){
        throw new Error("User not find")
      }
      const passwordCorrect = await bcrypt.compare(password, userObj.password);

      if (!passwordCorrect) {
        throw new Error("Password incorrect");
      } 

      return {
        token: createToken(userObj, process.env.SECRETO, '1hr')
      }
    },
  }
};
