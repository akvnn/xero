// handle socket.io
const socket = io({
  query: { token: getCookie('token') },
})

socket.on('connect', () => {
  console.log('connected')
})
socket.on('newTweet', (tweet) => {
  // check what page we are on
  const url = window.location.href
  const urlSplit = url.split('/')
  const page = urlSplit[3]
  if (page == 'home') {
    // add tweet div for followers
    console.log(tweet)
    const tweetsContainer = document.getElementById('tweets')
    const tweetDiv = createTweet(tweet)
    tweetsContainer.prepend(tweetDiv)
    tweetDiv.classList.add('newTweet') // add new tweet style (background color)
    setTimeout(() => {
      tweetDiv.classList.remove('newTweet')
    }, 10000)
  } else {
    //do nothing for now
  }
})
socket.on('newMessage', (message) => {
  // check what page we are on
  const url = window.location.href
  const urlSplit = url.split('/')
  const page = urlSplit[3]
  const messagesDetails = document.getElementById('messagesDetails')
  if (
    page == 'messages' &&
    messagesDetails.classList.contains('messagesDetails')
  ) {
    const messageDetailsMessages = document.getElementById(
      'messageDetailsMessages'
    )
    const messageDetailsMessage = document.createElement('div')
    messageDetailsMessage.classList.add('messageDetailsMessage')
    const messageDetailsMessageText = document.createElement('p')
    messageDetailsMessageText.classList.add('messageDetailsMessageText')
    messageDetailsMessageText.innerText = message.content
    const messageDetailsMessageTime = document.createElement('p')
    messageDetailsMessageTime.classList.add('messageDetailsMessageTime')
    const date = new Date()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    messageDetailsMessageTime.innerText =
      day + '/' + month + ' ' + hour + ':' + minute
    messageDetailsMessage.appendChild(messageDetailsMessageText)
    messageDetailsMessage.appendChild(messageDetailsMessageTime)
    messageDetailsMessages.appendChild(messageDetailsMessage)
    messageDetailsMessage.scrollIntoView() // scroll to bottom
  } else if (page == 'messages') {
    //change the lastMessage
    const lastMessage = document.querySelector(
      `[dataUserId="${message.from}"] p.lastMessage`
    )
    lastMessage.innerHTML = message.content
  } else {
    //do nothing for now
  }
})
