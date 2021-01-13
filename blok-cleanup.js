const axios = require('axios')
const config = require('./config.json')

let renderer = axios.create({
  baseURL: 'https://api.storyblok.com/v1/spaces/' + config.storyblok.spaceId,
  headers: {
    'Authorization': config.storyblok.PRIVATE_MANAGEMENT_TOKEN
  }
})

renderer.post('template_deletions', {
  template_deletion: {
    env: 'live',
    token: config.storyblok.themeToken
  }
}).then((res) => {
  if (res.status == 201) {
    console.log('Templates have been deleted!')
  } else {
    console.log(res.body)
  }
})