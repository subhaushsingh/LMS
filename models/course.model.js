import mongoose, { Mongoose } from "mongoose";


const courseSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,'course title is required'],
        trim:true,
        maxlength:[100,'course title cannot exceed 100 characters'],
    },
    subtitle:{
        type:String,
        trim:true,
        maxlength:[200,'subtitle cannot exceed 200 characters']
    },
    description:{
        type:String,
        trim:true,
    },
    category:{
        type:String,
        required:[true,'category is required'],
        trim:true
    },
    level:{
        type:String,
        enum:{
            values:['beginner','intermediate','advanced'],
            default:'beginner'
        },
        price:{
            type:Number,
            required:[true,'Course price is required'],
            min:[0,'Course price cannot be negative'],
        },
        thumbnail:{
            type:String,
            required:[true,'thumbnail is required']
        },
        enrolledStudent:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        lectures:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Lecture'
            },
        ],
        instructor:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:[true,'Course instructor is required']
        },
        isPublished:{
            type:Boolean,
            default:false
        },
        totalDuration:{
            type:Number,
            default:0
        },
        totalLectures:{
            type:Number,
            default:0
        }
    }

},{
        timestamps:true,
        toJSON: {virtuals:true},
        toJSON:{virtuals:true}

    });



courseSchema.virtual('averageRating').get(function(){
    return 0;
})

courseSchema.pre('save', function(next){



    next();
})