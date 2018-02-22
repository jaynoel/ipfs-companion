'use strict'

const Ipfs = require('ipfs')
const { optionDefaults } = require('../options')

let node = null

exports.init = function init (opts) {
  console.log('[ipfs-companion] Embedded ipfs init')

  let config = JSON.parse(optionDefaults.ipfsNodeConfig)

  try {
    config = JSON.parse(opts.ipfsNodeConfig)
  } catch (err) {
    console.warn('[ipfs-companion] Ignoring invalid node config', err)
  }

  node = new Ipfs(config)

  if (node.isOnline()) {
    return Promise.resolve(node)
  }

  return new Promise((resolve, reject) => {
    // TODO: replace error listener after a 'ready' event.
    node.once('error', (err) => reject(err))
    node.once('ready', () => resolve(node))
  })
}

exports.destroy = async function () {
  console.log('[ipfs-companion] Embedded ipfs destroy')
  if (!node) return

  await node.stop()
  node = null
}
