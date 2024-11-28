const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const http = require("http")
const cors = require("cors")
require("dotenv").config()
const { neon } = require("@neondatabase/serverless")
const port = process.env.PORT || 3000
const sql = neon(process.env.DATABASE_URL)
const crypto = require("crypto")
const { access } = require("fs")


app.use(cors())
app.use(bodyParser.json())

app.get("/", (req, res) => {


})

app.post("/signup", async (req, res) => {
    const { username, password } = req.body
    console.log("Username", username)
    console.log("password", password)

    //In PostgreSQL Datenbank einfügen
    try {

        //Überprüfen ob Username bereits existiert
        const exist = await sql`SELECT * FROM users WHERE username = ${username}`
        if (exist.length > 0) {
            return res.status(400).json({ message: "Username bereits vergeben" })
        }


        //Passwort hashen (zur Sicherheit)
        const salt = crypto.randomBytes(16).toString('hex'); // Erzeuge ein zufälliges Salt
        const keylen = 64; // Länge des Hashs
        const hash = await new Promise((resolve, reject) => {
            crypto.scrypt(password, salt, keylen, (err, derivedKey) => {
                if (err) {
                    return reject(err);
                }
                resolve(derivedKey.toString('hex')); // Hash in hex umwandeln
            });
        });


        const query = await sql`INSERT INTO users (username, password, salt) VALUES (${username}, ${hash}, ${salt}) RETURNING*`

        res.status(200).json({ message: "Benutzer erfolgreich erstellt" })
    }





    catch (error) {
        console.log("Fehler aufgetreten: ", error)
    }


    res.status(200)
})

app.post("/login", async (req, res) => {
    const { username, password } = req.body
    console.log(username, password)
    try {
        const query = await sql`SELECT * FROM users WHERE username = ${username}`
        const user = query[0]

        //das passwort wird als storedhash angezeigt und hash ist der hash aus der Datenbank
        const { password: storedHash, salt } = user
        console.log("SALT", salt)

        //Passwort überprüfen
        console.log("PASSWROT: ", password)
        const keylen = 64

        const hash = await new Promise((resolve, reject) => {
            crypto.scrypt(password, salt, keylen, (err, derivedKey) => {
                if (err) {
                    console.log("FEHLER in crypto.scrypt")
                    return reject(err)
                }
                const derivedHash = derivedKey.toString("hex")
                console.log("berechneter hash", derivedHash)
                resolve(derivedKey.toString("hex"))
            })
        })


        if (hash !== storedHash) {
            return res.status(401).json({ message: "Falsche Anmeldedaten" })
        }

        res.status(200).json({ message: "Anmeldung erfolgreich", username: user.username, id: user.id })

    }

    catch (error) {
        console.log("Fehler aufgetreten: ", error)
        res.status(500).json({ message: "Falsche Eingabe" })
    }


})

app.post("/new", async (req, res) => {
    const { author, content, category, keywords } = req.body
    console.log(author, content, category)
    
    try {
        const query = await sql`INSERT INTO blog (author, content, category, keywords) VALUES (${author}, ${content}, ${category}, ${keywords}) RETURNING*`
        res.status(200).json({ message: "angekommen" })

    }

    catch (error) {
        res.status(500).json({ message: error })
    }



})

app.post("/profile", async (req, res) => {
    const { username } = req.body

    try {
        const query = await sql`SELECT * FROM blog WHERE author = ${username}`
        console.log(query)
        res.status(200).json({ message: "Call erfolgreich", data: query })
    }

    catch (error) {
        res.status(500).json({ message: error })
    }
})

app.get("/getPostings", async (req, res) => {

    const query = await sql`SELECT * FROM blog`
    console.log("ALLPOSTNGS: ", query)
    res.status(200).json({ data: query })
})

app.post("/postDetail", async (req, res) => {
    const { postID } = req.body
    console.log(postID)

    try {
        const query = await sql`SELECT * FROM blog WHERE id = ${postID}`
        if (query.length == 0) {
            return res.status(401).json({ message: "Kein Post gefunden" })
        }

        res.status(200).json({ data: query })
    }

    catch (err) {
        res.status(500).json({ message: err })
    }



})

app.post("/newComment", async (req, res) => {
    const { postID, author, comment } = req.body
    console.log(postID, author, comment)

    //Post mit ID Abrufen und kommtar hinzufügen
    try {
        const query = await sql`SELECT * FROM blog WHERE id = ${postID}`
        if (query.length === 0) {
            return res.status(404).json({ message: "Post not found" });
        }

        const oldComments = query[0].comments || [];
        const updatedComments = [...oldComments, { author: author, comment: comment }];

        

        //Kommentare im Datensatz aktualisieren
        const updateQuery = await sql`
                UPDATE blog 
                SET comments = ${JSON.stringify(updatedComments)}::jsonb 
                WHERE id = ${postID} 
                RETURNING *;
            `;

        res.status(200).json({
            message: "Comment added successfully",
            post: updateQuery[0],
        });

    }

    catch (err) {
        console.log(err)
        res.status(500).json({ message: err })
    }

})

app.post("/getProfileData", async (req, res) => {
    const {username} = req.body
    console.log(username)

    try {
        const query = await sql`SELECT * FROM users WHERE username = ${username}`
        if(query.length > 0) {
            res.status(200).json({message: query[0]})
        }

        else {
            res.status(401).json({message: "Kein User gefunden"})
        }
      
    }

    catch(err) {
        res.status(401).json({message: err})
    }
    



})

app.post("/changeProfileData", async (req,res) => {
    console.log(req.body)

    try {
        const query = await sql `UPDATE users SET 
                firstname = ${req.body.firstname}, 
                lastname = ${req.body.lastname},
                age = ${req.body.age},
                country = ${req.body.country},
                bio = ${req.body.bio},
                picturelink = ${req.body.picturelink}
                WHERE id = ${req.body.id}
                RETURNING *;
            `

            if(query.length > 0) {
                res.status(200).json({message: "Erfolgreich updatet"})
            }

            else {
                res.status(401).json({message: "Fehler aufgretreten"})
            }


        

    }

    catch(err) {
        res.status(401).json({message: err})
    }


})

app.post("/keyword", async (req,res) => {
    const { keyword } = req.body
    console.log("KEYWORD: ", keyword)

    // SQL Abfrage nach dem Schlüsselwort
    try {
        const query = await sql`SELECT * FROM blog WHERE ${keyword} = ANY(keywords)`
        if(query.length == 0) {
            return res.status(404).json({message: "Kein Treffer bei der Suche"})
        }

        return res.status(200).json({data: query})
    }

    catch(err) {
        console.log("Fehler aufgetreten")
        res.status(500).json({message: err})
    }
    
})

app.listen(port, () => {
    console.log("Server läuft auf PORT: ", port)
})