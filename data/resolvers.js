import mongoose from "mongoose";
import { Clients, Products  } from "./db";
import { rejects } from "assert";

export const resolvers = {
    Query: {
        getClients: (root, {limit, offset}) =>{
            return Clients.find({}).limit(limit).skip(offset);
        },
        getClient:  (root, {id}) =>{
            return new Promise((resolve, object)=> {
                Clients.findById(id, (err, client)=>{
                    if(err) rejects(err)
                    else resolve(client)
                })
            })
        }, 
        totalClients: (root) =>{
            return new Promise((resolve, object)=>{
                Clients.countDocuments({}, (err, count) => {
                    if(err) rejects(err)
                    else resolve(count)
                })
            })
        },
        getProducts: (root, {limit, offset}) =>{
            return Products.find({}).limit(limit).skip(offset);
        },
        getProduct:  (root, {id}) =>{
            return new Promise((resolve, object)=> {
                Products.findById(id, (err, product)=>{
                    if(err) rejects(err)
                    else resolve(product)
                })
            })
        }, 

    },
    Mutation: {
        setClient: (root, {input}) =>{
            const newClient = new Clients({
                nombre : input.nombre,
                apellido : input.apellido,
                empresa : input.empresa,
                emails : input.emails,
                edad : input.edad,
                tipo : input.tipo,
                pedidos : input.pedidos
            });
            newClient.id = newClient._id;

            return new Promise((resolve, obj)=>{
                newClient.save((err)=>{
                    if(err) rejects(err)
                    else resolve(newClient)
                })
            })
        },
        uploadClient: (root, {input}) => {
            return new Promise((resolve, obj)=>{
                Clients.findOneAndUpdate({_id : input.id }, input, {new: true}, (err, client) => {
                    if(err) rejects(err)
                    else resolve(client)
                });
            });
        },
        deleteClient: (root, {id}) => {
            return new Promise((resolve, obj)=>{
                Clients.findOneAndDelete({_id : id }, (err) => {
                    if(err) rejects(err)
                    else resolve("se ha borrado correctamente")
                });
            });
        },
        setProduct: (root, {input}) =>{
            const newProduct = new Products({
                name: input.name,
                price: input.price,
                stock: input.stock,
            });
            newProduct.id = newProduct._id;

            return new Promise((resolve, obj)=>{
                newProduct.save((err)=>{
                    if(err) rejects(err)
                    else resolve(newProduct)
                })
            })
        },
        uploadProduct: (root, {input}) => {
            return new Promise((resolve, obj)=>{
                Products.findOneAndUpdate({_id : input.id }, input, {new: true}, (err, product) => {
                    if(err) rejects(err)
                    else resolve(product)
                });
            });
        },
        deleteProduct: (root, {id}) => {
            return new Promise((resolve, obj)=>{
                Products.findOneAndDelete({_id : id }, (err) => {
                    if(err) rejects(err)
                    else resolve("se ha eliminado correctamente")
                });
            });
        },
        
    }
}
