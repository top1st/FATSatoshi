const hre = require("hardhat");
const {ethers, network} = hre
const {formatEther, parseEther} = ethers.utils
const moment = require('moment')
require('dotenv').config()

const {toStringNumber} = require("../helpers/numbers");

const WBNBAddress = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'
const pancakeV2RouterAddress = '0x10ED43C718714eb63d5aA57B78B54704E256024E'



const deployer = new ethers.Wallet(process.env.PRIVATE_KEY, ethers.provider) // '0xc3e37c73eBeADED7539Cf98637b034f1dF78A687'
const newOwner = '0xdEd79cDC6bA42CEc023ce66Ce92A409f23A795d6'
const marketingAddress = '0xf7b98Bbf13903B28876CE0DB900da4fb3001a3ee'

const cake = '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'

const startTime = moment.now()

const gasLimit = 2000000

async function main() {

    const IterableMapping = await hre.ethers.getContractFactory("IterableMapping", deployer);
    const iterableMapping = await IterableMapping.deploy();
    await iterableMapping.deployed();

    const BabyOlympicCake = await hre.ethers.getContractFactory("FATSatoshi", {
        signer: deployer,
        libraries: {
            IterableMapping: iterableMapping.address
        }
    });
    const babyOlympicCake = await BabyOlympicCake.deploy();
    await babyOlympicCake.deployed();


    const tx = await babyOlympicCake.transfer(newOwner, await babyOlympicCake.balanceOf(deployer.address), {gasLimit})
    await tx.wait()

    await babyOlympicCake.transferOwnership(newOwner);


    console.log(babyOlympicCake.address, iterableMapping.address, await babyOlympicCake.owner(), formatEther(await babyOlympicCake.balanceOf(newOwner)))

    await hre.run("verify:verify", {
        address: babyOlympicCake.address,
        libraries: {
            IterableMapping: iterableMapping.address
        }
    })
}

main()
    // .then(() => process.exit(0))
    .then(() => {
        console.log(moment.duration(moment().diff(startTime)).asSeconds())
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
