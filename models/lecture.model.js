import mongoose, { Mongoose } from "mongoose";

const lectureSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,'Lecture title is required'],
        trim:true,
        maxlength:[100,'Lecture title cannot exceed 100 characters'],
    },
    description:{
        type:String,
        trim:true,
        maxlength:[500,'Description cannot exceed 500 characters'],
    },
    videoUrl:{
        type:String,
        required:[true,'Video Url is required'],
    },
    duration:{
        type:Number,
        default: 0
    },
    publicId:{
        type:String,
        required:[true,'Public id is required']
    },
    isPreview:{
        type: Boolean,
        default:false
    },
    order:{
        type:Number,
        required:[true,'Lecture order is required']
    },

});

lectureSchema.pre('save',function(next){
    if(this.duration){
        this.duration=Math.round(this.duration*100)/100;
    }
    next();
})



export const Lecture = mongoose.model('Lecture',lectureSchema);