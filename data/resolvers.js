import mongoose from "mongoose";
import { Clients  } from "./db";
import { rejects } from "assert";

export const resolvers = {
    Query: {
        getClients: (root, {limit, offset}) =>{
            return Clients.find({}).limit(limit).skip(offset);
        },
        getClient:  (root, {id}) =>{
            return new Promise((resolve, object)=> {
                console.log(object)
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
        }
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
                Clients.findOneAndRemove({_id : id }, (err) => {
                    if(err) rejects(err)
                    else resolve("se ha borrado correctamente")
                });
            });
        }
        
    }
}
