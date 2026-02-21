import mongoose from "mongoose";
const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log(`mongo db connected`)
    } catch (error) {
        console.log(`mongo db Connection fail here is the Error :${error}`)
        process.exit(1)
    }
}
export default connectDB;