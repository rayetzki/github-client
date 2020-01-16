let userId
let userData
let reposData

function transformLanguageList() {
  const langArr = []
  reposData.forEach(repo => repo.language !== null ? langArr.push(repo.language) : null)
  return Array.from(new Set(langArr))
}

function getLanguages() {
  let languageList = transformLanguageList()
  return languageList.map(language => {
    return `<option value=${language}>${language}</option>`
  }) 
}

function getStars() {
  return reposData.sort((a,b) => b.stargazers_count - a.stargazers_count)
}

function getRemoteData(userId = 'rayetzki', dataType = '') {
  fetch(`https://api.github.com/users/${userId}` + `${dataType ? '/repos' : ''}`)
    .then(users => users.json())
    .then(data => {
      if (dataType) {
        reposData = data
        logRepos()
      } else {
        userData = data
        logUser()
      }
    })
}

Promise.all[getRemoteData(), getRemoteData('rayetzki', 'repos')]

async function logUser(data) {
  const userInfo = {
    login: userData.name,
    avatar: userData.avatar_url,
    email: userData.email,
    blog: userData.blog
  }

  await console.dir(userData)
  
  document.querySelector('#app .user').innerHTML = `
     <header class="ui container">
       <div class="ui small image">
         <img class="header__avatar" src=${userInfo.avatar}>
       </div>
       <div class="header__info">
        <p class="header__login">${userInfo.login}</p>
        <a class="header__email"><i class="fas fa-envelope"></i> ${userInfo.email}<a>
        <a class="header__blog" target="_blank"><i class="fas fa-link"></i> ${userInfo.blog}<a>
       </div>
     </header>
  `
}

function logRepos() {
  let list = reposData.map(repo => {
    return `
     <div class="ui card">
       <a card="card__name" href=${repo.html_url} target="_blank"><i class="fas fa-book"></i> ${repo.name}</a>
       <p class="card__description">${repo.description ? repo.description : "No description"}</p>
      <div class="card__details"> 
       <span><i class="fas ${repo.language ? 'fa-circle' : 'fa-code-branch'}"></i> ${repo.language || repo.forks_count}</span>
       <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
      <span>Updated on ${new Date(repo.updated_at).toLocaleDateString()}</span>
      </div>
     </div>
    `
  }).join('')
  
  document.querySelector('#app .repos').innerHTML = `
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
      ${list}
    </div>
   </div>
`
  
  document.querySelector('.sort').addEventListener('change', function(event) {
    let list;
    let languages = transformLanguageList();
    if (languages.includes(event.target.value)) {
      let found = reposData.filter(repo => repo.language === event.target.value);
       list = found.map(item => {
        return `
         <div class="ui card">
           <a card="card__name" href=${item.html_url} target="_blank"><i class="fas fa-book"></i> ${item.name}</a>
           <p class="card__description">${item.description ? item.description : "No description"}</p>
          <div class="card__details"> 
           <span><i class="fas ${item.language ? 'fa-circle' : 'fa-code-branch'}"></i> ${item.language || item.forks_count}</span>
           <span><i class="fas fa-star"></i> ${item.stargazers_count}</span>
           <span>Updated on ${new Date(item.updated_at).toLocaleDateString()}</span>
      </div>
     </div>
     `}).join('')
    }
    
    document.querySelector('.results').innerHTML = `${list}`;
  })
  
    document.querySelector('.filter').addEventListener('change', (event) => {  
     let list;
     if (event.target.value === "forks") {
       let forked = reposData.filter(repo => repo.forks_count > 0);
    
        list = forked.map(item => {
        return `
         <div class="ui card">
           <a card="card__name" href=${item.html_url} target="_blank"><i class="fas fa-book"></i> ${item.name}</a>
           <p class="card__description">${item.description ? item.description : "No description"}</p>
          <div class="card__details"> 
           <span><i class="fas ${item.language ? 'fa-circle' : 'fa-code-branch'}"></i> ${item.language || item.forks_count}</span>
           <span><i class="fas fa-star"></i> ${item.stargazers_count}</span>
           <span>Updated on ${new Date(item.updated_at).toLocaleDateString()}</span>
      </div>
     </div>
     `}).join('')
    } else if (event.target.value === 'stars') {
      const stars = getStars()
      list = stars.map(repo => {
        return `
         <div class="ui card">
           <a card="card__name" href=${repo.html_url} target="_blank"><i class="fas fa-book"></i> ${repo.name}</a>
           <p class="card__description">${repo.description ? repo.description : "No description"}</p>
         <div class="card__details"> 
          <span><i class="fas ${repo.language ? 'fa-circle' : 'fa-code-branch'}"></i> ${repo.language || repo.forks_count}</span>
          <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
          <span>Updated on ${new Date(repo.updated_at).toLocaleDateString()}</span>
         </div>
        </div>
    `}).join('')
    } else {
      list = reposData.map(repo => {
        return `
         <div class="ui card">
           <a card="card__name" href=${repo.html_url} target="_blank"><i class="fas fa-book"></i> ${repo.name}</a>
           <p class="card__description">${repo.description ? repo.description : "No description"}</p>
         <div class="card__details"> 
          <span><i class="fas ${repo.language ? 'fa-circle' : 'fa-code-branch'}"></i> ${repo.language || repo.forks_count}</span>
          <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
          <span>Updated on ${new Date(repo.updated_at).toLocaleDateString()}</span>
         </div>
        </div>
     `}).join('')
    }
 
    document.querySelector('.results').innerHTML = `${list}`;
  }) 
}
