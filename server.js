import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import cardsData from './data/cards.json'


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

  fact: {
    type: String
  },

  info_link: {
    type: String
  },

  book_tip: {
    type: String
  },

  language_code: {
    type: String
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

// {
//   "cardID": 8,
//   "title": "Pick up plastic garbage at the beach",
//   "fact": "",
//   "info_link": "",
//   "book_tip": "",
//   "language_code": "eng"
// }
// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

// app.get('/cards', (req, res) => {
//   res.json(cardsData)
// })

app.get('/cards', async (req, res) => {
  const cards = await Card.find()
  res.json(cards)
})

// app.get('/cards:cardID', async (req, res) => {
//   const cardID = req.params.cardID
//  Card.findOne({ 'cardID': cardID })
//   if (findThatCard) {
//     res.json(findThatCard)
//   } else {
//     res.status(404).send('There was no card with that id')
//   }
// })
app.get('/cards/:cardID', (req, res) => {
  const cardID = req.params.cardID
  Card.findOne({ 'cardID': cardID })
    .then((results) => {
      res.json(results)
    }).catch((err) => {
      res.json({ message: 'Cannot find this card', err: err })
    })
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
