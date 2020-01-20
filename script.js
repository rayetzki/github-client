let reposData
let userId = 'rayetzki'

window.addEventListener('load', () => {
  loadRemoteData(userId)
})

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => document.querySelector('#loadingWrapper').style.display = 'none', 1000)
})

function loadRemoteData(userId) {
  try {
    Promise.all[(getRemoteData(userId), getRemoteData(userId, "repos"))]
  } catch (error) {
    console.error(error)
  }
}

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
  const { name, avatar_url, blog, location } = userData

  document.querySelector("#app .user").innerHTML = `
    <header class="ui container">
      <div class="ui small image">
        <img class="header__avatar" src=${avatar_url}>
      </div>
      <div class="header__info">
        <p class="header__login">${name}</p>
        <a class="header__blog" target="_blank" href=https://${blog}><i class="fas fa-link"></i>${blog}</a>
        <p class="header__location"><i class="fas fa-map-marker-alt"></i>${location}</p>
      </div>
    </header>`
}

function logFilteredRepos(filteredObject) {
  const { html_url, name, description, language, forks_count, stargazers_count, updated_at } = filteredObject
  
  return `
    <div class="ui card">
      <a card="card__name" href=${
        html_url
      } target="_blank"><i class="fas fa-book"></i> ${name}</a>
      <p class="card__description">${
        description ? description : "No description"
      }</p>
    <div class="card__details">  
      <span><i class="fas ${
        language ? "fa-circle" : "fa-code-branch"
      }"></i> ${language || forks_count}</span>
      <span><i class="fas fa-star"></i> ${stargazers_count}</span>
      <span>Updated on ${new Date(updated_at).toLocaleDateString()}</span>
    </div>
    </div>`
}

function logRepos() {
  const reposList = reposData.map(repo => logFilteredRepos(repo)).join("")

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
    
    if (userId === '') {
      return
    } else {
      loadRemoteData(userId)
    }
  })

  document.querySelector(".sort").addEventListener("change", (event) => {
    const languages = transformLanguageList(reposData)

    if (languages.includes(event.target.value)) {
      const found = reposData.filter(repo => repo.language === event.target.value)
      const list = found.map(repo => logFilteredRepos(repo)).join('')
      document.querySelector(".results").innerHTML = `${list}`
    }    
  })

  document.querySelector(".filter").addEventListener("change", event => {
    let list

    if (event.target.value === "forks") {
      const forked = reposData.filter(repo => repo.forks_count > 0)
      list = forked.map(item => logFilteredRepos(item)).join('')
    } else if (event.target.value === "stars") {
      list = getStars(reposData).map(repo => logFilteredRepos(repo)).join('')
    } else {
      list = reposData.map(item => logFilteredRepos(item)).join('')
    }

    document.querySelector(".results").innerHTML = `${list}`
  })
}