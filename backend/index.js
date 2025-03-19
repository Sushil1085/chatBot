require('dotenv').config();
const express = require('express');
const cors = require('cors');
const database = require('./database');
const bcrypt = require("bcrypt");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

// app.post("/sidebar-chat", (req, res) => {
//     const { message } = req.body;


//     query = 'INSERT INTO chat_titles (message) VALUES (?)'
//     values = [message]

//     database.query(query, values, (err, result) => {
//         if (err) {
//             console.error("Error inserting chat:", err);
//             return res.status(500).json({ error: "Database error" });
//         }
//         res.status(201).json({ message: "Chat created successfully", chat_id: result.insertId });
//     });
// });

app.post("/chat-body", (req, res) => {
    const { message, sender, title_id } = req.body;

    query = 'INSERT INTO all_chat (title_id,message,sender) VALUES (?,?,?)'
    values = [title_id,message,sender]

    database.query(query, values, (err, result) => {
        if (err) {
            console.error("Error inserting chat:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ message: "Chat created successfully", chat_id: result.insertId });
    });
});

app.post("/newChat",async(req,res)=>{

    const {allchats}=req.body;

    const message =(allchats?.userMessage?.data.split(" ").slice(0, 4).join(" "));

    query = 'INSERT INTO chat_titles (message) VALUES (?)'
    values = [message]

    database.query(query, values, (err, result) => {
        if (err) {
            console.error("Error inserting chat:", err);
            return res.status(500).json({ error: "Database error" });
        }

        const title_id=result.insertId;

        const query2 = 'INSERT INTO all_chat (message, sender, title_id) VALUES (?, ?, ?), (?, ?, ?)';
        const values2 = [
            allchats?.userMessage?.data, allchats?.userMessage?.sender, title_id,
            allchats?.resposne?.data, allchats?.resposne?.sender, title_id
        ];

        database.query(query2, values2, (err, result) => {
            if (err) {
                console.error("Error inserting chat messages:", err);
                return res.status(500).json({ error: "Database error" });
            }

            res.status(201).json({ message: "Chat created successfully", chat_id: title_id });
        });


    });
    
});

app.delete("/deleteChat",(req,res)=>{

    const{id}=req.body;

    const sql="DELETE FROM all_chat WHERE title_id=?";
    const value=[id];

    database.query(sql,value,(err,result)=>{
        if(err){
            console.error("Error deleting chat:", err);
            return res.status(500).json({ error: "Database error" });
        }
    })

    const sql2="DELETE FROM chat_titles WHERE id=?";
    const value2=[id];

    database.query(sql2,value2,(err,result)=>{
        if(err){
            console.error("Error deleting chat:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ message: "Chat deleted successfully" });
    })
})

app.get("/getsidebardata", (req, res) => {
    const sql='select * from chat_titles'
    database.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching sidebar data:", err);
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(results);
    });

})

app.get("/getsidebardata/:id", (req, res) => {
    const{id}=req.params;
    const sql='select * from all_chat where title_id=?'
    value=id;
    database.query(sql,value, (err, results) => {
        if (err) {
            console.error("Error fetching sidebar data:", err);
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(results);
    });

})

app.post("/adduser",(req,res)=>{
    const {username,emailid,password}=req.body;

    const hashPassword = bcrypt.hashSync(password, 10);

    const sql="INSERT INTO users (username,emailid,password) VALUES (?,?,?)";
    const value=[username,emailid,hashPassword];

    database.query(sql,value,(err,result)=>{
        if(err){
            console.error("Error adding user:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ message: "User added successfully" });
    })

});

app.post("/loginuser",(req,res)=>{
    const {emailid,password}=req.body;

    const sql="SELECT * FROM users WHERE emailid=?";
    const value=[emailid];

    database.query(sql,value,(err,result)=>{
        
        const user = result[0];
        if(err){
            console.error("Error adding user:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if(result.length>0){
            if(bcrypt.compareSync(password,result[0].password)){
                const { password: _, ...userData } = user;
                res.status(201).json({ message: "User logged in successfully", user: userData });
            }else{
                res.status(401).json({ message: "Invalid credentials" });
            }
        }else{
            res.status(401).json({ message: "Invalid credentials" });
        }
    })

});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
