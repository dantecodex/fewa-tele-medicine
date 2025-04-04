import { Redis } from "ioredis"

const redis = new Redis({
    host: "localhost",
    port: 6379,
    password: "mysecretpassword"
})

export default redis