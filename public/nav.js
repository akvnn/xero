// post tweet button
const postTweetBtn = document.getElementById('post')
postTweetBtn.addEventListener('click', (event) => {
  const ele = document.getElementById('postTweetDiv')
  if (ele.classList.contains('postTweet')) {
    ele.classList.remove('postTweet')
    ele.classList.add('postTweetHidden')
  } else {
    ele.classList.remove('postTweetHidden')
    ele.classList.add('postTweet')
  }
})
const postTweetClose = document.getElementById('postTweetX')
postTweetClose.addEventListener('click', (event) => {
  const ele = document.getElementById('postTweetDiv')
  ele.classList.remove('postTweet')
  ele.classList.add('postTweetHidden')
})
// handle post tweet
const postTweetButton = document.getElementById('postTweetButton')
postTweetButton.addEventListener('click', async () => {
  try {
    const textArea = document.getElementById('postTweetTextArea')
    const content = textArea.value
    if (content.length == 0) {
      throw new Error('Tweet cannot be empty')
    }
    const cookie = getCookie('token')
    const response = await fetch('/postTweet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + cookie,
      },
      body: JSON.stringify({
        content: content,
      }),
    })
    const data = await response.json()
    if (data.status != true) {
      throw new Error(data.message)
    }
    // to do : if we are in home page..
    // add tweet div (show tweet for the user who posted it)
    const tweetsContainer = document.getElementById('tweets')
    const tweetDiv = createTweet(data.tweet)
    tweetsContainer.prepend(tweetDiv)
    // clear textarea
    textArea.value = ''
    // close post tweet div
    const ele = document.getElementById('postTweetDiv')
    ele.classList.remove('postTweet')
    ele.classList.add('postTweetHidden')
  } catch (err) {
    console.log(err)
  }
})
//navbar profile picture
const profilePic = document.getElementById('profilePic')
profilePic.addEventListener('click', (e) => {
  e.stopPropagation()
  const url = window.location.href
  const urlSplit = url.split('/')
  const username = document.getElementById('profileUsername').innerText
  if (urlSplit[urlSplit.length - 1] != username) {
    goToProfile(username)
  }
})
