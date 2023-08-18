const loginbtn = document.getElementById('loginbtn')
loginbtn.addEventListener('click', async (event) => {
  event.preventDefault()
  const usernameOremailOrphone = document.getElementById(
    'usernameOremailOrphone'
  ).value
  const password = document.getElementById('passwordLogin').value
  await login(usernameOremailOrphone, password)
})
