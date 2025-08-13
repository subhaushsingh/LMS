import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { type } from 'os'
import { kMaxLength } from 'buffer'


const userSchema = new mongoose.Schema(
    {
        name:{
            type : String,
            required:[true,'Name is required'],
            trim : true,
            maxLength : [50,'Name cannot exceed 50 characters']
        },
        email:{
            type : String,
            required:[true,'email is required'],
            trim : true,
            unique : true,
            lowercase: true,
            match:[/^(?![.-])[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/,'please provide valid email']
        },
        password:{
            type:String,
            minlength:[8,'password must be at least 8 letter'],
            required:true,
            select:false
        },
        role:{
            type:String,
            enum:{
                values:['student','instructor','admin'],
                message:'please select a valid role'
            },
            default:'student'
        },
        avatar:{
            type:String,
            default:'default-avatar.png'
        },
        bio:{
            type:String,
            maxLength:[200,'bio cannot exceed 200 characters']
        },
        enrolledCourses:[
            {
                course:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'Course'
                },
                enrolledAt:{
                    type:Date,
                    default:Date.now
                }
            }
        ],
        createdCourses:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Course'
            }
        ],
        resetPasswordToken:String,
        resetPasswordExpire:Date,
        lastActive:{
            type:Date,
            default:Date.now
        }
    },{
        timestamps:true,
        toJSON: {virtuals:true},
        toJSON:{virtuals:true}

    }
)

userSchema.pre('save', async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password,12)
    next();
})


userSchema.methods.comparePassword = async function(enterPassword){
    return await bcrypt.compare(enterPassword,this.password)
}


userSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha512')
                            .update(resetToken)
                            .digest('hex')
                            this.resetPasswordExpire = Date.now() + 20 * 60 * 1000 // 20 minutes
        return resetToken
}  


userSchema.methods.updateLastActive = function(){
    this.lastActive = Date.now()
    return this.lastActive({validateBeforeSave: false})
}

userSchema.virtual('getTotalEnrolledCourses').get(function(){
    return this.enrolledCourses.length
})




export const User = mongoose.model('User',userSchema)