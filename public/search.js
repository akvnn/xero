const delay = 300
let typingTimer
const searchBarInput = document.getElementById('searchBarInput')

searchBarInput.addEventListener('input', async (event) => {
  try {
    clearTimeout(typingTimer)
    const token = getCookie('token')
    typingTimer = setTimeout(async () => {
      const searchInputValue = searchBarInput.value
      if (searchInputValue.length <= 0) {
        const searchResultsContainer = document.getElementById('searchResults')
        searchResultsContainer.innerHTML = '' // clear old search results
        return
      }
      const response = await fetch('/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          query: searchInputValue,
        }),
      })
      const data = await response.json()
      if (data.status != true) {
        throw new Error(data.message)
      }
      const searchResultsContainer = document.getElementById('searchResults')
      searchResultsContainer.innerHTML = '' // clear old search results
      data.users.forEach((user) => {
        const searchResult = document.createElement('div')
        searchResult.classList.add('searchResult')
        const searchImg = document.createElement('img')
        searchImg.src = user.profilePicture
        searchImg.alt = user.fullName
        searchImg.classList.add('searchImg')
        const searchName = document.createElement('div')
        searchName.classList.add('searchName')
        searchName.innerText = user.fullName
        const searchUsername = document.createElement('div')
        searchUsername.classList.add('searchUsername')
        searchUsername.innerText = '@' + user.username
        searchResult.appendChild(searchImg)
        searchResult.appendChild(searchName)
        searchResult.appendChild(searchUsername)
        searchResult.addEventListener('click', (e) => {
          e.stopPropagation()
          goToProfile(user.username)
          searchBarInput.value = '' // clear search bar
          searchResultsContainer.innerHTML = '' // clear search results
        })
        searchResultsContainer.appendChild(searchResult)
      })
    }, delay)
  } catch (err) {
    console.log(err)
  }
})
