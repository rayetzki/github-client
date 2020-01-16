let userId
let userData
let reposData

function transformLanguageList(reposInfo) {
  const langArr = []
  reposInfo.forEach(repo =>
    repo.language !== null ? langArr.push(repo.language) : null
  )
  return Array.from(new Set(langArr))
}

function getLanguages() {
  const languageList = transformLanguageList(reposData)
  return languageList.map(language => `<option value=${language}>${language}</option>`)
}

function getStars() {
  return reposData.sort((a, b) => b.stargazers_count - a.stargazers_count)
}

function getRemoteData(userId = "rayetzki", dataType = "") {
  fetch(`https://api.github.com/users/${userId}` + `${dataType ? "/repos" : ""}`)
    .then(users => users.json())
    .then(data => {
      if (dataType) {
        reposData = data
        logRepos()
      } else {
        userData = data
        logUser(userData)
      }
    })
}

Promise.all[(getRemoteData(), getRemoteData("rayetzki", "repos"))]

function logUser(userData) {
  const { name, avatar_url, email, blog } = userData

  document.querySelector("#app .user").innerHTML = `
    <header class="ui container">
      <div class="ui small image">
        <img class="header__avatar" src=${avatar_url}>
      </div>
      <div class="header__info">
        <p class="header__login">${name}</p>
        <a class="header__email"><i class="fas fa-envelope"></i> ${email}<a>
        <a class="header__blog" target="_blank"><i class="fas fa-link"></i> ${blog}<a>
      </div>
    </header>`
}

function logRepos() {
  const reposList = reposData.map(repo => `
     <div class="ui card">
       <a card="card__name" href=${
         repo.html_url
       } target="_blank"><i class="fas fa-book"></i> ${repo.name}</a>
       <p class="card__description">${
         repo.description ? repo.description : "No description"
       }</p>
      <div class="card__details"> 
       <span><i class="fas ${
         repo.language ? "fa-circle" : "fa-code-branch"
       }"></i> ${repo.language || repo.forks_count}</span>
       <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
      <span>Updated on ${new Date(repo.updated_at).toLocaleDateString()}</span>
      </div>
     </div>`
    ).join("")

  document.querySelector("#app .repos").innerHTML = `
    <div class="search">
     <div class="ui input">
      <input type="text" placeholder="Search...">
     </div>
      <select class="ui filter dropdown">
       <option value="all">All</option>
       <option value="forks">Forks</option>
       <option value="stars">Stars</option>
      </select>
      <select class="ui sort dropdown">
        ${getLanguages()}
      </select>
     </div>
    <hr />
    <div class="results">
      ${reposList}
    </div>
   </div>`

  document.querySelector(".sort").addEventListener("change", (event) => {
    const languages = transformLanguageList(reposData)

    if (languages.includes(event.target.value)) {
      const found = reposData.filter(repo => repo.language === event.target.value)
      
      const list = found.map(item => `
        <div class="ui card">
          <a card="card__name" href=${
            item.html_url
          } target="_blank"><i class="fas fa-book"></i> ${item.name}</a>
          <p class="card__description">${
            item.description ? item.description : "No description"
          }</p>
         <div class="card__details">  
          <span><i class="fas ${
            item.language ? "fa-circle" : "fa-code-branch"
          }"></i> ${item.language || item.forks_count}</span>
          <span><i class="fas fa-star"></i> ${item.stargazers_count}</span>
          <span>Updated on ${new Date(item.updated_at).toLocaleDateString()}</span>
         </div>
        </div>`
      ).join("")

      document.querySelector(".results").innerHTML = `${list}`
    }    
  })

  document.querySelector(".filter").addEventListener("change", event => {
    let list

    if (event.target.value === "forks") {
      const forked = reposData.filter(repo => repo.forks_count > 0)

      list = forked.map(item => `
        <div class="ui card">
          <a card="card__name" href=${
            item.html_url
          } target="_blank"><i class="fas fa-book"></i> ${item.name}</a>
          <p class="card__description">${
            item.description ? item.description : "No description"
          }</p>
        <div class="card__details"> 
          <span><i class="fas ${
            item.language ? "fa-circle" : "fa-code-branch"
          }"></i> ${item.language || item.forks_count}</span>
          <span><i class="fas fa-star"></i> ${item.stargazers_count}</span>
          <span>Updated on ${new Date(item.updated_at).toLocaleDateString()}</span>
        </div>
        </div>`
      ).join("")
    } else if (event.target.value === "stars") {
      const stars = getStars()

      list = stars.map(repo => `
         <div class="ui card">
           <a card="card__name" href=${
             repo.html_url
           } target="_blank"><i class="fas fa-book"></i> ${repo.name}</a>
           <p class="card__description">${
             repo.description ? repo.description : "No description"
           }</p>
         <div class="card__details"> 
          <span><i class="fas ${
            repo.language ? "fa-circle" : "fa-code-branch"
          }"></i> ${repo.language || repo.forks_count}</span>
          <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
          <span>Updated on ${new Date(repo.updated_at).toLocaleDateString()}</span>
         </div>
        </div>`
      ).join("")
    } else {
      list = reposData.map(repo => `
        <div class="ui card">
          <a card="card__name" href=${
            repo.html_url
          } target="_blank"><i class="fas fa-book"></i> ${repo.name}</a>
          <p class="card__description">${
            repo.description ? repo.description : "No description"
          }</p>
          <div class="card__details"> 
            <span><i class="fas ${
              repo.language ? "fa-circle" : "fa-code-branch"
            }"></i> ${repo.language || repo.forks_count}</span>
            <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
            <span>Updated on ${new Date(repo.updated_at).toLocaleDateString()}</span>
         </div>
        </div>`
      ).join("")
    }

    document.querySelector(".results").innerHTML = `${list}`
  })
}
