const getCookie = (name) => {
  const cookie = document.cookie.split(';')
  const cookieName = `${name}=`
  for (let i = 0; i < cookie.length; i++) {
    let c = cookie[i]
    while (c.charAt(0) == ' ') {
      c = c.substring(1, c.length)
    }
    if (c.indexOf(cookieName) == 0) {
      return c.substring(cookieName.length, c.length)
    }
  }
  return null
}
window.getCookie = getCookie

//who to follow
const handleRandomUsers = async (randomUsers) => {
  const whoToFollow = document.getElementById('whoToFollow')
  // if there are already suggestions, dont change them
  if (whoToFollow.childElementCount > 1) {
    return
  }
  whoToFollow.innerHTML = '<h1 class="whoToFollowHeading">Who To Follow?</h1>'
  randomUsers.forEach((user) => {
    const suggestionAccount = document.createElement('div')
    suggestionAccount.classList.add('suggestionAccount')
    const suggestionImg = document.createElement('img')
    suggestionImg.classList.add('suggestionImg')
    suggestionImg.src = user.profilePicture
    const suggestionName = document.createElement('h3')
    suggestionName.classList.add('suggestionName')
    suggestionName.innerText = user.fullName
    const suggestionUsername = document.createElement('p')
    suggestionUsername.classList.add('suggestionUsername')
    suggestionUsername.innerText = '@' + user.username
    const suggestionNavigate = document.createElement('button')
    suggestionNavigate.classList.add('followButton')
    suggestionNavigate.innerText = 'Navigate'
    suggestionNavigate.addEventListener('click', (e) => {
      e.stopPropagation()
      goToProfile(user.username)
    })
    suggestionAccount.appendChild(suggestionImg)
    suggestionAccount.appendChild(suggestionName)
    suggestionAccount.appendChild(suggestionUsername)
    suggestionAccount.appendChild(suggestionNavigate)
    whoToFollow.appendChild(suggestionAccount)
  })
}
//end of who to follow
// createTweet function
const createTweet = (tweet) => {
  const tweetDiv = document.createElement('div')
  tweetDiv.classList.add('tweet')
  tweetDiv.classList.add('mainTweet')
  tweetDiv.setAttribute('dataTweetId', tweet._id)
  tweetDiv.addEventListener('click', (e) => {
    // tweetDiv.classList.add('tweetLoading')
    // to do add some type of loader
    // dont propogate
    e.stopPropagation()
    const tweetId = tweetDiv.getAttribute('dataTweetId')
    let commentDiv = tweetDiv.querySelector('.tweetCommentsHidden')
    if (
      commentDiv != null &&
      commentDiv.getAttribute('dataTweetId') == tweetId
    ) {
      showComments(tweetId)
    } else {
      commentDiv = tweetDiv.querySelector('.tweetComments')
      commentDiv.classList.remove('tweetComments')
      commentDiv.classList.add('tweetCommentsHidden')
    }
  })
  const tweetContentDiv = document.createElement('div')
  tweetContentDiv.classList.add('tweetContent')
  const profileNameDiv = document.createElement('div')
  profileNameDiv.classList.add('profileName')
  const profilePic = document.createElement('img')
  profilePic.classList.add('tweetProfilePic')
  profilePic.src = tweet.userDetails.profilePicture
  profilePic.alt = tweet.userDetails.fullName
  profilePic.setAttribute('dataUserId', tweet.createdBy)
  profilePic.addEventListener('click', (e) => {
    e.stopPropagation()
    const userId = profilePic.getAttribute('dataUserId') //user id to do later (might remove)
    const home = document.getElementById('home')
    const url = window.location.href
    const urlSplit = url.split('/')
    const page = urlSplit[0]
    if (page != 'profile') {
      goToProfile(tweet.userDetails.username)
    }
  })
  const name = document.createElement('h3')
  name.classList.add('tweetName')
  name.innerText = tweet.userDetails.fullName
  const username = document.createElement('p')
  username.classList.add('tweetUsername')
  username.innerText = '@' + tweet.userDetails.username
  const time = document.createElement('p')
  time.classList.add('tweetTime')
  time.setAttribute('dataCreated', tweet.createdAt)
  const minutes =
    Math.floor(new Date().getTime() - new Date(tweet.createdAt).getTime()) /
    60000
  time.innerText = Math.floor(minutes) + 'm'
  const tweetText = document.createElement('div')
  tweetText.classList.add('tweetText')
  tweetText.innerText = tweet.content
  const tweetChoices = document.createElement('div')
  tweetChoices.classList.add('tweetChoices')
  const tweetChoice = document.createElement('p')
  tweetChoice.classList.add('tweetChoice')
  tweetChoice.classList.add('comment')
  tweetChoice.innerHTML = `<i class="fa-regular fa-comment"></i> ${tweet.comments.length}`
  tweetChoice.addEventListener('click', (e) => {
    e.stopPropagation()
    const tweetId = tweetDiv.getAttribute('dataTweetId')
    const ele = document.getElementById('postCommentDiv')
    ele.setAttribute('dataTweetId', tweetId)
    if (ele.classList.contains('postTweet')) {
      ele.classList.remove('postTweet')
      ele.classList.add('postTweetHidden')
    } else {
      ele.classList.remove('postTweetHidden')
      ele.classList.add('postTweet')
    }
  })
  const tweetChoice2 = document.createElement('p')
  tweetChoice2.classList.add('tweetChoice')
  tweetChoice2.classList.add('retweet')
  tweetChoice2.innerHTML = `<i class="fa-solid fa-retweet"></i> ${tweet.retweets.length}`
  if (
    tweet.retweets.includes(
      document.getElementById('profilePic').getAttribute('dataUserId')
    )
  ) {
    tweetChoice2.classList.add('tweetChoiceActive')
  }
  tweetChoice2.addEventListener('click', (e) => {
    e.stopPropagation()
    const tweetId = tweetDiv.getAttribute('dataTweetId')
    let action = 'do'
    if (tweetChoice2.classList.contains('tweetChoiceActive')) {
      action = 'undo'
    }
    handleRetweetOrLike(tweetId, 'retweet', action)
  })
  const tweetChoice3 = document.createElement('p')
  tweetChoice3.classList.add('tweetChoice')
  tweetChoice3.classList.add('like')
  tweetChoice3.innerHTML = `<i class="fa-regular fa-heart"></i> ${tweet.likes.length}`
  if (
    tweet.likes.includes(
      document.getElementById('profilePic').getAttribute('dataUserId')
    )
  ) {
    tweetChoice3.classList.add('tweetChoiceActive')
  }
  tweetChoice3.addEventListener('click', (e) => {
    e.stopPropagation()
    const tweetId = tweetDiv.getAttribute('dataTweetId')
    let action = 'do'
    if (tweetChoice3.classList.contains('tweetChoiceActive')) {
      action = 'undo'
    }
    handleRetweetOrLike(tweetId, 'like', action)
  })
  const commentDiv = document.createElement('div') //comments on click
  commentDiv.classList.add('tweetCommentsHidden')
  commentDiv.setAttribute('dataTweetId', tweet._id)

  tweetChoices.appendChild(tweetChoice)
  tweetChoices.appendChild(tweetChoice2)
  tweetChoices.appendChild(tweetChoice3)
  profileNameDiv.appendChild(profilePic)
  profileNameDiv.appendChild(name)
  profileNameDiv.appendChild(username)
  profileNameDiv.appendChild(time)
  tweetContentDiv.appendChild(profileNameDiv)
  tweetContentDiv.appendChild(tweetText)
  tweetContentDiv.appendChild(tweetChoices)

  tweetDiv.appendChild(tweetContentDiv)
  tweetDiv.appendChild(commentDiv) //comments
  return tweetDiv
}
window.createTweet = createTweet
const handleHome = async () => {
  const token = getCookie('token')
  const response = await fetch('/getTweets', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  })
  const data = await response.json()
  if (data.status != true) {
    throw new Error(data.message)
  }
  // user profile
  const userProfile = data.profile
  const profilePic = document.getElementById('profilePic')
  profilePic.src = userProfile.profilePicture
  profilePic.alt = userProfile.fullName
  profilePic.setAttribute('dataUserId', userProfile._id)

  const name = document.getElementById('profileName')
  name.innerText = userProfile.fullName
  const username = document.getElementById('profileUsername')
  username.innerText = userProfile.username
  // who To follow
  await handleRandomUsers(data.randomUsers)
  // tweets
  const tweets = data.tweets
  const tweetsContainer = document.getElementById('tweets')
  // console.log(tweets)
  tweets.forEach((tweet) => {
    const tweetDiv = createTweet(tweet)
    tweetsContainer.prepend(tweetDiv) //newest at top //should be appendChild but its not sorting properly from server side.. to do..
  })
}
const followOrUnfollow = async (username, action, label) => {
  try {
    const token = getCookie('token')
    const response = await fetch('/followOrUnfollow/' + username, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        action: action,
      }),
    })
    const data = await response.json()
    if (data.status != true) {
      throw new Error(data.message)
    }
    if (label.innerText == 'Follow') {
      label.innerText = 'Unfollow'
    } else {
      label.innerText = 'Follow'
    }
  } catch (err) {
    console.log(err)
  }
}
const handleProfile = async (username, menu = 'Posts') => {
  try {
    const token = getCookie('token')
    const response = await fetch('/getProfile/' + username, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
    const data = await response.json()
    if (data.status != true) {
      throw new Error(data.message)
    }
    //navbar profile
    const userProfile = data.profile
    const profilePic = document.getElementById('profilePic')
    profilePic.src = userProfile.profilePicture
    profilePic.alt = userProfile.fullName
    profilePic.setAttribute('dataUserId', userProfile._id)
    const name = document.getElementById('profileName')
    name.innerText = userProfile.fullName
    const profileUsername = document.getElementById('profileUsername')
    profileUsername.innerText = userProfile.username
    // who To follow
    await handleRandomUsers(data.randomUsers)
    // user profile
    const profileBanner = document.createElement('div')
    profileBanner.classList.add('profileBanner')
    const profileBannerPic = document.createElement('img')
    profileBannerPic.classList.add('profileBannerPic')
    profileBannerPic.setAttribute('id', 'profileBannerPic')
    profileBannerPic.src = data.targetedProfile.profileBanner
    profileBanner.appendChild(profileBannerPic)
    const imgAndEdit = document.createElement('div')
    imgAndEdit.classList.add('imgAndEdit')
    const mainProfilePic = document.createElement('img')
    mainProfilePic.classList.add('mainProfilePic')
    mainProfilePic.setAttribute('id', 'mainProfilePic')
    mainProfilePic.src = data.targetedProfile.profilePicture
    if (data.targetedProfile.sameUser == true) {
      const editProfileButton = document.createElement('button')
      editProfileButton.classList.add('btn')
      editProfileButton.classList.add('editProfileButton')
      editProfileButton.innerText = 'Edit Profile'
      editProfileButton.setAttribute('id', 'editProfileButton')
      imgAndEdit.appendChild(mainProfilePic)
      imgAndEdit.appendChild(editProfileButton)
      // edit profile
      editProfileButton.addEventListener('click', (e) => {
        const isEditProfileThere = document.querySelector('.editProfile') //if it was not removed, remove the editProfile container
        if (isEditProfileThere != null) {
          isEditProfileThere.remove()
        }
        const editProfile = document.createElement('div')
        editProfile.classList.add('editProfile')
        const editProfileHeading = document.createElement('h3')
        editProfileHeading.classList.add('editProfileHeading')
        editProfileHeading.innerText = 'Edit Profile'
        const editProfileForm = document.createElement('form')
        editProfileForm.classList.add('editProfileForm')
        editProfileForm.setAttribute('id', 'editProfileForm')
        const editProfileFormFullName = document.createElement('input')
        editProfileFormFullName.classList.add('editProfileInput')
        editProfileFormFullName.setAttribute('id', 'editProfileFormFullName')
        editProfileFormFullName.setAttribute('type', 'text')
        editProfileFormFullName.setAttribute('name', 'editProfileFormFullName')
        editProfileFormFullName.setAttribute('placeholder', 'Full Name')
        editProfileFormFullName.setAttribute(
          'value',
          data.targetedProfile.fullName
        )
        const editProfileFormUsername = document.createElement('input')
        editProfileFormUsername.classList.add('editProfileInput')
        editProfileFormUsername.setAttribute('id', 'editProfileFormUsername')
        editProfileFormUsername.setAttribute('type', 'text')
        editProfileFormUsername.setAttribute('name', 'editProfileFormUsername')
        editProfileFormUsername.setAttribute('placeholder', 'Username')
        editProfileFormUsername.setAttribute(
          'value',
          data.targetedProfile.username
        )
        const editProfileFormBio = document.createElement('textarea')
        editProfileFormBio.classList.add('editProfileFormBio')
        editProfileFormBio.setAttribute('id', 'editProfileFormBio')
        editProfileFormBio.setAttribute('name', 'editProfileFormBio')
        editProfileFormBio.setAttribute('rows', '4')
        editProfileFormBio.setAttribute('cols', '50')
        editProfileFormBio.setAttribute('placeholder', 'Bio')
        editProfileFormBio.innerText = data.targetedProfile.bio
        const editProfileFormProfilePicture = document.createElement('input')
        editProfileFormProfilePicture.classList.add('editProfileInput')
        editProfileFormProfilePicture.setAttribute(
          'id',
          'editProfileFormProfilePicture'
        )
        editProfileFormProfilePicture.setAttribute('type', 'text')
        editProfileFormProfilePicture.setAttribute(
          'name',
          'editProfileFormProfilePicture'
        )
        editProfileFormProfilePicture.setAttribute(
          'placeholder',
          'Profile Picture URL'
        )
        editProfileFormProfilePicture.setAttribute(
          'value',
          data.targetedProfile.profilePicture
        )
        const editProfileFormProfileBanner = document.createElement('input')
        editProfileFormProfileBanner.classList.add('editProfileInput')
        editProfileFormProfileBanner.setAttribute(
          'id',
          'editProfileFormProfileBanner'
        )
        editProfileFormProfileBanner.setAttribute('type', 'text')
        editProfileFormProfileBanner.setAttribute(
          'name',
          'editProfileFormProfileBanner'
        )
        editProfileFormProfileBanner.setAttribute(
          'placeholder',
          'Profile Banner URL'
        )
        editProfileFormProfileBanner.setAttribute(
          'value',
          data.targetedProfile.profileBanner
        )
        const editProfileFormSubmit = document.createElement('button')
        editProfileFormSubmit.classList.add('btn')
        editProfileFormSubmit.classList.add('editProfileFormSubmit')
        editProfileFormSubmit.setAttribute('id', 'editProfileFormSubmit')
        editProfileFormSubmit.innerText = 'Submit'
        const usernameForRedirect = data.targetedProfile.username
        editProfileFormSubmit.addEventListener('click', async (e) => {
          e.stopPropagation()
          e.preventDefault()
          const token = getCookie('token')
          const response = await fetch('/editProfile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token,
            },
            body: JSON.stringify({
              fullName: editProfileFormFullName.value,
              username: editProfileFormUsername.value,
              bio: editProfileFormBio.value,
              profilePicture: editProfileFormProfilePicture.value,
              coverPicture: editProfileFormProfileBanner.value,
            }),
          })
          try {
            const data = await response.json()
            if (data.status != true) {
              throw new Error(data.message)
            }
          } catch (err) {
            console.log(err)
            alert(err.message) //to do
          }
          editProfile.remove()
          //refresh page
          goToProfile(usernameForRedirect) //optional
        })

        const editProfileCancelButton = document.createElement('button')
        editProfileCancelButton.classList.add('btn')
        editProfileCancelButton.classList.add('editProfileCancelButton')
        editProfileCancelButton.setAttribute('id', 'editProfileCancelButton')
        editProfileCancelButton.innerText = 'Cancel'
        editProfileCancelButton.addEventListener('click', (e) => {
          e.stopPropagation()
          e.preventDefault()
          editProfile.remove()
          // goToProfile(data.targetedProfile.username) //optional
        })
        const editProfileButtons = document.createElement('div')
        editProfileButtons.classList.add('editProfileButtons')
        editProfileButtons.appendChild(editProfileFormSubmit)
        editProfileButtons.appendChild(editProfileCancelButton)

        editProfileForm.appendChild(editProfileFormProfileBanner)
        editProfileForm.appendChild(editProfileFormProfilePicture)
        editProfileForm.appendChild(editProfileFormFullName)
        editProfileForm.appendChild(editProfileFormUsername)
        editProfileForm.appendChild(editProfileFormBio)
        editProfileForm.appendChild(editProfileButtons)
        editProfile.appendChild(editProfileHeading)
        editProfile.appendChild(editProfileForm)
        const home = document.getElementById('home')
        home.appendChild(editProfile)
      })
    } else {
      const followUnfollowButton = document.createElement('button')
      followUnfollowButton.classList.add('btn')
      followUnfollowButton.classList.add('followUnfollowButton')
      followUnfollowButton.setAttribute('id', 'followUnfollowButton')
      if (data.targetedProfile.isFollowing == true) {
        followUnfollowButton.innerText = 'Unfollow'
      } else {
        followUnfollowButton.innerText = 'Follow'
      }
      followUnfollowButton.addEventListener('click', async (e) => {
        e.stopPropagation()
        const url = window.location.href
        const urlSplit = url.split('/')
        const username = urlSplit[urlSplit.length - 1]
        await followOrUnfollow(
          username,
          followUnfollowButton.innerText,
          followUnfollowButton
        )
        const followersCount = document.getElementById('FollowersCount')
        if (followUnfollowButton.innerText == 'Unfollow') {
          //followed
          followersCount.innerText = parseInt(followersCount.innerText) + 1
        } else {
          //unfollowed
          followersCount.innerText = parseInt(followersCount.innerText) - 1
        }
      })
      const directMessageButton = document.createElement('button')
      directMessageButton.classList.add('btn')
      directMessageButton.classList.add('directMessageButton')
      directMessageButton.setAttribute('id', 'directMessageButton')
      directMessageButton.innerText = 'Message'
      directMessageButton.addEventListener('click', (e) => {
        goToMessages(data.targetedProfile.username)
        e.stopPropagation()
      })
      imgAndEdit.appendChild(mainProfilePic)
      imgAndEdit.appendChild(directMessageButton)
      imgAndEdit.appendChild(followUnfollowButton)
    }
    const mainProfileNameDiv = document.createElement('div')
    mainProfileNameDiv.classList.add('mainProfileNameDiv')
    const mainProfileName = document.createElement('h3')
    mainProfileName.classList.add('mainProfileName')
    mainProfileName.setAttribute('id', 'mainProfileName')
    mainProfileName.innerText = data.targetedProfile.fullName
    const mainProfileUsername = document.createElement('p')
    mainProfileUsername.classList.add('mainProfileUsername')
    mainProfileUsername.setAttribute('id', 'mainProfileUsername')
    mainProfileUsername.innerText = '@' + data.targetedProfile.username
    const bio = document.createElement('p')
    bio.classList.add('bio')
    bio.setAttribute('id', 'bio')
    bio.innerText = data.targetedProfile.bio
    mainProfileNameDiv.appendChild(mainProfileName)
    mainProfileNameDiv.appendChild(mainProfileUsername)
    mainProfileNameDiv.appendChild(bio)
    const profileCount = document.createElement('div')
    profileCount.classList.add('profileCount')
    const countItems = ['Following', 'Followers', 'Tweets']
    const countValues = [
      data.targetedProfile.followingCount,
      data.targetedProfile.followersCount,
      data.targetedProfile.tweetCount,
    ]
    for (let i = 0; i < 3; i++) {
      const countItem = document.createElement('div')
      countItem.classList.add('countItem')
      const countNumber = document.createElement('p')
      countNumber.classList.add('countNumber')
      countNumber.setAttribute('id', `${countItems[i]}Count`)
      countNumber.innerText = countValues[i]
      const countText = document.createElement('p')
      countText.classList.add('countText')
      countText.innerText = countItems[i]
      countItem.appendChild(countNumber)
      countItem.appendChild(countText)
      profileCount.appendChild(countItem)
    }
    const profileNavigationButtons = document.createElement('div')
    profileNavigationButtons.classList.add('profileNavigationButtons')
    const profileNavigationButtonsItems = ['Posts', 'Replies', 'Likes']
    for (let i = 0; i < 3; i++) {
      const profileNavigationButton = document.createElement('button')
      profileNavigationButton.classList.add('followingButton')
      profileNavigationButton.classList.add('profileNavButton')
      profileNavigationButton.setAttribute(
        'id',
        `profileNavigationButton${profileNavigationButtonsItems[i]}`
      )
      if (i == 0) {
        profileNavigationButton.classList.add('profileNavButtonActive')
      }
      profileNavigationButton.addEventListener('click', () => {
        const profileNavButtons = document.querySelectorAll('.profileNavButton')
        profileNavButtons.forEach((button) => {
          button.classList.remove('profileNavButtonActive')
        })
        profileNavigationButton.classList.add('profileNavButtonActive')
        handleProfileChange(
          data.targetedProfile.username,
          profileNavigationButtonsItems[i]
        )
      })
      profileNavigationButton.innerText = profileNavigationButtonsItems[i]
      profileNavigationButtons.appendChild(profileNavigationButton)
    }
    // append all
    const home = document.getElementById('profileHeader')
    home.appendChild(profileBanner)
    home.appendChild(imgAndEdit)
    home.appendChild(mainProfileNameDiv)
    home.appendChild(profileCount)
    home.appendChild(profileNavigationButtons)
    // tweets
    const tweets = data.tweets
    const tweetsContainer = document.getElementById('profileTweets')
    tweets.forEach((tweet) => {
      const tweetDiv = createTweet(tweet)
      tweetsContainer.prepend(tweetDiv) //newest at top //should be appendChild but its not sorting properly from server side.. to do..
    })
  } catch (err) {
    const profileHeader = document.getElementById('profileHeader')
    profileHeader.innerHTML = `<h1 class="targetHeading" style="color: #B22222;">Oops.. ${err.message}</h1>`
    console.log(err)
  }
}
const handleProfileChange = async (username, menu) => {
  try {
    const token = getCookie('token')
    let data
    if (menu === 'Posts') {
      const response = await fetch('/getProfile/' + username, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      })
      data = await response.json()
      if (data.status != true) {
        throw new Error(data.message)
      }
    } else if (menu === 'Replies') {
      const response = await fetch('/getProfileReplies/' + username, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      })
      data = await response.json()
      if (data.status != true) {
        throw new Error(data.message)
      }
    } else if (menu === 'Likes') {
      const response = await fetch('/getProfileLikes/' + username, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      })
      data = await response.json()
      if (data.status != true) {
        throw new Error(data.message)
      }
      // console.log(data)
    }
    // tweets
    const tweets = data.tweets
    const tweetsContainer = document.getElementById('profileTweets')
    tweetsContainer.innerHTML = ''
    tweets.forEach((tweet) => {
      const tweetDiv = createTweet(tweet)
      tweetsContainer.prepend(tweetDiv) //newest at top //should be appendChild but its not sorting properly from server side.. to do..
    })
  } catch (err) {
    console.log(err)
  }
}
const handleMessages = async () => {
  try {
    const token = getCookie('token')
    const response = await fetch('/getMessages', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
    const data = await response.json()
    if (data.status != true) {
      throw new Error(data.message)
    }
    //navbar profile
    const userProfile = data.profile
    const profilePic = document.getElementById('profilePic')
    profilePic.src = userProfile.profilePicture
    profilePic.alt = userProfile.fullName
    profilePic.setAttribute('dataUserId', userProfile._id)
    const name = document.getElementById('profileName')
    name.innerText = userProfile.fullName
    const profileUsername = document.getElementById('profileUsername')
    profileUsername.innerText = userProfile.username
    // who To follow
    await handleRandomUsers(data.randomUsers)
    // messagesView
    const messagesView = document.getElementById('messagesView')
    if (messagesView.classList.contains('messagesViewHidden')) {
      messagesView.classList.remove('messagesViewHidden')
      messagesView.classList.add('messagesView')
    }
    const messages = data.messages
    messages.forEach((message) => {
      const messageProfile = document.createElement('div')
      messageProfile.classList.add('messageProfile')
      const messageViewProfilePictureContainer = document.createElement('div')
      messageViewProfilePictureContainer.classList.add(
        'messageViewProfilePictureContainer'
      )
      const messageViewProfilePicture = document.createElement('img')
      messageViewProfilePicture.classList.add('messageViewProfilePicture')
      messageViewProfilePicture.src = message.userDetails.profilePicture
      messageViewProfilePicture.alt = message.userDetails.fullName
      messageViewProfilePictureContainer.appendChild(messageViewProfilePicture)
      const messageViewInfo = document.createElement('div')
      messageViewInfo.classList.add('messageViewInfo')
      const messageViewHeader = document.createElement('div')
      messageViewHeader.classList.add('messageViewHeader')
      const messageViewName = document.createElement('h3')
      messageViewName.classList.add('messageViewName')
      messageViewName.innerText = message.userDetails.fullName
      const messageViewUsername = document.createElement('p')
      messageViewUsername.classList.add('messageViewUsername')
      messageViewUsername.innerText = '@' + message.userDetails.username
      const messageViewDate = document.createElement('p')
      messageViewDate.classList.add('messageViewDate')
      const date = new Date(message.messages[0].createdAt)
      const month = date.getMonth() + 1
      const day = date.getDate()
      messageViewDate.innerText = day + '/' + month
      messageViewHeader.appendChild(messageViewName)
      messageViewHeader.appendChild(messageViewUsername)
      messageViewHeader.appendChild(messageViewDate)
      const lastMessage = document.createElement('p')
      lastMessage.classList.add('lastMessage')
      lastMessage.innerText = message.messages[0].content
      messageViewInfo.appendChild(messageViewHeader)
      messageViewInfo.appendChild(lastMessage)
      messageProfile.appendChild(messageViewProfilePictureContainer)
      messageProfile.appendChild(messageViewInfo)
      messageProfile.setAttribute('dataUserId', message.userDetails._id) //recepient id
      const messagesDetails = document.getElementById('messagesDetails')
      messageProfile.addEventListener('click', (e) => {
        e.stopPropagation()
        const userId = messageProfile.getAttribute('dataUserId')
        messagesView.classList.add('messagesViewHidden')
        messagesView.classList.remove('messagesView')
        messagesDetails.classList.add('messagesDetails')
        messagesDetails.classList.remove('messagesDetailsHidden')
        const messageDetails = document.getElementById(userId)
        const messageInput = document.getElementById(`messageInput${userId}`)
        if (messageDetails.classList.contains('messageDetailsHidden')) {
          messageDetails.classList.remove('messageDetailsHidden')
          messageDetails.classList.add('messageDetails')
        }
        if (messageInput.classList.contains('messageDetailsInputHidden')) {
          messageInput.classList.remove('messageDetailsInputHidden')
          messageInput.classList.add('messageDetailsInput')
        }
        //scroll down to latest message
        const messageDetailsMessagesElement = messageDetails.querySelector(
          '.messageDetailsMessages'
        )
        const lastMessageElement = messageDetailsMessagesElement.lastChild
        if (lastMessageElement != null) {
          lastMessageElement.scrollIntoView()
        }
      })
      messagesView.appendChild(messageProfile)

      const messageDetails = document.createElement('div')
      messageDetails.classList.add('messageDetailsHidden')
      messageDetails.setAttribute('id', message.userDetails._id) //recepient id
      const messageDetailsHeader = document.createElement('div')
      messageDetailsHeader.classList.add('messageDetailsHeader')
      const messageDetailsProfilePictureContainer =
        document.createElement('div')
      messageDetailsProfilePictureContainer.classList.add(
        'messageDetailsProfilePictureContainer'
      )
      const messageDetailsProfilePicture = document.createElement('img')
      messageDetailsProfilePicture.classList.add('messageDetailsProfilePicture')
      messageDetailsProfilePicture.setAttribute(
        'src',
        message.userDetails.profilePicture
      )
      messageDetailsProfilePicture.setAttribute(
        'alt',
        message.userDetails.fullName
      )
      messageDetailsProfilePicture.addEventListener('click', (e) => {
        e.stopPropagation()
        const username = message.userDetails.username
        goToProfile(username)
      })
      messageDetailsProfilePictureContainer.appendChild(
        messageDetailsProfilePicture
      )
      const messageDetailsInfo = document.createElement('div')
      messageDetailsInfo.classList.add('messageDetailsInfo')
      const messageDetailsName = document.createElement('h3')
      messageDetailsName.classList.add('messageDetailsName')
      messageDetailsName.innerText = message.userDetails.fullName
      const messageDetailsUsername = document.createElement('p')
      messageDetailsUsername.classList.add('messageDetailsUsername')
      messageDetailsUsername.innerText = '@' + message.userDetails.username
      messageDetailsInfo.appendChild(messageDetailsName)
      messageDetailsInfo.appendChild(messageDetailsUsername)
      messageDetailsHeader.appendChild(messageDetailsProfilePictureContainer)
      messageDetailsHeader.appendChild(messageDetailsInfo)
      messageDetails.appendChild(messageDetailsHeader)
      const messageDetailsMessages = document.createElement('div')
      messageDetailsMessages.classList.add('messageDetailsMessages')
      messageDetailsMessages.setAttribute('id', 'messageDetailsMessages')
      message.messages.forEach((convo) => {
        //the appropriate variable name here should be singleMessage rather than convo
        const messageDetailsMessage = document.createElement('div')
        messageDetailsMessage.classList.add('messageDetailsMessage')
        const messageDetailsMessageText = document.createElement('p')
        messageDetailsMessageText.classList.add('messageDetailsMessageText')
        messageDetailsMessageText.innerText = convo.content
        const messageDetailsMessageTime = document.createElement('p')
        messageDetailsMessageTime.classList.add('messageDetailsMessageTime')
        const date = new Date(convo.createdAt)
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        // const seconds = date.getSeconds()
        messageDetailsMessageTime.innerText =
          day + '/' + month + ' ' + hour + ':' + minute // + ':' + seconds
        if (convo.from == userProfile._id) {
          messageDetailsMessageText.classList.add(
            'messageDetailsMessageTextSent'
          )
          messageDetailsMessageTime.classList.add(
            'messageDetailsMessageTimeSent'
          )
        } else {
          messageDetailsMessageTime.classList.add(
            'messageDetailsMessageTimeReceived'
          )
        }
        messageDetailsMessage.appendChild(messageDetailsMessageText)
        messageDetailsMessage.appendChild(messageDetailsMessageTime)
        messageDetailsMessages.prepend(messageDetailsMessage)
      })
      messageDetails.appendChild(messageDetailsMessages)
      const messageDetailsInput = document.createElement('div')
      // messageDetailsInput.classList.add('messageDetailsInput') //given on message user profile click
      messageDetailsInput.classList.add('messageDetailsInputHidden')
      messageDetailsInput.setAttribute(
        'id',
        `messageInput${message.userDetails._id}`
      ) //recepient id
      const messageDetailsInputTextArea = document.createElement('textarea')
      messageDetailsInputTextArea.classList.add('messageDetailsInputText')
      messageDetailsInputTextArea.setAttribute(
        'id',
        `messageDetailsInput${message.userDetails._id}` //specific messages do not have this as there is only one messageDetailsInput
      )
      messageDetailsInputTextArea.setAttribute('name', 'messageDetailsInput')
      messageDetailsInputTextArea.setAttribute('rows', '2')
      messageDetailsInputTextArea.setAttribute('cols', '30')
      messageDetailsInputTextArea.setAttribute(
        'placeholder',
        'type your message here ...'
      )
      messageDetailsInputTextArea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          const parentElement = e.target.parentElement
          const messageDetailsInputButton = parentElement.querySelector(
            '#messageDetailsInputButton'
          )
          messageDetailsInputButton.click()
        }
      })
      const messageDetailsInputButton = document.createElement('button')
      messageDetailsInputButton.classList.add('btn')
      messageDetailsInputButton.classList.add('messageDetailsInputButton')
      messageDetailsInputButton.setAttribute('id', 'messageDetailsInputButton')
      messageDetailsInputButton.innerHTML =
        '<i class="fa-solid fa-arrow-right"></i>'
      messageDetailsInputButton.addEventListener('click', async (e) => {
        e.stopPropagation()
        const messageDetailsInput = document.getElementById(
          `messageDetailsInput${message.userDetails._id}`
        ).value
        // console.log(messageDetailsInput)
        if (messageDetailsInput.trim() == '') {
          return
        }
        const to = message._id
        const token = getCookie('token')
        const response = await fetch('/sendMessage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
          body: JSON.stringify({
            to: to,
            content: messageDetailsInput,
          }),
        })
        const data = await response.json()
        if (data.status != true) {
          throw new Error(data.message)
        }
        const messageDetailsMessages = document.getElementById(
          'messageDetailsMessages'
        )
        const messageDetailsMessage = document.createElement('div')
        messageDetailsMessage.classList.add('messageDetailsMessage')
        const messageDetailsMessageText = document.createElement('p')
        messageDetailsMessageText.classList.add('messageDetailsMessageText')
        messageDetailsMessageText.classList.add('messageDetailsMessageTextSent')
        messageDetailsMessageText.innerText = messageDetailsInput
        const messageDetailsMessageTime = document.createElement('p')
        messageDetailsMessageTime.classList.add('messageDetailsMessageTime')
        messageDetailsMessageTime.classList.add('messageDetailsMessageTimeSent')
        const date = new Date()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        // const seconds = date.getSeconds()
        messageDetailsMessageTime.innerText =
          day + '/' + month + ' ' + hour + ':' + minute //+ ':' + seconds
        messageDetailsMessage.appendChild(messageDetailsMessageText)
        messageDetailsMessage.appendChild(messageDetailsMessageTime)
        messageDetailsMessages.appendChild(messageDetailsMessage)
        messageDetailsMessage.scrollIntoView() // scroll to bottom
        document.getElementById(
          `messageDetailsInput${message.userDetails._id}`
        ).value = ''
      })
      messageDetailsInput.appendChild(messageDetailsInputTextArea)
      messageDetailsInput.appendChild(messageDetailsInputButton)
      messagesDetails.appendChild(messageDetails)
      messagesDetails.appendChild(messageDetailsInput)
    })
  } catch (err) {
    console.log(err)
  }
}
// specific profile messages .. only when the user presses message button on profile or url is /messages/username
const getSpecificMessages = async (username) => {
  const token = getCookie('token')
  const response = await fetch('/getSpecificMesssages/' + username, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  })
  const data = await response.json()
  if (data.status != true) {
    throw new Error(data.message)
  }
  //navbar profile
  const userProfile = data.profile
  const profilePic = document.getElementById('profilePic')
  profilePic.src = userProfile.profilePicture
  profilePic.alt = userProfile.fullName
  profilePic.setAttribute('dataUserId', userProfile._id)
  const name = document.getElementById('profileName')
  name.innerText = userProfile.fullName
  const profileUsername = document.getElementById('profileUsername')
  profileUsername.innerText = userProfile.username
  // messagesView
  const messagesView = document.getElementById('messagesView')
  messagesView.classList.add('messagesViewHidden')
  messagesView.classList.remove('messagesView')
  const messages = data.messages
  // messagesDetails
  const messagesDetails = document.getElementById('messagesDetails')
  if (messagesDetails.classList.contains('messagesDetailsHidden')) {
    messagesDetails.classList.remove('messagesDetailsHidden')
    messagesDetails.classList.add('messagesDetails')
  }
  const messageDetails = document.createElement('div')
  messageDetails.classList.add('messageDetails')
  messageDetails.setAttribute('id', data.targetedProfile._id) //recepient id
  const messageDetailsHeader = document.createElement('div')
  messageDetailsHeader.classList.add('messageDetailsHeader')
  const messageDetailsProfilePictureContainer = document.createElement('div')
  messageDetailsProfilePictureContainer.classList.add(
    'messageDetailsProfilePictureContainer'
  )
  const messageDetailsProfilePicture = document.createElement('img')
  messageDetailsProfilePicture.classList.add('messageDetailsProfilePicture')
  messageDetailsProfilePicture.setAttribute(
    'src',
    data.targetedProfile.profilePicture
  )
  messageDetailsProfilePicture.setAttribute(
    'alt',
    data.targetedProfile.fullName
  )
  messageDetailsProfilePicture.addEventListener('click', (e) => {
    e.stopPropagation()
    const username = data.targetedProfile.username
    goToProfile(username)
  })
  messageDetailsProfilePictureContainer.appendChild(
    messageDetailsProfilePicture
  )
  const messageDetailsInfo = document.createElement('div')
  messageDetailsInfo.classList.add('messageDetailsInfo')
  const messageDetailsName = document.createElement('h3')
  messageDetailsName.classList.add('messageDetailsName')
  messageDetailsName.innerText = data.targetedProfile.fullName
  const messageDetailsUsername = document.createElement('p')
  messageDetailsUsername.classList.add('messageDetailsUsername')
  messageDetailsUsername.innerText = '@' + data.targetedProfile.username
  messageDetailsInfo.appendChild(messageDetailsName)
  messageDetailsInfo.appendChild(messageDetailsUsername)
  messageDetailsHeader.appendChild(messageDetailsProfilePictureContainer)
  messageDetailsHeader.appendChild(messageDetailsInfo)
  const messageDetailsMessages = document.createElement('div')
  messageDetailsMessages.classList.add('messageDetailsMessages')
  messageDetailsMessages.setAttribute('id', 'messageDetailsMessages')
  messageDetails.appendChild(messageDetailsHeader)
  messageDetails.appendChild(messageDetailsMessages)
  messagesDetails.appendChild(messageDetails)

  messages.forEach((convo) => {
    const messageDetailsMessage = document.createElement('div')
    messageDetailsMessage.classList.add('messageDetailsMessage')
    const messageDetailsMessageText = document.createElement('p')
    messageDetailsMessageText.classList.add('messageDetailsMessageText')
    messageDetailsMessageText.innerText = convo.content
    const messageDetailsMessageTime = document.createElement('p')
    messageDetailsMessageTime.classList.add('messageDetailsMessageTime')
    const date = new Date(convo.createdAt)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    // const seconds = date.getSeconds()
    messageDetailsMessageTime.innerText =
      day + '/' + month + ' ' + hour + ':' + minute // + ':' + seconds
    if (convo.from == userProfile._id) {
      messageDetailsMessageText.classList.add('messageDetailsMessageTextSent')
      messageDetailsMessageTime.classList.add('messageDetailsMessageTimeSent')
    } else {
      messageDetailsMessageTime.classList.add(
        'messageDetailsMessageTimeReceived'
      )
    }
    messageDetailsMessage.appendChild(messageDetailsMessageText)
    messageDetailsMessage.appendChild(messageDetailsMessageTime)
    messageDetailsMessages.prepend(messageDetailsMessage)
  })
  const messageDetailsInput = document.createElement('div')
  messageDetailsInput.classList.add('messageDetailsInput')
  const messageDetailsInputTextArea = document.createElement('textarea')
  messageDetailsInputTextArea.classList.add('messageDetailsInputText')
  messageDetailsInputTextArea.setAttribute('id', 'messageDetailsInput') //note that the id of the text area is different in handleMessages method as there is no need to use the recepient id here
  messageDetailsInputTextArea.setAttribute('name', 'messageDetailsInput')
  messageDetailsInputTextArea.setAttribute('rows', '2')
  messageDetailsInputTextArea.setAttribute('cols', '30')
  messageDetailsInputTextArea.setAttribute(
    'placeholder',
    'type your message here ...'
  )
  messageDetailsInputTextArea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const parentElement = e.target.parentElement
      const messageDetailsInputButton = parentElement.querySelector(
        '#messageDetailsInputButton'
      )
      messageDetailsInputButton.click()
    }
  })
  const messageDetailsInputButton = document.createElement('button')
  messageDetailsInputButton.classList.add('btn')
  messageDetailsInputButton.classList.add('messageDetailsInputButton')
  messageDetailsInputButton.setAttribute('id', 'messageDetailsInputButton')
  messageDetailsInputButton.innerHTML =
    '<i class="fa-solid fa-arrow-right"></i>'
  messageDetailsInputButton.addEventListener('click', async (e) => {
    e.stopPropagation()
    const messageDetailsInput = document.getElementById(
      'messageDetailsInput'
    ).value
    if (messageDetailsInput.trim() == '') {
      return
    }

    const to = document.querySelector('.messageDetails').getAttribute('id') //recepient id.. note: will only work if the user is on the specific messages page where there is only one messageDetails div)
    const token = getCookie('token')
    const response = await fetch('/sendMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        to: to,
        content: messageDetailsInput,
      }),
    })
    const data = await response.json()
    if (data.status != true) {
      throw new Error(data.message)
    }
    const messageDetailsMessages = document.getElementById(
      'messageDetailsMessages'
    )
    const messageDetailsMessage = document.createElement('div')
    messageDetailsMessage.classList.add('messageDetailsMessage')
    const messageDetailsMessageText = document.createElement('p')
    messageDetailsMessageText.classList.add('messageDetailsMessageText')
    messageDetailsMessageText.classList.add('messageDetailsMessageTextSent')
    messageDetailsMessageText.innerText = messageDetailsInput
    const messageDetailsMessageTime = document.createElement('p')
    messageDetailsMessageTime.classList.add('messageDetailsMessageTime')
    messageDetailsMessageTime.classList.add('messageDetailsMessageTimeSent')
    const date = new Date()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    // const seconds = date.getSeconds()
    messageDetailsMessageTime.innerText =
      day + '/' + month + ' ' + hour + ':' + minute //+ ':' + seconds
    messageDetailsMessage.appendChild(messageDetailsMessageText)
    messageDetailsMessage.appendChild(messageDetailsMessageTime)
    messageDetailsMessages.appendChild(messageDetailsMessage)
    messageDetailsMessage.scrollIntoView() // scroll to bottom
    document.getElementById('messageDetailsInput').value = ''
  })
  messageDetailsInput.appendChild(messageDetailsInputTextArea)
  messageDetailsInput.appendChild(messageDetailsInputButton)
  messagesDetails.appendChild(messageDetailsInput)
  // scroll to bottom
  const messageDetailsMessagesElement = messageDetails.querySelector(
    '.messageDetailsMessages'
  )
  const lastMessageElement = messageDetailsMessagesElement.lastChild
  if (lastMessageElement != null) {
    lastMessageElement.scrollIntoView()
  }
}
const handleSettings = async () => {
  //fetch profile info
  const token = getCookie('token')
  const response = await fetch('/getNavProfile', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  })
  const data = await response.json()
  //navbar profile
  const userProfile = data.profile
  const profilePic = document.getElementById('profilePic')
  profilePic.src = userProfile.profilePicture
  profilePic.alt = userProfile.fullName
  profilePic.setAttribute('dataUserId', userProfile._id)
  const name = document.getElementById('profileName')
  name.innerText = userProfile.fullName
  const profileUsername = document.getElementById('profileUsername')
  profileUsername.innerText = userProfile.username
  // who To follow
  await handleRandomUsers(data.randomUsers)
}

const unhidePasswordDiv = () => {
  const passwordDiv = document.getElementById('passwordDiv')
  if (passwordDiv.classList.contains('passwordDivHidden')) {
    passwordDiv.classList.remove('passwordDivHidden')
    passwordDiv.classList.add('passwordDiv')
  }
}
const changePassword = async () => {
  try {
    const token = getCookie('token')
    const oldPassword = document.getElementById('changePasswordOld').value
    const newPassword = document.getElementById('changePasswordNew').value
    if (oldPassword.trim() == '' || newPassword.trim() == '') {
      throw new Error('Please fill in all fields')
    }
    if (oldPassword == newPassword) {
      throw new Error('New password cannot be the same as old password')
    }
    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters long')
    }

    const response = await fetch('/changePassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    })
    const data = await response.json()
    if (data.status != true) {
      throw new Error(data.message)
    }
    const passwordMessage = document.getElementById('passwordMessage')
    passwordMessage.innerText = data.message
    document.getElementById('changePasswordOld').value = ''
    document.getElementById('changePasswordNew').value = ''
  } catch (err) {
    const passwordMessage = document.getElementById('passwordMessage')
    passwordMessage.innerText = err.message
  }
}
const logout = () => {
  // delete cookie
  document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  // redirect to login page
  window.location.href = '/login'
}

document.addEventListener('DOMContentLoaded', async () => {
  // small screen sizes alert message
  const smallScreenAlert = () => {
    const width = window.innerWidth
    if (width < 1000) {
      const isAlert = document.querySelector('.alert')
      if (isAlert) {
        return
      }
      const alert = document.createElement('div')
      alert.classList.add('alert')
      alert.innerHTML =
        '<p>This website is not optimized for small screen sizes, please use a desktop</p>'
      document.body.prepend(alert)
    } else {
      const isAlert = document.querySelector('.alert')
      if (isAlert) {
        isAlert.remove()
      }
    }
  }
  smallScreenAlert()
  window.addEventListener('resize', smallScreenAlert)
  //end of small screen sizes alert message
  // check what page we are on
  const url = window.location.href
  const urlSplit = url.split('/')
  const page = urlSplit[/*urlSplit.length - 1*/ 3]
  const home = document.getElementById('home')

  // assign navLinkActive class depending on the url
  const listItems = document.querySelectorAll('.listItem')
  listItems.forEach((listItem) => {
    const dataHref = listItem.getAttribute('data-href')
    if (dataHref === page) {
      listItem.querySelector('.navLink').classList.add('navLinkActive')
    }
  })

  if (page == 'home') {
    try {
      console.log('home page')
      home.innerHTML =
        '<h1 class="targetHeading">Home</h1> <button class="followingButton">Following</button> <div class="tweets" id="tweets"></div>'
      handleHome()
    } catch (err) {
      console.log(err)
    }
  } else if (page == 'messages') {
    try {
      console.log('messages page')
      home.innerHTML =
        '<div class="backColumn"> <i class="fa-solid fa-arrow-left" onclick="goToMessagesOrHome()"></i> <h1 class="targetHeading">Messages</h1></div> <div class="messagesView" id="messagesView"></div> <div class="messagesDetailsHidden" id="messagesDetails"></div>'
      if (urlSplit.length == 5) {
        const username = urlSplit[urlSplit.length - 1]
        getSpecificMessages(username)
      } else {
        handleMessages()
      }
    } catch (err) {
      console.log(err)
    }
  } else if (page == 'settings') {
    try {
      console.log('settings page')
      home.innerHTML =
        '<div class="backColumn"> <i class="fa-solid fa-arrow-left" onclick="goHome()"></i> <h1 class="targetHeading">Settings</h1></div> <div class="settingsView" id="settingsView"><button class="followingButton" onclick="unhidePasswordDiv()">Change Password</button> <button class="followingButton" onclick="logout()">Logout</button><div class = "passwordDivHidden" id="passwordDiv"><input type="password"placeholder="old password"required id="changePasswordOld"/><input type="password" placeholder="new password" required id="changePasswordNew"/><button class="btn" onclick="changePassword()">Change Password</button><p id="passwordMessage" class="passwordMessage"></p> </div></div>'
      handleSettings()
    } catch (err) {
      console.log(err)
    }
  } else {
    // profile page
    try {
      console.log('profile page')
      home.innerHTML =
        '<div class="backColumn"> <i class="fa-solid fa-arrow-left" onclick="goHome()"></i> <h1 class="targetHeading">Profile</h1></div> <div class="profileHeader" id="profileHeader"></div> <div class="tweets" id="profileTweets"></div> '
      const username = urlSplit[urlSplit.length - 1]
      await handleProfile(username)
    } catch (err) {
      console.log(err)
    }
  }
})
window.addEventListener('popstate', async (event) => {
  const url = window.location.href
  const urlSplit = url.split('/')
  const page = urlSplit[/*urlSplit.length - 1 */ 3]
  const home = document.getElementById('home')

  //remove activeNavLink
  const navLinks = document.querySelectorAll('.navLink')
  navLinks.forEach((navLink) => {
    navLink.classList.remove('navLinkActive')
  })
  // assign navLinkActive class depending on the url
  const listItems = document.querySelectorAll('.listItem')
  listItems.forEach((listItem) => {
    const dataHref = listItem.getAttribute('data-href')
    if (dataHref === page) {
      listItem.querySelector('.navLink').classList.add('navLinkActive')
    }
  })

  if (page == 'home') {
    console.log('home page')
    home.innerHTML =
      '<h1 class="targetHeading">Home</h1> <button class="followingButton">Following</button> <div class="tweets" id="tweets"></div>'
    handleHome()
  } else if (page == 'messages') {
    try {
      console.log('messages page')
      home.innerHTML =
        '<div class="backColumn"> <i class="fa-solid fa-arrow-left" onclick="goToMessagesOrHome()"></i> <h1 class="targetHeading">Messages</h1></div> <div class="messagesView" id="messagesView"></div> <div class="messagesDetailsHidden" id="messagesDetails"></div>'
      if (urlSplit.length == 5) {
        const username = urlSplit[urlSplit.length - 1]
        getSpecificMessages(username)
      } else {
        handleMessages()
      }
    } catch (err) {
      console.log(err)
    }
  } else if (page == 'settings') {
    try {
      console.log('settings page')
      home.innerHTML =
        '<div class="backColumn"> <i class="fa-solid fa-arrow-left" onclick="goHome()"></i> <h1 class="targetHeading">Settings</h1></div> <div class="settingsView" id="settingsView"><button class="followingButton" onclick="unhidePasswordDiv()">Change Password</button> <button class="followingButton" onclick="logout()">Logout</button><div class = "passwordDivHidden" id="passwordDiv"><input type="password"placeholder="old password"required id="changePasswordOld"/><input type="password" placeholder="new password" required id="changePasswordNew"/><button class="btn" onclick="changePassword()">Change Password</button><p id="passwordMessage" class="passwordMessage"></p> </div></div>'
      handleSettings()
    } catch (err) {
      console.log(err)
    }
  } else {
    //profile page
    try {
      console.log('profile page')
      home.innerHTML =
        '<div class="backColumn"> <i class="fa-solid fa-arrow-left" onclick="goHome()"></i> <h1 class="targetHeading">Profile</h1></div> <div class="profileHeader" id="profileHeader"></div> <div class="tweets" id="profileTweets"></div> '
      const username = urlSplit[urlSplit.length - 1]
      await handleProfile(username)
    } catch (err) {
      console.log(err)
    }
  }
})
//------------------------------
// show comments on click
const showComments = async (tweetId) => {
  try {
    const token = getCookie('token')
    // fetch comments of the tweet
    const response = await fetch('/getTweetComments/' + tweetId, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
    const data = await response.json()
    if (data.status != true) {
      throw new Error(data.message)
    }
    const comments = data.tweets
    const tweetDiv = document.querySelector(`.tweet[dataTweetId="${tweetId}"]`)
    const commentDiv = tweetDiv.querySelector('.tweetCommentsHidden')

    commentDiv.innerHTML = '' //reset comments
    comments.forEach((comment) => {
      const commentDivx = createTweet(comment)
      commentDiv.appendChild(commentDivx)
    })
    commentDiv.classList.remove('tweetCommentsHidden')
    commentDiv.classList.add('tweetComments')
  } catch (err) {
    console.log(err)
  }
}
// handle comment post
try {
  const postCommentClose = document.getElementById('postCommentX')
  postCommentClose.addEventListener('click', (event) => {
    const ele = document.getElementById('postCommentDiv')
    ele.classList.remove('postTweet')
    ele.classList.add('postTweetHidden')
  })
  const postCommentButton = document.getElementById('postCommentButton')
  postCommentButton.addEventListener('click', async (event) => {
    const textArea = document.getElementById('postCommentTextArea')
    const content = textArea.value
    if (content.length == 0) {
      throw new Error('Tweet cannot be empty')
    }
    const cookie = getCookie('token')
    const ele = document.getElementById('postCommentDiv')
    const tweetId = ele.getAttribute('dataTweetId')
    const response = await fetch('/postComment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + cookie,
      },
      body: JSON.stringify({
        content: content,
        tweetId: tweetId,
      }),
    })
    const data = await response.json()
    if (data.status != true) {
      throw new Error(data.message)
    }
    const comment = data.tweet
    const tweetDiv = document.querySelector(`.tweet[dataTweetId="${tweetId}"]`)
    let commentDiv = tweetDiv.querySelector(
      `.tweetComments[dataTweetId="${tweetId}"]`
    )
    if (commentDiv != null) {
      // console.log('comments shown')
      const commentDivx = createTweet(comment)
      commentDiv.prepend(commentDivx)
    } else {
      // console.log('comments hidden')
      commentDiv = tweetDiv.querySelector(
        `.tweetCommentsHidden[dataTweetId="${tweetId}"]`
      )
      const commentDivx = createTweet(comment)
      commentDiv.classList.remove('tweetCommentsHidden')
      commentDiv.classList.add('tweetComments')
      commentDiv.appendChild(commentDivx)
    }
    // increment comment count
    const commentCount = tweetDiv.querySelector('.tweetChoice')
    const curr = commentCount.innerText
    const comments = Number(curr) + 1
    commentCount.innerHTML = `<i class="fa-regular fa-comment"></i> ${comments}`
    // reset textarea and close post comment div
    textArea.value = ''
    ele.classList.remove('postTweet')
    ele.classList.add('postTweetHidden')
  })
} catch (err) {
  console.log(err)
}
//-----------------
// handle retweet or like
const handleRetweetOrLike = async (tweetId, type, action) => {
  try {
    const token = getCookie('token')
    const response = await fetch('/retweetOrLike', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        tweetId: tweetId,
        type: type,
        action: action,
      }),
    })
    const data = await response.json()
    if (data.status != true) {
      throw new Error(data.message)
    }
    const tweetChoice = document.querySelector(
      `.tweet[dataTweetId="${tweetId}"] p.${type}`
    )
    const curr = tweetChoice.innerText
    if (action == 'do') {
      const count = Number(curr) + 1
      if (type == 'retweet') {
        tweetChoice.innerHTML = `<i class="fa-solid fa-retweet"></i> ${count}`
      } else {
        tweetChoice.innerHTML = `<i class="fa-regular fa-heart"></i> ${count}`
      }
      tweetChoice.classList.add('tweetChoiceActive')
    } else {
      const count = Number(curr) - 1
      if (type == 'retweet') {
        tweetChoice.innerHTML = `<i class="fa-solid fa-retweet"></i> ${count}`
      } else {
        tweetChoice.innerHTML = `<i class="fa-regular fa-heart"></i> ${count}`
      }
      tweetChoice.classList.remove('tweetChoiceActive')
    }
  } catch (err) {
    console.log(err)
  }
}
// goHome
const goHome = () => {
  window.history.pushState({ page: 'home' }, 'home', '/home')
  const popStateEvent = new PopStateEvent('popstate', {
    state: { page: 'home' },
  })
  dispatchEvent(popStateEvent)
}
const goToProfile = (username) => {
  window.history.pushState(
    //adds a new entry to the history stack, allowing you to change the URL and modify the current state without triggering a full page reload.
    { page: 'profile' },
    'profile',
    '/profile/' + username
  )
  const popstateEvent = new PopStateEvent('popstate', {
    //trigger popstate event that is being listened to
    state: { page: 'profile' },
  })
  window.dispatchEvent(popstateEvent)
}
window.goToProfile = goToProfile // used in search.js
const goToMessagesOrHome = () => {
  const messagesDetails = document.getElementById('messagesDetails')
  if (messagesDetails.classList.contains('messagesDetails')) {
    goToMessages()
  } else {
    goHome()
  }
}
const goToMessages = (username = '') => {
  window.history.pushState(
    { page: 'messages' },
    'messages',
    '/messages' + (username == '' ? '' : '/' + username)
  )
  const popstateEvent = new PopStateEvent('popstate', {
    state: { page: 'messages' },
  })
  window.dispatchEvent(popstateEvent)
}
const goToSettings = () => {
  window.history.pushState({ page: 'settings' }, 'settings', '/settings')
  const popstateEvent = new PopStateEvent('popstate', {
    state: { page: 'settings' },
  })
  window.dispatchEvent(popstateEvent)
}
window.goToMessages = goToMessages // used in socket.js
// -----------------
// update tweet timestamp
const updateTimeStamp = () => {
  const tweetTimes = document.querySelectorAll('.tweetTime')
  tweetTimes.forEach((tweetTime) => {
    const curr = tweetTime.innerText
    const minutes = Number(curr.split('m')[0]) + 1
    tweetTime.innerText = minutes + 'm'
  })
}
setInterval(updateTimeStamp, 60000)

// Handle navbar hover
const listItems = document.querySelectorAll('.listItem')
listItems.forEach((listItem) => {
  const href = listItem.getAttribute('data-href')
  if (href) {
    listItem.addEventListener('click', () => {
      if (
        listItem.querySelector('.navLink').classList.contains('navLinkActive')
      ) {
        return
      }
      // const navLinks = document.querySelectorAll('.navLink') //already done in popstate event listener
      // navLinks.forEach((navLink) => {
      //   navLink.classList.remove('navLinkActive')
      // })
      // listItem.querySelector('.navLink').classList.add('navLinkActive')
      if (href === 'home') {
        goHome()
      } else if (href === 'profile') {
        const username = document.getElementById('profileUsername').textContent
        goToProfile(username)
      } else if (href == 'messages') {
        goToMessages()
      } else if (href == 'search') {
        const searchBarInput = document.getElementById('searchBarInput')
        searchBarInput.focus()
      } else {
        goToSettings()
      }
    })
  }
})
const handleHoverNavigation = (event) => {
  event.preventDefault()
  event.stopPropagation()
  const listItem = event.currentTarget
  // const href = listItem.getAttribute('data-href')
  listItem.classList.add('hover-color')
  listItem.querySelector('.navLink').classList.add('hover-color')
}

const removeHoverColor = (event) => {
  event.preventDefault()
  event.stopPropagation()
  const listItem = event.currentTarget
  listItem.classList.remove('hover-color')
  listItem.querySelector('.navLink').classList.remove('hover-color')
}
listItems.forEach((item) => {
  item.addEventListener('mouseenter', handleHoverNavigation)
  item.addEventListener('mouseleave', removeHoverColor)
})
