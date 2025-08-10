import mongoose from "mongoose";


const MAX_RETRIES = 3;
const RETRY_INTERVAL = 5000;

class DatabaseConnection{
    constructor(){
        this.retryCount = 0;
        this.isConnected = false;


        mongoose.set('strictQuery',true);

        mongoose.connection.on('connected',()=>{
            console.log('MONGODB CONNECTED!')
            this.isConnected = true;
        })

        mongoose.connection.on('error',()=>{
            console.log('ERROR IN MONGODB CONNECTION!!!')
        })

        mongoose.connection('disconnected',()=>{
            console.log('MONGODB DISCONNECTED!');
        })
    }


    async connect(){
        if(!process.env.MONGODB_URL){
            throw new Error("mongodb url is not defined in env variables.")
        }

        const connectionOptions = {
            useNewUrlParser : true,
            useUnifiedTopology : true,
            maxPoolSize : 10,
            serverSelectionTimeoutMS : 5000,
            socketTimeoutMS : 45000,
            family: 4
        }
    }
}