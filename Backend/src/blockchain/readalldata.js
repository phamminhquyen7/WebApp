const { Wallets, Gateway } = require('fabric-network');
const fs = require('fs');

const readalldata = async(idSignature, Signature) => {
    let gateway;
    try {
        const ccpPath = '/home/pham/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json';
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const wallet = await Wallets.newInMemoryWallet();
        await wallet.put(idSignature, Signature);

        gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: idSignature, discovery: { asLocalhost: true, enabled: true } });

        const network = await gateway.getNetwork('mychannel');
        const contract = await network.getContract('fabcar');

        const result = await contract.evaluateTransaction('queryAllCars');
        console.log(`Transaction result: ${result.toString()}`);

        return JSON.parse(result.toString()); 
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        throw error;
    } finally {
        if (gateway) {
            await gateway.disconnect();
        }
    }
}


module.exports = {
    readalldata,
}