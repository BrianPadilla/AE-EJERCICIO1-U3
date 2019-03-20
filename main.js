const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); //trae los parámetros del request para mejor
//manipulacion

//conexión a mongo como la pide a partir de la v5
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/u3',{useNewUrlParser:true});



//Construyendo el esquema
const productSchema =  new mongoose.Schema({
    code: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    }
});

//modelo 3 parámetros el primero como se llama en node
//el segundo el esquema, y el tercero como se llamará la colección en mongo

const Product = mongoose.model('Product',productSchema,'products');

//definir endpoints

const productRouter = express.Router();

productRouter.post("/",(req,res)=>{
    //const product recibe un json, debe tener la estructura del esquema definido
    const product = req.body;
    Product.create(product)
    .then(data=>{
        console.log(data);
        res.status(200);
        res.json({
            code:200,
            msj:"Saved!!!",
            detail:data
        });
    })
    .catch(error => {
        console.log(error);
        res.status(400);
        res.json({
            code:400,
            msj:"No se pudo insertar!!!",
            detail:error
        });
    });
});



productRouter.get("/",(req,res)=>{

    Product.find({})
    .then(products=>{
        res.status(200);
        res.json({
            code:200,
            msg: "Consulta exitosa",
            detail: products
        });
    })
    .catch(error=>{
        res.status(400),
        res.json({
            code:400,
            msg: "Error!!",
            detail: error
        })
    });

});


productRouter.get("/:id",(req,res)=>{

    const id = req.params.id; //debe llamarse igual el de la ruta y el de params

    Product.find({_id:id})
    .then(products=>{
        res.status(200);
        res.json({
            code:200,
            msg: "Consulta exitosa",
            detail: products
        });
    })
    .catch(error=>{
        res.status(400),
        res.json({
            code:400,
            msg: "Error!!",
            detail: error
    });

});

});


productRouter.delete("/:id",(req,res)=>{

    const {id} = req.params; //pusca en params lo descompone y asigna a {id} el equivalente
    Product.remove({_id:id})
    .then(data=>{
        res.status(200);
        res.json({
            code:200,
            msg:"Se eliminó!!!",
            detail: data
        })
    })
    .catch(error=>{
        res.status(400);
        res.json({
            code:400,
            msg:"No se eliminó",
            detail: error
        })
    
    });

}); //fin delete

productRouter.put("/:name",(req,res)=>{
 
    const name = req.params.name;
    const dato =  req.body.name;

    Product.findOneAndUpdate({name:name},{$set:{name:dato}},{new:true})
    .then(products=>{
        res.status(200);
        res.json({
            code:200,
            msg:"Actualizado",
            detail:products
        })
    })
    .catch(error=>{
        res.status(400);
        res.json({
            code:400,
            msg:"Error al actualizar",
            detail:error
        })
    })


});


//configurando servidor express
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


app.use("/products",productRouter);

//Ejecutando el servidor HTTP este modulo viene en el core de node.js
const server = require('http').Server(app);
const port = 3002;

//Ejecutando el servidor
server.listen(port);
console.log(`Running on port ${port}`);
