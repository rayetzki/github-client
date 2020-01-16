let reposData
let userId = 'rayetzki'

window.addEventListener('load', () => {
  Promise.all[(getRemoteData(userId), getRemoteData(userId, "repos"))]
})

function transformLanguageList(reposInfo) {
  const langArr = []
  reposInfo.forEach(repo =>
    repo.language !== null ? langArr.push(repo.language) : null
  )
  return Array.from(new Set(langArr))
}

function getLanguages(reposData) {
  return transformLanguageList(reposData).map(language => `<option value=${language}>${language}</option>`)
}

function getStars(reposData) {
  return reposData.sort((a, b) => b.stargazers_count - a.stargazers_count)
}

function getRemoteData(id, dataType = "") {
  fetch(`https://api.github.com/users/${id}` + `${dataType ? "/repos" : ""}`)
    .then(users => users.json())
    .then(data => {
      if (dataType) {
        reposData = data
        logRepos(data)
      } else {
        logUser(data)
      }
    })
}

function logUser(userData) {
  const { name, avatar_url, email, blog, location } = userData

  document.querySelector("#app .user").innerHTML = `
    <header class="ui container">
      <div class="ui small image">
        <img class="header__avatar" src=${avatar_url}>
      </div>
      <div class="header__info">
        <p class="header__login">${name}</p>
        <a class="header__email"><i class="fas fa-envelope"></i> ${email || 'No email provided'}</a>
        <a class="header__blog" target="_blank" href=https://${blog}><i class="fas fa-link"></i>${blog}</a>
        <p class="header__location"><i class="fas fa-map-marker-alt"></i>${location}</p>
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
     <form>
      <div class="ui input">
        <input type="text" placeholder="Search...">
      </div>
      <button type="submit" class="ui button">Find</button>
     </form>
     <select class="ui filter dropdown">
       <option value="all">All</option>
       <option value="forks">Forks</option>
       <option value="stars">Stars</option>
     </select>
     <select class="ui sort dropdown">
        ${getLanguages(reposData)}
     </select>
    </div>
    <hr />
    <div class="results">
      ${reposList}
    </div>
   </div>`
  
  document.querySelector("form").addEventListener('submit', (event) => {
    event.preventDefault()
    userId = document.querySelector('input').value
    console.log(userId)
    Promise.all[(getRemoteData(userId), getRemoteData(userId, "repos"))]
  })

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
      const stars = getStars(reposData)

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