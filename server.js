import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import cardsData from './Data/cards.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/blue"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Card = mongoose.model('Card', {
  cardID: {
    type: Number
  },

  header: {
    type: String
  },

  title: {
    type: String
  },

  image: {
    type: String
  },

  image_by: {
    type: String
  },

  thought: {
    type: String
  },

  info_link: {
    type: String
  },

  language_code: {
    type: String
  },

  hearts: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: () => new Date
  }
})

//When the server runs with RESET_DATABASE=true npm run dev -> it will reset the database, reload MongoDB compass.
//When the server runs with npm run dev, no updates are accepted to the server. 

if (process.env.RESET_DATABASE) {
  console.log('Resetting database!')

  const seedDatabase = async () => {
    await Card.deleteMany()


    const addCardsToDatabase = () => {
      cardsData.forEach((card) => {
        new Card(card).save()
      })
    }
    addCardsToDatabase()
    //This adds a new collection of cards.
  }
  seedDatabase()
}


// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

//Service unavailable

// app.use((req, res, next) => {
//   if (mongoose.connection.readystate === 1) {
//     next()
//   } else {
//     res.status(503).json({ error: 'service unavailable' })
//   }
// })

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world - we as planet stewards take care of your environment')
})

// GET All the cards

app.get('/cards', async (req, res) => {
  const cards = await Card.find()
  res.json(cards)
})

// GET the card
app.get('/cards/:cardID', (req, res) => {
  const cardID = req.params.cardID
  Card.findOne({ 'cardID': cardID })
    .then((results) => {
      res.json(results)
    }).catch((err) => {
      res.json({ message: 'Cannot find this card', err: err })
    })
})

// POST likes of the card 

app.post('/:cardID/like', async (req, res) => {
  const { cardID } = req.params;
  //console.log(`POST /${_id}/like`)

  try {
    const updated = await Card.updateOne({ 'cardID': cardID }, { '$inc': { 'hearts': 1 } })
    // Success 
    res.status(201).json(updated)
    // Failure to count
  } catch (err) {
    res.status(400).json({ message: 'We could not register your heart', error: err.errors })
  }
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
