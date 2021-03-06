/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */

const contract = require('truffle-contract');
const generateDeployTx = require('../node_modules/eip820/js/deployment')
  .generateDeployTx;
const {
  ERC820RegistryAbi,
  ERC820RegistryByteCode,
} = require('../node_modules/eip820/build/ERC820Registry.sol.js');

module.exports = (deployer, network, accounts) => {
  deployer.then(async () => {
    let erc820;
    try {
      erc820 = contract({
        abi: ERC820RegistryAbi,
        unlinked_binary: ERC820RegistryByteCode,
      });
      erc820.setProvider(web3.currentProvider);
      erc820 = await erc820
        .at('0xa691627805d5FAE718381ED95E04d00E20a1fea6')
        .then(instance => instance);
    } catch (e) {
      const { rawTx, sender, contractAddr } = generateDeployTx();
      await web3.eth.sendTransaction({
        from: accounts[0],
        to: sender,
        value: web3.toWei('0.1'),
      });
      await web3.eth.sendRawTransaction(rawTx);
      erc820 = contract({
        abi: ERC820RegistryAbi,
        unlinked_binary: ERC820RegistryByteCode,
      });
      await erc820.setProvider(web3.currentProvider);
      erc820 = await erc820.at(contractAddr).then(i => i);
    }
    process.env.MIGRATION && console.log('EIP820 Registry:', erc820.address);
  });
};
