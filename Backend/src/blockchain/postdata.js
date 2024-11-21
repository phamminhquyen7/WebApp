const { Wallets, Gateway } = require('fabric-network');
const fs = require('fs');

const postdata = async (idSignature, signature, masp, tensp, motasp, maqt, macoso) => {
    const ccpPath = '/home/pham/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json';
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const wallet = await Wallets.newInMemoryWallet();
    wallet.put(idSignature, signature);

    const gateway = new Gateway();
    await gateway.connect(ccp, {wallet, identity: idSignature, discovery: {asLocalhost: true, enabled: true}});

    const channel = await gateway.getNetwork('mychannel');

    const chaincode = await channel.getContract('fabcar');

    await chaincode.submitTransaction('createCar', masp, tensp, motasp, maqt, macoso);
}

module.exports = {
    postdata,
}