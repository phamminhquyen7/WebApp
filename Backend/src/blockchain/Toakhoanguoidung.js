const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

async function Toakhoanguoidung() {
    try {
        // Tạo ID ngẫu nhiên cho người dùng, chỉ gồm số
        const userID = Math.floor(10000 + Math.random() * 90000).toString(); 

        // Load the network configuration
        const ccpPath = '/home/pham/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json';
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA
        const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        const ca = new FabricCAServices(caInfo.url);

        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Kiểm tra và xóa danh tính cũ khỏi ví
        const userIdentity = await wallet.get(userID);
        if (userIdentity) {
            console.log(`Identity for the user "${userID}" already exists. Deleting it for re-registration.`);
            await wallet.remove(userID); // Xóa danh tính nếu đã tồn tại
        }

        // Kiểm tra danh tính admin trong ví
        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            console.log('Admin identity does not exist in the wallet. Please enroll admin first.');
            return;
        }

        // Build a user object for authenticating with the CA
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        // Đăng ký lại người dùng
        const secret = await ca.register({
            affiliation: 'org1.department1',
            enrollmentID: userID,
            role: 'client'
        }, adminUser);

        // Enroll người dùng để nhận danh tính mới
        const enrollment = await ca.enroll({
            enrollmentID: userID,
            enrollmentSecret: secret
        });

        // Tạo đối tượng x509Identity chứa chứng chỉ và private key
        const x509Identity = {
            id: userID,
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };

        // Lưu danh tính mới vào ví
        await wallet.put(userID, x509Identity);
        console.log(`Successfully re-registered and enrolled user "${userID}" and imported it into the wallet`);

        return x509Identity;

    } catch (error) {
        console.error(`Failed to re-register user "${userID}": ${error}`);
        throw error;
    }
}

module.exports = {
    Toakhoanguoidung
};
