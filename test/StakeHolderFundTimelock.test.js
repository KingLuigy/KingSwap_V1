
const { expectRevert, time } = require("C:/KingToken/openzeppelin-test-helpers-master");
const KingToken = artifacts.require('KingToken');
const StakeHolderFundTimelock = artifacts.require('StakeHolderFundTimelock');

contract('StakeHolderFundTimelock', ([alice, bob, carol, demi,friz]) => {
    
    beforeEach(async () => {


        // coFounder
        var cof = [];
        cof.push({ walletAddress: bob,index:1, statusActive:true});
        cof.push({ walletAddress: carol,index:2, statusActive:true});
        cof.push({ walletAddress: demi,index:3, statusActive:true});
        cof.push({ walletAddress: friz,index:4, statusActive:true});


        
        
        this.king = await KingToken.new({ from: alice });
     
        this.stakeholderfundtimelock = await StakeHolderFundTimelock.new(this.king.address, cof, alice,{ from: alice });

        this.withdrawInternal = await this.stakeholderfundtimelock.WITHDRAW_INTERVAL();
        this.totalWithDrawalAmt = await this.stakeholderfundtimelock.TOTAL_WITHDRAWAL_AMT_PER_INTERVAL();
    });
   

    /*
    it('elpArray should have 4 length', async () => {
        var result = await this.stakeholderFund.getTotalELP();
        assert.equal(result,5);
    });

    it('advArray should have 1 length', async () => {
        var result = await this.stakeholderFund.getTotalAdv();
        assert.equal(result,2);
    });

    it('max wallet address is 0x6330A553Fc93768F612722BB8c2eC78aC90B3bbc', async () => {
        var result = await this.stakeholderFund.advArray(0);
        assert.equal(result.walletAddress,"0x6330A553Fc93768F612722BB8c2eC78aC90B3bbc");
    });
    

    it('Add kero to Advisor team, check wallet address is same', async () => {
        await this.stakeholderFund.addAdvAddress(kero,{from: alice});
        var result = await this.stakeholderFund.advArray(2);
        var size = await this.stakeholderFund.getTotalAdv();
        //console.log("this array size : " + size);
        //console.log("this is result : " + result.walletAddress);
        assert.equal(result.walletAddress,kero);
    });

    it('Add kero to Advisor team, length is 3', async () => {
        await this.stakeholderFund.addAdvAddress(kero,{from: alice});
        var size = await this.stakeholderFund.getTotalAdv();
        assert.equal(size,3);
    });
    it('Remove KERO from adv team, status is set to false', async () => {
        await this.stakeholderFund.addAdvAddress(kero,{from: alice});
        await this.stakeholderFund.removeAdvAddress(kero,{from: alice});
        var result = await this.stakeholderFund.advArray(2);
        assert.equal(result.statusActive,false);
    });
    it('check if kero index is 2 after adding', async () =>{
        var result = await this.stakeholderFund.advArray(1);
        await this.stakeholderFund.addAdvAddress(kero,{from: alice});
        var result = await this.stakeholderFund.advArray(2);
        assert.equal(result.index,2);
    });
    it('check if eli is index 2 after adding kero and disable kero wallet', async () => {
        await this.stakeholderFund.addAdvAddress(kero,{from: alice});
        await this.stakeholderFund.removeAdvAddress(kero,{from: alice});
        assert.equal(result.walletAddress,eli);
    });

    */


//    it('should revert before lockTime', async () => {
//     await expectRevert(this.stakeholderfundtimelock.withdraw({ from: alice }), 'king locked');
//     let lastWithdrawBlock = await this.stakeholderfundtimelock.lastWithdrawBlock();
//     const unlockBlock = parseInt(lastWithdrawBlock) + parseInt(this.withdrawInternal);
//     await time.advanceBlockTo(unlockBlock);
//     await expectRevert(this.stakeholderfundtimelock.withdraw({ from: alice }), 'zero king amount');
//     await this.king.mint(this.stakeholderfundtimelock.address, '2');
//     await expectRevert(this.stakeholderfundtimelock.withdraw({ from: alice }), 'king less than allowed withdrawal amount');
//     await this.king.mint(this.stakeholderfundtimelock.address, '117000000');
//     await this.stakeholderfundtimelock.withdraw({ from: alice });
//     const bal1 = await this.king.balanceOf(bob);
//     assert.equal(bal1.valueOf(), '360000');
//     lastWithdrawBlock = await this.stakeholderfundtimelock.lastWithdrawBlock();
//     assert.equal(lastWithdrawBlock.valueOf(), unlockBlock + 5);
//     const lastWithdrawBlock2 = parseInt(lastWithdrawBlock) + (parseInt(this.withdrawInternal)*2);
//     await time.advanceBlockTo(lastWithdrawBlock2);
//     await this.stakeholderfundtimelock.withdraw({ from: alice });
//     const bal2 = await this.king.balanceOf(bob);
//     assert.equal(bal2.valueOf(), '1080000');
//     await expectRevert(this.stakeholderfundtimelock.withdraw({ from: alice }), 'king locked');
//     lastWithdrawBlock = await this.stakeholderfundtimelock.lastWithdrawBlock();
//     assert.equal(lastWithdrawBlock.valueOf(), parseInt(lastWithdrawBlock2) + 1);
    
// });

    
    
});
   