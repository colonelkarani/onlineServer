const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const port = 3000;
const dotenv = require('dotenv');
dotenv.config();
const URI = process.env.URI;
const PORT = process.env.PORT || port;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });
app.post('/post', (req, res) => {
  const { title, content, isActive, comments } = req.body;
  const notesModel = mongoose.model("Notes", notesSchema);
  const notes = new notesModel({
    title,
    content,
    isActive,
    comments,
  });
  notes.save()
    .then(() => res.status(201).send('Note saved'))
    .catch(err => res.status(400).send('Error saving note:', err));
});

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Connection error:', err));

const movieSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  ratings: { type: Number, required: true, min: 1, max: 5 },
  money: {
    type: mongoose.Decimal128,
    required: true,
  },
  genre: { type: [String] },
  isActive: { type: Boolean },
  comments: [{
    value: { type: String }
  }]
});

const notesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  comments: [{
    value: { type: String }
  }]
});
const notesModel = mongoose.model("Notes", notesSchema);
const notes = new notesModel({
  title: "Victor",
  content: "Are you eally what you say you are?",
  isActive: false,
  comments: [{ value: "This is a comment" }],
});
// notes.save()
//   .then(() => console.log('Note saved'))
//   .catch(err => console.error('Error saving note:', err));

notesModel.find()
  .then((notes) => {
   app.get('/', (req, res) => {
      res.send(`
        <h1>Notes</h1>
        <ul>
          ${notes.map(note => `<li>${note.title}: ${note.content}</li>`).join('')}
        </ul>
      `);
});
  })
  .catch(err => console.error('Error fetching notes:', err));
  // notesModel.deleteOne({ title: "Test" })
  // .then(() => console.log('Note deleted'))
//   notesModel.findOneAndUpdate(
//   { title: "Victor" },
//   { $set: {  content: "Yes Iam WHo I Say I Am" } },
//   { new: true } 
// ).then((notes) => {
//   console.log("Updated note:", notes);
// }).catch(err => console.error('Error updating note:', err));

notesModel.insertMany([
  { title: "Test", content: "This is a test note", isActive: true, comments: [{ value: "Test comment" }] },
  { title: "Another Test", content: "This is another test note", isActive: false, comments: [{ value: "Another test comment" }] }
]).then(() => {
  console.log('Multiple notes saved');
}).catch(err => console.error('Error saving multiple notes:', err));

const MovieModel = mongoose.model("Movie", movieSchema);

const createDoc = async () => {
  try {
    const m1 = new MovieModel({
      name: "TEstin 1 2 1 2",
      ratings: 4,
      money: mongoose.Types.Decimal128.fromString("60000"),
      genre: ["action", "adventure"],
      isActive: true,
      comments: [{ value: "Threat was a very amazing movie" }],
    });

    const result = await m1.save();
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};


