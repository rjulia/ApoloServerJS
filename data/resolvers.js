import mongoose from "mongoose";
import { Clientes  } from "./db";
import { rejects } from "assert";

export const resolvers = {
    Query: {
        getClientes: (root, {limit}) =>{
            return Clientes.find({}).limit(limit);
        },
        getCliente:  (root, {id}) =>{
            return new Promise((resolve, object)=> {
                console.log(object)
                Clientes.findById(id, (err, cliente)=>{
                    if(err) rejects(err)
                    else resolve(cliente)
                })
            })
        }
    },
    Mutation: {
        setCliente: (root, {input}) =>{
            const nuevoCliente = new Clientes({
                nombre : input.nombre,
                apellido : input.apellido,
                empresa : input.empresa,
                emails : input.emails,
                edad : input.edad,
                tipo : input.tipo,
                pedidos : input.pedidos
            });
            nuevoCliente.id = nuevoCliente._id;

            return new Promise((resolve, obj)=>{
                nuevoCliente.save((err)=>{
                    if(err) rejects(err)
                    else resolve(nuevoCliente)
                })
            })
        },
        uploadCliente: (root, {input}) => {
            return new Promise((resolve, obj)=>{
                Clientes.findOneAndUpdate({_id : input.id }, input, {new: true}, (err, cliente) => {
                    if(err) rejects(err)
                    else resolve(cliente)
                });
            });
        },
        deleteCliente: (root, {id}) => {
            return new Promise((resolve, obj)=>{
                Clientes.findOneAndRemove({_id : id }, (err) => {
                    if(err) rejects(err)
                    else resolve("se ha borrado correctamente")
                });
            });
        }
        
    }
}
