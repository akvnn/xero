import express from 'express'
import path from 'path'
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb'
import { fileURLToPath } from 'url'
import { createServer } from 'http'
// import cors from 'cors'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
// import fs from 'fs'
import mongoDBCredentials from './passwords.js' // import mongodb credentials from passwords.js (not included in repo for security reasons)
const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
}) // WebSocket server alongside the regular Express server

const __dirname = path.dirname(fileURLToPath(import.meta.url))
app.use(express.static(path.join(__dirname, 'public')))
// app.use(cors())
// mongodb
const uri = mongoDBCredentials
let mongoDBConnection = false
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect()
    console.log('Connected to MongoDB')
    mongoDBConnection = true
  } catch (err) {
    console.log('Failed to connect to MongoDB' + err)
    mongoDBConnection = false
  }
}
const db = client.db('x')
const collection = db.collection('users')
const tweetCollection = db.collection('tweets')
const messageCollection = db.collection('messages')
run().catch(console.dir)
//end of mongodb

// mongodb functions
const findUser = async (username) => {
  const result = await collection.findOne({ username: username })
  return result
}
const findEmail = async (email) => {
  const result = await collection.findOne({ email: email })
  return result
}
// end of mongodb functions
// middlewares
app.use(express.json())
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization']
  if (!bearerHeader) {
    res.status(403).send('Forbidden')
    return
  }
  const [scheme, token] = bearerHeader.split(' ')
  if (scheme !== 'Bearer' || !token) {
    res
      .status(401)
      .json({ status: false, message: 'Access denied. Invalid token.' })
    return
  }
  try {
    const decoded = jwt.verify(token, 'someSecretKey')
    req.userId = decoded.id
    next()
  } catch (error) {
    res
      .status(401)
      .json({ status: false, message: 'Access denied. Invalid token.' })
  }
}
// end of middlewares
//------------------------
app.get(
  '/profile/:username',
  /*verifyToken,*/ (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'))
  }
)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'))
})
app.get('/settings', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'))
})
app.post('/signup', async (req, res) => {
  const fullName = req.body.fullName
  const email = req.body.email
  const password = req.body.password
  const username = req.body.username
  const findUserx = await findUser(username)
  const findEmailx = await findEmail(email)
  if (findUserx) {
    res.status(400).json({ status: false, message: 'User already exists' })
    return
  }
  if (findEmailx) {
    res.status(400).json({ status: false, message: 'Email already exists' })
    return
  }
  if (password.length < 8) {
    res.status(400).json({
      status: false,
      message: 'Password must be at least 8 characters',
    })
    return
  }
  const specialCharacters = '/*&^%$# \\'
  for (let i = 0; i < specialCharacters.length; i++) {
    if (username.includes(specialCharacters[i])) {
      res.status(400).json({
        status: false,
        message: 'Username cannot contain special characters or whitespace',
      })
      return
    }
  }
  const user = {
    fullName: fullName,
    email: email,
    password: password,
    username: username,
    phoneNumber: 'null',
    following: [],
    followers: [],
    tweetCount: 0,
    bio: '',
    profilePicture:
      'https://i.pinimg.com/474x/65/25/a0/6525a08f1df98a2e3a545fe2ace4be47.jpg',
    coverPicture: 'https://i.imgflip.com/5an5fg.jpg?a469824',
    likedTweets: [],
    retweetedTweets: [],
    savedTweets: [],
    createdAt: String(new Date()),
    createdAtISO: new Date().toISOString(),
    lastLogin: String(new Date()),
    verified: false,
  }
  await collection.insertOne(user, (err, result) => {
    if (err) {
      res
        .status(400)
        .json({ status: false, message: 'Failed to add user to database' })
      throw err
    }
  })
  res.status(200).json({ status: true, message: 'Signed Up Successfully' })
})
app.post('/login', async (req, res) => {
  const usernameOremailOrphone = req.body.usernameOremailOrphone
  const password = req.body.password
  const user = await collection.findOne(
    {
      $or: [
        { username: usernameOremailOrphone, password: password },
        { email: usernameOremailOrphone, password: password },
        { phoneNumber: usernameOremailOrphone, password: password },
      ],
    },
    (err, result) => {
      if (err) {
        res.status(400).json({ status: false, message: 'Invalid Credentials' })
        throw err
      }
      return result
    }
  )
  if (!user) {
    res.status(400).json({ status: false, message: 'Invalid Credentials' })
    return
  }
  const token = jwt.sign({ id: user._id }, 'someSecretKey')
  res
    .status(200)
    .json({ status: true, message: 'Login Successful', token: token })
})

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'))
})
app.get('/messages', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'))
})
app.get(
  '/messages/:username',
  /*verifyToken,*/ (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'))
  }
)
app.get('/getTweets', verifyToken, async (req, res) => {
  try {
    const userId = req.userId // from verifyToken middleware
    const user = await collection.findOne({ _id: new ObjectId(userId) })
    if (!user) {
      res.status(400).json({ status: false, message: 'User not found' })
      return
    }
    const following = user.following
    const tweets = await tweetCollection

      .aggregate([
        {
          $match: {
            $or: [
              { createdBy: { $in: following }, type: 'main' }, // Tweets created by users in following array
              { createdBy: userId, type: 'main' }, // Tweets created by the same user
            ],
          },
        },
        {
          $addFields: {
            datetime: { $toDate: '$createdAtISO' },
          },
        },
        {
          $sort: { datetime: -1 },
        },
        {
          $limit: 100,
        },
        {
          $lookup: {
            from: 'users',
            localField: 'createdByObjectId',
            foreignField: '_id',
            as: 'userDetails',
          },
        },
        {
          $unwind: '$userDetails',
        },
        {
          $project: {
            _id: 1,
            createdBy: 1,
            content: 1,
            createdAt: 1,
            createdAtISO: 1,
            type: 1,
            commentTo: 1,
            likes: 1,
            retweets: 1,
            comments: 1,
            userDetails: {
              fullName: 1,
              username: 1,
              profilePicture: 1,
              _id: 1,
            },
          },
        },
      ])
      .toArray()
    // get 3 random users
    const randomUsers = await collection
      .aggregate([
        {
          $match: {
            _id: { $nin: following },
          },
        },
        {
          $sample: { size: 3 },
        },
        {
          $project: {
            _id: 1,
            fullName: 1,
            username: 1,
            profilePicture: 1,
          },
        },
      ])
      .toArray()

    res.status(200).json({
      status: true,
      tweets: tweets,
      profile: {
        fullName: user.fullName,
        username: user.username,
        profilePicture: user.profilePicture,
        _id: user._id,
      },
      randomUsers: randomUsers,
    })
  } catch (err) {
    res
      .status(400)
      .json({ status: false, message: err + ' Failed to get tweets' })
    return
  }
})
app.get('/getTweetComments/:tweetId', verifyToken, async (req, res) => {
  try {
    const tweetId = req.params.tweetId
    const tweet = await tweetCollection.findOne({ _id: new ObjectId(tweetId) })
    if (!tweet) {
      res.status(400).json({ status: false, message: 'Tweet not found' })
      return
    }
    const comments = await tweetCollection
      .aggregate([
        {
          $match: {
            commentTo: tweetId,
            type: 'comment',
          },
        },
        {
          $addFields: {
            datetime: { $toDate: '$createdAtISO' },
          },
        },
        {
          $sort: { datetime: -1 },
        },
        {
          $limit: 20,
        },
        {
          $lookup: {
            from: 'users',
            localField: 'createdByObjectId',
            foreignField: '_id',
            as: 'userDetails',
          },
        },
        {
          $unwind: '$userDetails',
        },
        {
          $project: {
            _id: 1,
            createdBy: 1,
            content: 1,
            createdAt: 1,
            createdAtISO: 1,
            type: 1,
            commentTo: 1,
            likes: 1,
            retweets: 1,
            comments: 1,
            userDetails: {
              fullName: 1,
              username: 1,
              profilePicture: 1,
              _id: 1,
            },
          },
        },
      ])
      .toArray()
    res.status(200).json({ status: true, tweets: comments })
  } catch (err) {
    res
      .status(400)
      .json({ status: false, message: err + ' Failed to get comments' })
    return
  }
})
app.get('/getSpecificMesssages/:username', verifyToken, async (req, res) => {
  try {
    const userId = req.userId
    const username = req.params.username
    const user = await collection.findOne({ username: username })
    const currentUser = await collection.findOne({
      _id: new ObjectId(userId),
    })
    const stringUserId = String(user._id)
    if (!user) {
      res.status(400).json({ status: false, message: 'User not found' })
      return
    }
    const messages = await messageCollection
      .aggregate([
        {
          $match: {
            $or: [
              { to: userId, from: stringUserId },
              { to: stringUserId, from: userId },
            ],
          },
        },
        {
          $addFields: {
            datetime: { $toDate: '$createdAtISO' },
          },
        },
        {
          $sort: { datetime: -1 },
        },
        // {
        //   $limit: 20,
        // },
        // {
        //   $addFields: {
        //     idObject: {
        //       $cond: [{ $eq: ['$to', userId] }, '$from', '$to'], // if to is equal to userId, then return from, else return to
        //     },
        //   },
        // },
        // {
        //   $lookup: {
        //     from: 'users',
        //     localField: 'idObject',
        //     foreignField: '_id',
        //     as: 'userDetails',
        //   },
        // },
        // {
        //   $unwind: '$userDetails',
        // },
        {
          $project: {
            _id: 1,
            to: 1,
            from: 1,
            content: 1,
            createdAt: 1,
            createdAtISO: 1,
          },
        },
      ])
      .toArray()
    res.status(200).json({
      status: true,
      messages: messages,
      profile: {
        fullName: currentUser.fullName,
        username: currentUser.username,
        profilePicture: currentUser.profilePicture,
        _id: currentUser._id,
      },
      targetedProfile: {
        fullName: user.fullName,
        username: user.username,
        profilePicture: user.profilePicture,
        _id: user._id,
      },
    })
  } catch (err) {
    res
      .status(400)
      .json({ status: false, message: err + ' Failed to get messages' })
    console.log(err)
  }
})
app.get('/getProfile/:username', verifyToken, async (req, res) => {
  const userId = req.userId
  const username = req.params.username
  const currentUser = await collection.findOne({
    _id: new ObjectId(userId),
  })
  const user = await collection.findOne({ username: username })
  if (!user) {
    res.status(400).json({ status: false, message: 'User not found' })
    return
  }
  const tweets = await tweetCollection
    .aggregate([
      {
        $match: {
          $or: [
            { createdByObjectId: user._id, type: 'main' },
            { retweets: String(user._id) },
          ],
        },
      },
      {
        $addFields: {
          datetime: { $toDate: '$createdAtISO' },
        },
      },
      {
        $sort: { datetime: -1 },
      },
      {
        $limit: 20,
      },
      {
        $lookup: {
          from: 'users',
          localField: 'createdByObjectId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: '$userDetails',
      },
      {
        $project: {
          _id: 1,
          createdBy: 1,
          content: 1,
          createdAt: 1,
          createdAtISO: 1,
          type: 1,
          commentTo: 1,
          likes: 1,
          retweets: 1,
          comments: 1,
          userDetails: {
            fullName: 1,
            username: 1,
            profilePicture: 1,
            _id: 1,
          },
        },
      },
    ])
    .toArray()
  const sameUser = userId == user._id
  let isFollowing = false
  if (!sameUser) {
    isFollowing = currentUser.following.includes(String(user._id))
    // console.log(isFollowing)
  }
  // get 3 random users
  const following = currentUser.following
  const randomUsers = await collection
    .aggregate([
      {
        $match: {
          _id: { $nin: following },
        },
      },
      {
        $sample: { size: 3 },
      },
      {
        $project: {
          _id: 1,
          fullName: 1,
          username: 1,
          profilePicture: 1,
        },
      },
    ])
    .toArray()
  res.status(200).json({
    status: true,
    tweets: tweets,
    profile: {
      fullName: currentUser.fullName,
      username: currentUser.username,
      profilePicture: currentUser.profilePicture,
      _id: currentUser._id,
    },
    targetedProfile: {
      fullName: user.fullName,
      username: user.username,
      profilePicture: user.profilePicture,
      profileBanner: user.coverPicture,
      bio: user.bio,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      tweetCount: user.tweetCount,
      _id: user._id,
      sameUser: sameUser,
      isFollowing: isFollowing,
    },
    randomUsers: randomUsers,
  })
})
app.get('/getProfileReplies/:username', verifyToken, async (req, res) => {
  // const userId = req.userId
  const username = req.params.username
  const user = await collection.findOne({ username: username })
  if (!user) {
    res.status(400).json({ status: false, message: 'User not found' })
    return
  }
  const tweets = await tweetCollection
    .aggregate([
      {
        $match: {
          createdByObjectId: user._id,
          type: 'comment',
        },
      },
      {
        $addFields: {
          datetime: { $toDate: '$createdAtISO' },
        },
      },
      {
        $sort: { datetime: -1 },
      },
      {
        $limit: 20,
      },
      {
        $lookup: {
          from: 'users',
          localField: 'createdByObjectId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: '$userDetails',
      },
      {
        $project: {
          _id: 1,
          createdBy: 1,
          content: 1,
          createdAt: 1,
          createdAtISO: 1,
          type: 1,
          commentTo: 1,
          likes: 1,
          retweets: 1,
          comments: 1,
          userDetails: {
            fullName: 1,
            username: 1,
            profilePicture: 1,
            _id: 1,
          },
        },
      },
    ])
    .toArray()
  res.status(200).json({
    status: true,
    tweets: tweets,
  })
})
app.get('/getProfileLikes/:username', verifyToken, async (req, res) => {
  // const userId = req.userId
  const username = req.params.username
  const user = await collection.findOne({ username: username })
  if (!user) {
    res.status(400).json({ status: false, message: 'User not found' })
    return
  }
  const tweets = await tweetCollection
    .aggregate([
      {
        $match: {
          likes: String(user._id),
        },
      },
      {
        $addFields: {
          datetime: { $toDate: '$createdAtISO' },
        },
      },
      {
        $sort: { datetime: -1 },
      },
      {
        $limit: 20,
      },
      // {
      //   $addFields: {
      //     createdByObjectId: { $toObjectId: '$createdBy' },
      //   },
      // },
      {
        $lookup: {
          from: 'users',
          localField: 'createdByObjectId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: '$userDetails',
      },
      {
        $project: {
          _id: 1,
          createdBy: 1,
          content: 1,
          createdAt: 1,
          createdAtISO: 1,
          type: 1,
          commentTo: 1,
          likes: 1,
          retweets: 1,
          comments: 1,
          userDetails: {
            fullName: 1,
            username: 1,
            profilePicture: 1,
            _id: 1,
          },
        },
      },
    ])
    .toArray()
  res.status(200).json({
    status: true,
    tweets: tweets,
  })
})
app.get('/getMessages', verifyToken, async (req, res) => {
  const userId = req.userId
  const user = await collection.findOne({ _id: new ObjectId(userId) })
  if (!user) {
    //not needed
    res.status(400).json({ status: false, message: 'User not found' })
    return
  }
  const messages = await messageCollection
    .aggregate([
      {
        $match: {
          $or: [{ to: userId }, { from: userId }],
        },
      },
      {
        $addFields: {
          datetime: { $toDate: '$createdAtISO' },
        },
      },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ['$to', userId] }, '$from', '$to'], // if to is equal to userId, then return from, else return to
          },
          messages: {
            $push: '$$ROOT',
          },
          maxDatetime: {
            $max: '$datetime',
          },
        },
      },
      {
        $sort: { maxDatetime: -1 }, // Sort conversations by maxDatetime
      },
      {
        $limit: 50, //50 conversations
      },
      {
        $addFields: {
          idObject: { $toObjectId: '$_id' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'idObject',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: '$userDetails',
      },
      {
        $project: {
          _id: 1,
          messages: 1,
          userDetails: {
            fullName: 1,
            username: 1,
            profilePicture: 1,
            _id: 1,
          },
        },
      },
    ])
    .toArray()

  // Sort the messages within each conversation in your application code
  messages.forEach((conversation) => {
    conversation.messages = conversation.messages.sort(
      (a, b) => new Date(b.createdAtISO) - new Date(a.createdAtISO)
    )
  })
  // who To follow
  const following = user.following
  // get 3 random users
  const randomUsers = await collection
    .aggregate([
      {
        $match: {
          _id: { $nin: following },
        },
      },
      {
        $sample: { size: 3 },
      },
      {
        $project: {
          _id: 1,
          fullName: 1,
          username: 1,
          profilePicture: 1,
        },
      },
    ])
    .toArray()
  res.status(200).json({
    status: true,
    messages: messages,
    profile: {
      fullName: user.fullName,
      username: user.username,
      profilePicture: user.profilePicture,
      _id: user._id,
    },
    randomUsers: randomUsers,
  })
})

app.post('/sendMessage', verifyToken, async (req, res) => {
  try {
    const userId = req.userId
    const to = req.body.to
    if (userId == to) {
      res.status(400).json({
        status: false,
        message: 'You cannot send a message to yourself',
      })
      return
    }
    const content = req.body.content

    const user = await collection.findOne({ _id: new ObjectId(userId) })
    if (!user) {
      //not needed
      res.status(400).json({ status: false, message: 'User not found' })
    }
    const userTo = await collection.findOne({ _id: new ObjectId(to) })
    if (!userTo) {
      //not needed
      res.status(400).json({ status: false, message: 'User not found' })
    }
    let message = {
      to: to, // might change to ObjectId
      from: userId,
      content: content,
      createdAt: String(new Date()),
      createdAtISO: new Date().toISOString(),
    }
    await messageCollection.insertOne(message)
    // add profile info to message before emitting it
    message = {
      ...message,
      fromProfile: {
        fullName: user.fullName,
        username: user.username,
        profilePicture: user.profilePicture,
      },
    }
    // socket.io
    io.to(`user:${to}`).emit('newMessage', message)
    // end of socket.io
    res.status(200).json({ status: true, message: 'Message sent successfully' })
  } catch (err) {
    res
      .status(400)
      .json({ status: false, message: err + ' Failed to send message' })
  }
})
app.post('/postTweet', verifyToken, async (req, res) => {
  try {
    const userId = req.userId
    const content = req.body.content
    const user = await collection.findOne({ _id: new ObjectId(userId) })
    if (!user) {
      res.status(400).json({ status: false, message: 'User not found' })
      return
    }
    const tweet = {
      createdBy: userId,
      createdByObjectId: new ObjectId(userId),
      content: content,
      type: 'main',
      commentTo: 'null',
      createdAt: String(new Date()),
      createdAtISO: new Date().toISOString(),
      likes: [],
      retweets: [],
      comments: [],
    }
    await tweetCollection.insertOne(tweet)
    // increment tweetCount
    await collection.updateOne(
      { _id: new ObjectId(userId) },
      { $inc: { tweetCount: 1 } }
    )
    const aggregatedTweet = await tweetCollection //for consistency
      .aggregate([
        {
          $match: {
            _id: tweet._id,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'createdByObjectId',
            foreignField: '_id',
            as: 'userDetails',
          },
        },
        {
          $unwind: '$userDetails',
        },
        {
          $project: {
            _id: 1,
            createdBy: 1,
            content: 1,
            createdAt: 1,
            createdAtISO: 1,
            type: 1,
            commentTo: 1,
            likes: 1,
            retweets: 1,
            comments: 1,
            userDetails: {
              fullName: 1,
              username: 1,
              profilePicture: 1,
              _id: 1,
            },
          },
        },
      ])
      .toArray()
    // socket.io
    io.to(`followers:${String(userId)}`).emit('newTweet', aggregatedTweet[0])
    // end of socket.io
    res.status(200).json({
      status: true,
      message: 'Posted successfully',
      tweet: aggregatedTweet[0],
    })
  } catch (err) {
    res
      .status(400)
      .json({ status: false, message: err + ' Failed to post tweet' })
    return
  }
})
app.post('/postComment', verifyToken, async (req, res) => {
  const userId = req.userId
  const content = req.body.content
  const commentToTweet = req.body.tweetId
  const user = await collection.findOne({ _id: new ObjectId(userId) })
  if (!user) {
    res.status(400).json({ status: false, message: 'User not found' })
    return
  }
  const tweet = {
    createdBy: userId,
    createdByObjectId: new ObjectId(userId),
    content: content,
    type: 'comment',
    commentTo: commentToTweet,
    createdAt: String(new Date()),
    likes: [],
    retweets: [],
    comments: [],
  }
  await tweetCollection.insertOne(tweet)
  // increment tweetCount
  await collection.updateOne(
    { _id: new ObjectId(userId) },
    { $inc: { tweetCount: 1 } }
  )
  // increment commentCount
  await tweetCollection.updateOne(
    { _id: new ObjectId(commentToTweet) },
    { $inc: { commentCount: 1 } }
  )
  // add ID in comments array of tweet
  await tweetCollection.updateOne(
    { _id: new ObjectId(commentToTweet) },
    { $push: { comments: tweet._id } }
  )
  const aggregatedTweet = await tweetCollection
    .aggregate([
      {
        $match: {
          _id: tweet._id,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'createdByObjectId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: '$userDetails',
      },
      {
        $project: {
          _id: 1,
          createdBy: 1,
          content: 1,
          createdAt: 1,
          createdAtISO: 1,
          type: 1,
          commentTo: 1,
          likes: 1,
          retweets: 1,
          comments: 1,
          userDetails: {
            fullName: 1,
            username: 1,
            profilePicture: 1,
            _id: 1,
          },
        },
      },
    ])
    .toArray()
  res.status(200).json({
    status: true,
    message: 'Posted successfully',
    tweet: aggregatedTweet[0],
  })
})
app.post('/retweetOrLike', verifyToken, async (req, res) => {
  const userId = req.userId
  const tweetId = req.body.tweetId
  const type = req.body.type
  const action = req.body.action
  const user = await collection.findOne({ _id: new ObjectId(userId) })
  if (!user) {
    res.status(400).json({ status: false, message: 'User not found' })
    return
  }
  const tweet = await tweetCollection.findOne({
    _id: new ObjectId(tweetId),
  })
  if (!tweet) {
    res.status(400).json({ status: false, message: 'Tweet not found' })
    return
  }
  if (type === 'retweet') {
    if (action === 'do') {
      // make sure that user has not retweeted the tweet before retweeting
      if (
        tweet.retweets.includes(userId) ||
        user.retweetedTweets.includes(tweetId)
      ) {
        res.status(400).json({
          status: false,
          message: 'You have already retweeted this tweet',
        })
        return
      }
      await tweetCollection.updateOne(
        { _id: new ObjectId(tweetId) },
        {
          $push: { retweets: userId },
        }
      )
      await collection.updateOne(
        { _id: new ObjectId(userId) },
        {
          $push: { retweetedTweets: tweetId },
        }
      )
    } else {
      // make sure that user has retweeted the tweet before unretweeting
      if (
        !tweet.retweets.includes(userId) ||
        !user.retweetedTweets.includes(tweetId)
      ) {
        res.status(400).json({
          status: false,
          message: 'You have not retweeted this tweet',
        })
        return
      }
      await tweetCollection.updateOne(
        { _id: new ObjectId(tweetId) },
        {
          $pull: { retweets: userId },
        }
      )
      await collection.updateOne(
        { _id: new ObjectId(userId) },
        {
          $pull: { retweetedTweets: tweetId },
        }
      )
    }
  } else if (type === 'like') {
    if (action === 'do') {
      // make sure that user has not liked the tweet before liking
      if (tweet.likes.includes(userId) || user.likedTweets.includes(tweetId)) {
        res.status(400).json({
          status: false,
          message: 'You have already liked this tweet',
        })
        return
      }
      await tweetCollection.updateOne(
        { _id: new ObjectId(tweetId) },
        {
          $push: { likes: userId },
        }
      )
      await collection.updateOne(
        { _id: new ObjectId(userId) },
        {
          $push: { likedTweets: tweetId },
        }
      )
    } else {
      // make sure that user has liked the tweet before unliking
      if (
        !tweet.likes.includes(userId) ||
        !user.likedTweets.includes(tweetId)
      ) {
        res.status(400).json({
          status: false,
          message: 'You have not liked this tweet',
        })
        return
      }
      await tweetCollection.updateOne(
        { _id: new ObjectId(tweetId) },
        {
          $pull: { likes: userId },
        }
      )
      await collection.updateOne(
        { _id: new ObjectId(userId) },
        {
          $pull: { likedTweets: tweetId },
        }
      )
    }
  }
  res.status(200).json({ status: true, message: 'Success' })
})
app.post('/followOrUnfollow/:username', verifyToken, async (req, res) => {
  const userId = req.userId
  const username = req.params.username
  const action = req.body.action
  const user = await collection.findOne({ username: username })
  const currentUser = await collection.findOne({ _id: new ObjectId(userId) })
  if (!user || !currentUser) {
    res.status(400).json({ status: false, message: 'User not found' })
    return
  }
  if (user._id == userId) {
    res
      .status(400)
      .json({ status: false, message: 'You cannot follow yourself' })
    return
  }

  if (action === 'Follow') {
    if (
      currentUser.following.includes(
        String(user._id) || user.followers.includes(userId) //can be && instead of ||
      )
    ) {
      res
        .status(400)
        .json({ status: false, message: 'You are already following this user' })
      return
    }
    await collection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $push: { following: String(user._id) },
      }
    )
    await collection.updateOne(
      { _id: new ObjectId(user._id) },
      {
        $push: { followers: userId },
      }
    )
    // socket.io .. join followers room
    // socket.join(`followers:${String(user._id)}`) //to fix
  } else {
    if (
      !currentUser.following.includes(
        String(user._id) || !user.followers.includes(userId) //can be && instead of ||
      )
    ) {
      res.status(400).json({
        status: false,
        message: 'You are already not following this user',
      })
      return
    }
    await collection.updateOne(
      { _id: new ObjectId(userId) },
      {
        $pull: { following: String(user._id) },
      }
    )
    await collection.updateOne(
      { _id: new ObjectId(user._id) },
      {
        $pull: { followers: userId },
      }
    )
    // socket.io .. leave followers room
    // socket.leave(`followers:${String(user._id)}`) //to fix
  }
  res.status(200).json({ status: true, message: 'Success' })
})
app.post('/search', verifyToken, async (req, res) => {
  const userId = req.userId
  const query = req.body.query.replace('@', '')
  const user = await collection.findOne({ _id: new ObjectId(userId) })
  if (!user) {
    //not needed
    res.status(400).json({ status: false, message: 'User not found' })
    return
  }
  const users = await collection
    .aggregate([
      {
        $match: {
          $or: [
            { fullName: { $regex: query, $options: 'i' } }, // case insensitive in the regex search
            { username: { $regex: query, $options: 'i' } },
          ],
          _id: { $nin: [user._id] }, // exclude current user
        },
      },
      {
        $addFields: {
          datetime: { $toDate: '$createdAtISO' },
        },
      },
      {
        $sort: { datetime: -1 },
      },
      {
        $limit: 20,
      },
      {
        $project: {
          _id: 1,
          fullName: 1,
          username: 1,
          profilePicture: 1,
        },
      },
    ])
    .toArray()
  res.status(200).json({
    status: true,
    users: users,
  })
})
app.post('/editProfile', verifyToken, async (req, res) => {
  const userId = req.userId
  const fullName = req.body.fullName
  const username = req.body.username
  const bio = req.body.bio
  const profilePicture = req.body.profilePicture
  const coverPicture = req.body.coverPicture
  const user = await collection.findOne({ _id: new ObjectId(userId) })
  if (!user) {
    //not needed
    res.status(200).json({ status: true, message: 'User not found' }) //change to 400 & true later
    return
  }
  if (user.username == 'dd') {
    res
      .status(401)
      .json({ status: false, message: 'Cannot edit profile for demo user' })
    return
  }
  //check if username is taken
  const usernameCheck = await collection.findOne({ username: username })
  if (usernameCheck && String(usernameCheck._id) != userId) {
    res.status(400).json({ status: false, message: 'Username is taken' })
    return
  }
  const specialCharacters = '/*&^%$# \\'
  for (let i = 0; i < specialCharacters.length; i++) {
    if (username.includes(specialCharacters[i])) {
      res.status(400).json({
        status: false,
        message: 'Username cannot contain special characters or whitespace',
      })
      return
    }
  }
  await collection.updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        fullName: fullName,
        username: username,
        bio: bio,
        profilePicture: profilePicture,
        coverPicture: coverPicture,
      },
    }
  )
  res.status(200).json({
    status: true,
    message: 'Profile updated successfully',
  })
})
app.post('/changePassword', verifyToken, async (req, res) => {
  const userId = req.userId
  const oldPassword = req.body.oldPassword
  const newPassword = req.body.newPassword
  const user = await collection.findOne({ _id: new ObjectId(userId) })
  if (!user) {
    //not needed
    res.status(400).json({ status: false, message: 'User not found' })
    return
  }
  if (user.username == 'dd') {
    res
      .status(401)
      .json({ status: false, message: 'Cannot change password for demo user' })
    return
  }
  const isMatch = oldPassword === user.password //possible improvement: add hashing
  if (!isMatch) {
    res.status(400).json({ status: false, message: 'Wrong password' })
    return
  }
  if (newPassword.length < 8) {
    res.status(400).json({
      status: false,
      message: 'Password must be at least 8 characters',
    })
    return
  }
  await collection.updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        password: newPassword,
      },
    }
  )
  res.status(200).json({
    status: true,
    message: 'Password changed successfully',
  })
})
app.get('/getNavProfile', verifyToken, async (req, res) => {
  const userId = req.userId
  const user = await collection.findOne({ _id: new ObjectId(userId) })
  if (!user) {
    //not needed
    res.status(400).json({ status: false, message: 'User not found' })
    return
  }
  // get 3 random users
  const following = user.following
  const randomUsers = await collection
    .aggregate([
      {
        $match: {
          _id: { $nin: following },
        },
      },
      {
        $sample: { size: 3 },
      },
      {
        $project: {
          _id: 1,
          fullName: 1,
          username: 1,
          profilePicture: 1,
        },
      },
    ])
    .toArray()
  res.status(200).json({
    status: true,
    profile: {
      fullName: user.fullName,
      username: user.username,
      profilePicture: user.profilePicture,
      _id: user._id,
    },
    randomUsers: randomUsers,
  })
})
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'lost.html'))
})
// -------------------
// Socket.io
// -------------------
io.on('connection', (socket) => {
  try {
    const token = socket.handshake.query.token
    if (!token) {
      socket.disconnect()
      return
    }
    const decoded = jwt.verify(token, 'someSecretKey')
    if (!decoded) {
      socket.disconnect()
      return
    }
    const userId = decoded.id
    socket.join(`user:${userId}`)
    console.log(`user:${userId} connected`)

    socket.on('disconnect', () => {
      console.log(`user:${userId} disconnected`)
    })
  } catch (err) {
    console.log(err)
  }
})
// Listening
httpServer.listen(3000, () => {
  console.log('Server is listening on port 3000')
})

// Some ESM Pointers
// need to use the .mjs extension specifically for the entry point file (usually the main script file) to indicate that it is an ECMAScript module (hence, app.mjs)
// For CommonJS files that should be used with ESM modules, use the .cjs extension
