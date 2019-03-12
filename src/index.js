const ethers = require('ethers')
const SoundMoneyCoin = require('./SoundMoneyCoin.json')

function run (pk, rpc, gasPrice, frequency) {
  const provider = getProvider(rpc)
  console.log('Connected to ethereum network!')
  const wallet = getWallet(pk, provider)
  console.log('Wallet initialized!')
  const contract = new ethers.Contract(SoundMoneyCoin.networks[1].address, SoundMoneyCoin.abi, wallet)
  console.log('Contract initialized!')
  setInterval(() => mint(contract, gasPrice), (60 / frequency) * 1000)
  //check balance every 60 seconds
  return setInterval(() => checkBalance(contract, gasPrice), 60 * 1000)
}

async function mint (contract, gasPrice) {
  const network = await contract.provider.getNetwork()
  if (network.chainId !== 1) {
    console.error('Not connected to mainet!')
    process.exit(-1)
  }
  let tx
  try {
    tx = await contract.mint({gasPrice})
    console.log('[Mint] Submitted mint tx with txHash ' + tx.hash)
    try {
      await tx.wait()
      console.log('[Mint] Transaction with hash ' + tx.hash + ' successfully minted SOV token!')
    } catch (e) {
      console.log('[Mint] Transaction with hash ' + tx.hash + ' failed to mint token. Reason: ' + e.reason + ' (Probably somebody minted token in that block)')
    }
  } catch (e) {
    console.log('[Mint] Failed to submit treansaction, probably there is not enough gas or nonce conflict!')
  }
}

async function checkBalance (contract, gasPrice) {
  const network = await contract.provider.getNetwork()
  if (network.chainId !== 1) {
    console.error('Not connected to mainet!')
    process.exit(-1)
  }
  const balance = await contract.balanceOf(contract.signer.getAddress())
  console.log('[Balance] Address ' + await contract.signer.getAddress() + ' has ' + balance.toString() + ' SOV tokens.')
}

function getProvider (rpc) {
  try {
    if (rpc === 'homestead') return new ethers.getDefaultProvider(rpc)
    return new ethers.providers.JsonRpcProvider(rpc)
  } catch (e) {
    console.error('Failed to create eth provider', e)
    process.exit(-1)
  }
}

function getWallet (pk, provider) {
  try {
    return new ethers.Wallet(pk, provider)
  } catch (e) {
    console.error('Failed to init wallet', e)
    process.exit(-1)
  }
}

module.exports = run
