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
    const currentMessageProfileId = messagesDetails
      .querySelector('.messageDetails')
      .getAttribute('id')
    if (message.from != currentMessageProfileId) {
      // if the message is not from the user currently in view
      return
    }
    const messageDetailsMessages = messagesDetails.querySelector(
      '#messageDetailsMessages'
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
    if (lastMessage != null) {
      lastMessage.innerText = message.content
    } else {
      //create messageProfile from the user if its the first message
      const messageProfile = document.createElement('div')
      messageProfile.classList.add('messageProfile')
      messageProfile.setAttribute('dataUserId', message.from)
      const messageViewProfilePictureContainer = document.createElement('div')
      messageViewProfilePictureContainer.classList.add(
        'messageViewProfilePictureContainer'
      )
      const messageViewProfilePicture = document.createElement('img')
      messageViewProfilePicture.classList.add('messageViewProfilePicture')
      messageViewProfilePicture.src = message.fromProfile.profilePicture
      messageViewProfilePicture.alt = message.fromProfile.fullName
      messageViewProfilePictureContainer.appendChild(messageViewProfilePicture)
      const messageViewInfo = document.createElement('div')
      messageViewInfo.classList.add('messageViewInfo')
      const messageViewHeader = document.createElement('div')
      messageViewHeader.classList.add('messageViewHeader')
      const messageViewName = document.createElement('h3')
      messageViewName.classList.add('messageViewName')
      messageViewName.innerText = message.fromProfile.fullName
      const messageViewUsername = document.createElement('p')
      messageViewUsername.classList.add('messageViewUsername')
      messageViewUsername.innerText = '@' + message.fromProfile.username
      const messageViewDate = document.createElement('p')
      messageViewDate.classList.add('messageViewDate')
      const date = new Date(message.createdAt)
      const month = date.getMonth() + 1
      const day = date.getDate()
      messageViewDate.innerText = day + '/' + month
      messageViewHeader.appendChild(messageViewName)
      messageViewHeader.appendChild(messageViewUsername)
      messageViewHeader.appendChild(messageViewDate)
      const lastMessage = document.createElement('p')
      lastMessage.classList.add('lastMessage')
      lastMessage.innerText = message.content
      messageViewInfo.appendChild(messageViewHeader)
      messageViewInfo.appendChild(lastMessage)
      messageProfile.appendChild(messageViewProfilePictureContainer)
      messageProfile.appendChild(messageViewInfo)
      messageProfile.addEventListener('click', () => {
        goToMessages(message.fromProfile.username) //temporary
      })
      const messagesView = document.getElementById('messagesView')
      messagesView.prepend(messageProfile)
    }
  } else {
    //do nothing for now
  }
})
