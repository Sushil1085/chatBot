require('dotenv').config();
const express = require('express');
const cors = require('cors');
const database = require('./database');
const bcrypt = require("bcrypt");
const multer = require('multer');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");


const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
    origin: "http://localhost:5173", // Allow frontend URL
    credentials: true, // Allow cookies and authentication headers
}));

app.use(express.json());
app.use(cookieParser());

const verifyToken = (req, res, next) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden: Invalid token" });
        }
        
        req.user = decoded; // Attach user data to request
        next();
    });
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Save files in "uploads" folder
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
    }
});

// Use storage in multer config
const upload = multer({ storage: storage });

app.post('/upload', upload.single('avatar'), function (req, res, next) {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    // console.log(req.file, "File Details");
    res.send("File uploaded successfully!");
});

app.post("/chat-body", (req, res) => {
    const { message, sender, title_id } = req.body;

    query = 'INSERT INTO all_chat (title_id,message,sender) VALUES (?,?,?)'
    values = [title_id, message, sender]

    database.query(query, values, (err, result) => {
        if (err) {
            console.error("Error inserting chat:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ message: "Chat created successfully", chat_id: result.insertId });
    });
});

app.post("/newChat/:userid", async (req, res) => {

    const { allchats } = req.body;
    const { userid } = req.params;

    // console.log(userid,"userid");


    const message = (allchats?.userMessage?.data.split(" ").slice(0, 4).join(" "));

    query = 'INSERT INTO chat_titles (message,userid) VALUES (?,?)'
    values = [message, userid]

    database.query(query, values, (err, result) => {
        if (err) {
            console.error("Error inserting chat:", err);
            return res.status(500).json({ error: "Database error" });
        }

        const title_id = result.insertId;

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

app.delete("/deleteChat", (req, res) => {

    const { id } = req.body;

    const sql = "DELETE FROM all_chat WHERE title_id=?";
    const value = [id];

    database.query(sql, value, (err, result) => {
        if (err) {
            console.error("Error deleting chat:", err);
            return res.status(500).json({ error: "Database error" });
        }
    })

    const sql2 = "DELETE FROM chat_titles WHERE id=?";
    const value2 = [id];

    database.query(sql2, value2, (err, result) => {
        if (err) {
            console.error("Error deleting chat:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ message: "Chat deleted successfully" });
    })
})

app.get("/getsidebardata/:userid", (req, res) => {
    const { userid } = req.params;
    const sql = 'select * from chat_titles where userid=?'
    value = [userid];
    database.query(sql, value, (err, results) => {
        if (err) {
            console.error("Error fetching sidebar data:", err);
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(results);
    });

})

app.get("/getsidebardata/:userid/:id", (req, res) => {
    const { id } = req.params;
    const { userid } = req.params;

    const sql = 'select * from chat_titles where userid=?'
    const value = [userid];
    database.query(sql, value, (err, results) => {
        if (err) {
            console.error("Error fetching sidebar data:", err);
            return res.status(500).json({ error: "Database query failed" });
        }
    });


    const sql1 = 'select * from all_chat where title_id=?'
    value1 = id;
    database.query(sql1, value1, (err, results) => {
        if (err) {
            console.error("Error fetching sidebar data:", err);
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(results);
    });

})

app.post("/adduser", (req, res) => {
    const { username, emailid, password } = req.body;

    const hashPassword = bcrypt.hashSync(password, 10);

    const sql = "INSERT INTO users (username,emailid,password) VALUES (?,?,?)";
    const value = [username, emailid, hashPassword];

    database.query(sql, value, (err, result) => {
        if (err) {
            console.error("Error adding user:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ message: "User added successfully" });
    })

});

app.post("/loginuser", (req, res) => {
    const { emailid, password } = req.body;

    const sql = "SELECT * FROM users WHERE emailid=?";
    const value = [emailid];

    database.query(sql, value, (err, result) => {

        const user = result[0];
        if (err) {
            console.error("Error adding user:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (result.length > 0) {
            if (bcrypt.compareSync(password, result[0].password)) {
                const { password: _, ...userData } = user;
                res.status(201).json({ message: "User logged in successfully", user: userData });
            } else {
                res.status(401).json({ message: "Invalid credentials" });
            }
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    })

});

app.post("/loginadmin", (req, res) => {
    const { emailid, password } = req.body;
    if (emailid !== "admin@gmail.com") {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const sql = "SELECT * FROM users WHERE emailid=?";
    const value = [emailid];

    database.query(sql, value, (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (result.length > 0) {
            const user = result[0];

            if (password === user.password) {
                const token = jwt.sign({ userid: user.userid, email: user.emailid }, process.env.JWT_SECRET, {
                    expiresIn: "1d",
                });
                res.cookie("authToken", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production", 
                    sameSite: "strict",
                    maxAge: 24 * 60 * 60 * 1000, 
                });
                const { password: _, ...userData } = user;
                return res.status(200).json({ message: "User logged in successfully", user: userData });
            } else {
                return res.status(401).json({ message: "Invalid credentials" });
            }
        } else {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    });
});

app.get("/getallusers",verifyToken, (req, res) => {
    if (req.user.email !== "admin@gmail.com") {
        return res.status(403).json({ message: "Access denied: Admins only" });
    }
    const sql = "SELECT * FROM users";
    database.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(results);
    });
});

app.post("/logout", (req, res) => {
    res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure only in production
        sameSite: "lax",
    });
    res.status(200).json({ message: "User logged out successfully" });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
