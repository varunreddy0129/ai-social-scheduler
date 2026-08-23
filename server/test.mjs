import "dotenv/config";
import dns from "node:dns";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8"]);

console.log("DNS Servers:", dns.getServers());

try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("? Connected to Atlas");
} catch (error) {
    console.error("? Connection failed:");
    console.error(error);
}
