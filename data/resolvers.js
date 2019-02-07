import mongoose from "mongoose";
import { Clients, Products, Orders } from "./db";
import { rejects } from "assert";

export const resolvers = {
  Query: {
    getClients: (root, { limit, offset }) => {
      return Clients.find({})
        .limit(limit)
        .skip(offset);
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
      console.log(client)
      return new Promise((resolve, object) => {
        Orders.find({"client": client}, (err, order) => {
          if (err) rejects(err);
          else resolve(order);
        });
      });
    }
  },
  Mutation: {
    setClient: (root, { input }) => {
      const newClient = new Clients({
        name: input.name,
        surname: input.surname,
        company: input.company,
        emails: input.emails,
        years: input.years,
        type: input.type,
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
				});

      newOrder.id = newOrder._id;

      return new Promise((resolve, obj) => {
        // recorrer y actualizar la cantidad de productos con $inc de mongodb
        // es para variar un dato en otra collecion
        // https://docs.mongodb.com/manual/reference/operator/update/inc/index.html
        input.order.forEach(order => {
            Products.updateOne({_id: order.id }, 
              { "$inc" : 
                { "stock" : -order.quantity }
              }, function (error) {
                  if(error) return new Error(error);
              }
            )
        });
        newOrder.save(err => {
          if (err) rejects(err);
          else resolve(newOrder);
        });
      });
    }
  }
};
