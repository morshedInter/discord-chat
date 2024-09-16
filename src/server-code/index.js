const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
} = require("discord.js");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Create a Discord Client
const discordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

discordClient.once("ready", () => {
  console.log("Discord bot is online!");
});

// Create a channel when client is invited
app.post("/invite-client", async (req, res) => {
  const { discordId, email } = req.body;

  try {
    // Fetch the guild and member
    const guild = await discordClient.guilds.fetch(
      process.env.DISCORD_GUILD_ID
    );
    const member = await guild.members.fetch(discordId);

    if (member) {
      // Ensure IDs are strings
      const everyoneRoleId = guild.roles.everyone.id;
      const adminRoleId = process.env.ADMIN_ROLE_ID;
      const memberId = member.id;

      console.log( everyoneRoleId, adminRoleId, memberId, member.user.username);

      // Create a private channel for the client
      const channel = await guild.channels.create({
        name: `${member.user.username}-private`,
        type: 0, // 0 for text channels in Discord.js v14+
        permissionOverwrites: [
          {
            id: everyoneRoleId, // Deny everyone
            deny: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: memberId, // Allow only the new member
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
            ],
          },
          {
            id: adminRoleId, // Allow admin (yourself)
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
            ],
          },
        ],
      });

      // Send a welcome message to the client in their private channel
      await channel.send(
        `Welcome ${member.user.username}, this is your private channel. How can I assist you today?`
      );
      console.log("Channel created successfully:", channel.name);

      res
        .status(200)
        .json({ message: "Channel created and client invited successfully." });
    } else {
      res.status(404).json({ message: "Member not found." });
    }
  } catch (err) {
    console.error("Error creating channel:", err);
    res
      .status(500)
      .json({ message: "Failed to create channel.", error: err.message });
  }
});

discordClient.login(process.env.DISCORD_BOT_TOKEN);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// const express = require("express");
// require("dotenv").config();
// const cors = require("cors");
// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const { Client, GatewayIntentBits } = require("discord.js");

// const app = express();
// const port =  5000;

// // middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB code
// const uri = "mongodb+srv://morshedwork:QMPjx6hq1ZHsdbH4@cluster0.sq43h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// // Discord bot setup
// const discordClient = new Client({
//   intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
// });
// discordClient.login(process.env.DISCORD_BOT_TOKEN);

// discordClient.on('ready', () => {
//   console.log(`Discord bot is logged in as ${discordClient.user.tag}`);
// });

// async function run() {
//   try {
//     // Connect the client to the server (optional starting in v4.7)
//     await client.connect();

//     const todoCollection = client.db("todos_collection").collection("todos");

//     // All Task Collection -->
//     app.get("/todos", async (req, res) => {
//       const result = await todoCollection.find().toArray();
//       res.send(result);
//     });

//     app.get("/todos/:id", async (req, res) => {
//       const id = req.params.id;
//       const filter = { id: Number(id) };
//       const result = await todoCollection.findOne(filter);
//       res.send(result);
//     });

//     app.post("/todos", async (req, res) => {
//       const task = req.body;
//       const count = await todoCollection.countDocuments();
//       task.id = count + 1;
//       const createdAt = new Date();
//       const result = await todoCollection.insertOne({ ...task, createdAt });
//       res.send(result);
//     });

//     app.patch("/todos/:id", async (req, res) => {
//       const id = req.params.id;
//       const editInfo = req.body;
//       const filter = { id: Number(id) };
//       const result = await todoCollection.updateOne(filter, { $set: editInfo });
//       res.send(result);
//     });

//     app.delete("/todos/:id", async (req, res) => {
//       const id = req.params.id;
//       const isExistId = await todoCollection.findOne({ id: Number(id) });

//       if (isExistId) {
//         const query = { id: { $gt: Number(id) } };
//         await todoCollection.updateMany(query, { $inc: { id: -1 } });
//       }

//       const result = await todoCollection.deleteOne({ id: Number(id) });
//       res.send(result);
//     });

//     // Discord message route
//     app.post('/discord-message', async (req, res) => {
//       const { channelId, message } = req.body;

//       try {
//         const channel = await discordClient.channels.fetch(channelId);
//         await channel.send(message);
//         res.status(200).send('Message sent to Discord');
//       } catch (error) {
//         console.error(error);
//         res.status(500).send('Failed to send message');
//       }
//     });

//     // Send a ping to confirm a successful connection to MongoDB
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your MongoDB deployment. Successfully connected!");
//   } finally {
//     // You can uncomment the following line if you want to close the MongoDB client connection when the server shuts down
//     // await client.close();
//   }
// }
// run().catch(console.dir);

// // Basic route
// app.get("/", (req, res) => {
//   res.send("Server is running");
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running at port: ${port}`);
// });

// // const express = require("express");
// // require("dotenv").config();
// // const cors = require("cors");
// // const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// // const app = express();
// // const port = process.env.PORT || 5000;

// // // middleware
// // app.use(cors());
// // app.use(express.json());

// // // mongodb code

// // const uri = "mongodb+srv://morshedwork:QMPjx6hq1ZHsdbH4@cluster0.sq43h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// // // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// // const client = new MongoClient(uri, {
// //   serverApi: {
// //     version: ServerApiVersion.v1,
// //     strict: true,
// //     deprecationErrors: true,
// //   },
// // });

// // async function run() {
// //   try {
// //     // Connect the client to the server	(optional starting in v4.7)
// //     await client.connect();

// //     const todoCollection = client.db("todos_collection").collection("todos");

// //     // all Task Collection -->

// //     app.get("/todos", async (req, res) => {
// //       const result = await todoCollection.find().toArray();
// //       res.send(result);
// //     });

// //     app.get("/todos/:id", async (req, res) => {
// //       const id = req.params.id;
// //       const filter = { id: Number(id) };
// //       const result = await todoCollection.findOne(filter);
// //       res.send(result);
// //     });

// //     app.post("/todos", async (req, res) => {
// //       const task = req.body;
// //       // console.log(task);

// //       const count = await todoCollection.count()
// //       console.log(count);

// //       task.id = count + 1
// //       createdAt = new Date()
// //       const result = await todoCollection.insertOne({ ...task, createdAt });
// //       res.send(result);
// //     });

// //     app.patch("/todos/:id", async (req, res) => {
// //     // console.log(req.body);
// //     ;

// //       const id = req.params.id;
// //       const editInfo = req.body;
// //       const filter = { id: Number(id) };
// //     //   const updateDoc = {
// //     //     $set: {
// //     //       title: editInfo.title,
// //     //       description: editInfo.description,
// //     //       isCompleted: editInfo.isCompleted,
// //     //     },
// //     //   };
// //       const result = await todoCollection.updateOne(filter, {$set: editInfo});
// //       res.send(result);
// //     });

// //     app.delete("/todos/:id", async (req, res) => {
// //       const id = req.params.id;
// //       // console.log(id);

// //       const isExistId = await todoCollection.findOne({id: Number(id)});
// //       console.log(isExistId);

// //       if(isExistId){
// //         const query = {id: {$gt: Number(id)}}
// //         // console.log(query.id);
// //        const updateId = await todoCollection.updateMany(query, {$inc: {id: -1}});
// //       }

// //       const result = await todoCollection.deleteOne({ id: Number(id) });
// //       res.send(result);
// //     });

// //     // Send a ping to confirm a successful connection
// //     await client.db("admin").command({ ping: 1 });
// //     console.log(
// //       "Pinged your deployment. You successfully connected to MongoDB!"
// //     );
// //   } finally {
// //     // Ensures that the client will close when you finish/error
// //     // await client.close();
// //   }
// // }
// // run().catch(console.dir);

// // app.get("/", (req, res) => {
// //   res.send("server is running");
// // });

// // app.listen(port, () => {
// //   console.log(`server is running at port: ${port}`);
// // });
