
const chokidar = require('chokidar')
const axios = require('axios')
const axiosConcurrency = require('axios-concurrency')
const config = require('./config.json')
const isBinaryFileSync = require('isbinaryfile').isBinaryFileSync
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const glob = require('glob')

let renderer = axios.create({
  baseURL: 'https://api.storyblok.com/v1/spaces/' + config.storyblok.spaceId
})
axiosConcurrency.ConcurrencyManager(renderer, MAX_CONCURRENT_REQUESTS = 1)

if (process.argv.indexOf('--watch') >= 0) {
  chokidar.watch(['views/**', 'dist/**'], { ignored: /(^|[\/\\])\../, })
  .on('add', filePath => {  upload(filePath, 'add') })
  .on('change', filePath => { upload(filePath, 'change') })
  .on('unlink', filePath => { console.log('unlink', filePath) })
} else {
  glob('{dist,views}/**', { nodir: true }, (error, filePaths) => {
    filePaths.forEach((filePath) => {
      upload(filePath, 'deploy', 'live')
    })
  })
}

const upload = (filePath, eventType, environment) => {
  
  let key = encodeURI(path.relative('views', filePath))
  if (filePath.indexOf('dist') >= 0) {
    key = encodeURI(path.relative('dist', filePath))
  }
  
  let file = fs.readFileSync(filePath)
  let isBinary = isBinaryFileSync(file)
  let props = {}
  let contents = file.toString()

  if (contents.length == 0) {
    console.log(chalk.gray(chalk.bold(filePath) + ' added but empty, will be skipped.'))
    return;
  }

  props.path = key

  if (isBinary) {
    props.attachment = contents.toString('base64')
    props.tmpl_type = 'binary_asset'
  } else {
    props.body = contents.toString()
    props.tmpl_type = 'text'

    let keyParts = key.split('.')
    let lastPart = keyParts[keyParts.length - 1] // get file extension

    if (['js', 'css', 'svg', 'json'].indexOf(lastPart) > -1) {
      props.tmpl_type = 'asset'
    }
  }

  props.type = props.tmpl_type // For backwards compability copy value to type
  props.env = environment || config.storyblok.environment // set default environment

  let params = {
    template: props,
    token: config.storyblok.themeToken
  }
  
  renderer.put('/templates/create_or_update', params).then(() => {
    console.log(chalk.greenBright(chalk.bold(filePath) + ' uploaded to ' + chalk.bold(props.env)  + ' after ' + chalk.bold(eventType) + ' event.'))
  }).catch((error) => {
    if (config.storyblok.debug) {
      console.error(error)
    }
  })
}