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
        try {
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
            };
    
    
            if(process.env.NODE_ENV==='development'){
                mongoose.set('debug',true);
            }
    
            await mongoose.connect(process.env.MONGODB_URL,connectionOptions);
            this.retryCount = 0
        } catch (error) {
            console.error(error.message)
            await this.handleConnectionError()
        }

    }

    async handleConnectionError(){
        if (this.retryCount < MAX_RETRIES){
            this.retryCount++;
            console.log(`Retrying connection... Attempt ${this.retryCount} of ${MAX_RETRIES}`)
            await new Promise(resolve => setTimeout(() => {
                resolve
            }, RETRY_INTERVAL))
            return this.connect()
        }else{
            console.log("failed to connect with mongodb")
            process.exit(1)
        }
    }



    async handleDisconnection(){
        if(!this.isConnected){
            console.log("attempting to reconnect to mongodb")
            this.connect()
        }
    }
}