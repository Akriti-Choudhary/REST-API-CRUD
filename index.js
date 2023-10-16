const express = require('express');
const fs = require('fs');
const users = require("./MOCK_DATA.json");

const app = express()
const PORT = 8000

//MIDDLEWARE - plugin
app.use(express.urlencoded({extended: false}));

//ROUTES

//HTML rendering
app.get("/users",(req,res)=>{
    const html = `
    <ul>
        ${users.map(user => `<li>${user.first_name} </li> `).join("")}
    </ul>
    `;
    res.send(html);
})

//REST API
app.get("/api/users",(req,res)=>{
    return res.json(users);
});

// app.get('/api/users/:id', (req,res) =>{
//     const id = Number(req.params.id);
//     const user = users.find((user) => user.id === id);
//     return res.json(user);
// })

// app.patch('/api/users/:id',(req,res) => {
//     //TODO : Edit the user with id
//     return res.json({status: "pending"});
// });

// app.delete('/api/users/:id',(req,res) => {
//     //TODO : Delete the user with id
//     return res.json({status: "pending"});
// });


//Group the above content

app
    .route("/api/users/:id")
    .get((req,res) =>{
        const id = Number(req.params.id);
        const user = users.find((user) => user.id === id);
        if(!user){
            return res.status(404).json({error: "User not Found"});
        }
        return res.json(user);
    })
    .patch((req,res)=>{
        //Edit user with id
        return res.json({status: "pending"});
    })
    .delete((req,res) => {

        //TODO : Delete the user with id
        const id = Number(req.params.id);

        // Find the index of the entry with the matching ID
        const indexToDelete = users.findIndex(entry => entry.id === id);

            // Check if the entry was found
        if (indexToDelete !== -1) {
            // Remove the entry from the array
            users.splice(indexToDelete, 1);

        // Write the updated data back to the file
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
            if (err) {
            console.error('Error writing to file:', err);
            } else {
            console.log('Entry with ID', id, 'has been deleted.');
            }
        });
        } else {
            console.log('Entry not found with ID', id);
        }

        return res.json({status: "User Deleted"});
});

app.post('/api/users',(req,res) => {
    //TODO : Create new user
    const body = req.body;

    if(!body || !body.first_name|| !body.last_name || !body.email || !body.gender || !body.job_title){
        return res.status(400).json({msg: "All fields are required"});
    }

    users.push({...body, id: users.length + 1});
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err,data) => {
        return res.json({status: "success", id: users.length });
    })
});


app.listen(PORT,() => {console.log(`Server started at PORT: ${PORT}`)})

