import mongoose from "mongoose"

export const connectMongoDb = async () => {
    const url = process.env.ATLAS_URI;
    mongoose.connect(url).then(res => {
        console.log("MongoDB connected")
    }).catch(error => {
        console.log("DB connection failed", error?.message)
    })
}