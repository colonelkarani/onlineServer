const mongoose = require('mongoose');
const express = require("express");
const dotenv = require("dotenv");
const methodOverride = require('method-override');
dotenv.config();
const MONGO = process.env.MONGOURI;
const PORT = process.env.PORT || 3000;

const app = express();



mongoose.connect(MONGO).then(
  
  console.log(`mongoose connecetd at ${Date.now()}`)
).catch('error', ()=>console.error('rada chafu mzee')
);

app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`)
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


const  niggaSchema = new mongoose.Schema({
    "name": String,
    "age": Number,
    "Is a G?": Boolean,
    createdAt: { type: Date, default: Date.now }
})

const Nigga = mongoose.model("Niggazz", niggaSchema)

// Nigga.deleteMany([{"name": "huruur", "age":28, "miaka":false
// }, {"namaime" : "Hauau"}])

// Nigga.find().then(function (data) {
//     app.get("/", (req, res)=>{
//         datajson = JSON.stringify(data)
//     res.send(data)
// });
// })
app.get('/', async (req, res) => {
  try {
    const niggadata = await Nigga.find();  // wait for data

    res.send(`
      <h1>Add A Nigga</h1>
      <form action="/addniggas" method="POST">
        <label>Name: <input type="text" name="name" required></label><br><br>
        <label>Is A G?: <input type="text" name="isAG" required></label><br><br>
        <label>Age: <input type="number" name="age"></label><br><br>
        <button type="submit">Add User</button>
      </form>
      <h1>Available NIGGAZ</h1>
      <ul>
        ${niggadata.map(user => `<li>${user.name} - ${user.age} || G-status:<b style="color: red;"> ${user['Is a G?']}</b></li>`).join('')}
      </ul>
      <h1>Delete A Nigga</h1>
      <form action="/deleteniggas?_method=DELETE" method="POST">
        <label>Name: <input type="text" name="name" required></label><br><br>
        <label>Is A G?: <input type="text" name="isAG" required></label><br><br>
        <label>Age: <input type="number" name="age"></label><br><br>
        <button type="submit">DElete User</button>
      </form>
      
    `);
  } catch (error) {
    res.status(500).send('Error fetching data: ' + error.message);
  }
});

app.post('/addniggas', (req, res)=>{
   const {name, age, isAG} =req.body;
   let isag = isAG.toLowerCase();
   Nigga.insertOne({"name": name, "age": age, "Is a G?": isag})
   res.redirect('/')
})

app.delete('/deleteniggas', async (req, res) => {
  try {
    const { name, age, isAG } = req.body;
    const isag = isAG.toLowerCase();

    const result = await Nigga.deleteOne({ name, age, "Is a G?": isag });

    if (result.deletedCount === 0) {
      return res.status(404).send('No matching record found to delete');
    }

    res.redirect('/');
  } catch (error) {
    res.status(500).send('Error deleting record: ' + error.message);
  }
});



