import mongoose from "mongoose";
import { Clients, Products } from "./db";
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
    getProducts: (root, { limit, offset }) => {
      return Products.find({})
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
        orders: input.orders
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
      const newOrder = new Products({
        order: input.order,				
				total: input.total,
				date: input.date,			
				client: input.client,
				state: input.state,      
				});
      newOrder.id = newOrder._id;

      return new Promise((resolve, obj) => {
        newOrder.save(err => {
          if (err) rejects(err);
          else resolve(newOrder);
        });
      });
    }
  }
};
