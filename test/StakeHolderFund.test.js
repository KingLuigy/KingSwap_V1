
const { expectRevert, time } = require("C:/Users/Kenneth/OneDrive/Desktop/testaddress/openzeppelin-test-helpers-master");
const KingToken = artifacts.require('KingToken');
const StakeHolderFund = artifacts.require('StakeHolderFund');

contract('StakeHolderFund', ([alice, bob, carol, demi, eli, friz, gin,fatboy,max,kero]) => {
    
    beforeEach(async () => {
        //elp 99
        var elp = [];
        elp.push({walletAddress:alice,index:1,allocPoint:47,statusActive : true});
        elp.push({walletAddress:bob,index:2,allocPoint:30,statusActive : true});
        elp.push({walletAddress:carol,index:3,allocPoint:5,statusActive : true});
        elp.push({walletAddress:fatboy,index:4,allocPoint:3,statusActive : true});
        elp.push({walletAddress:friz,index:5,allocPoint:14,statusActive : true});
        //console.log("this elp length: " + elp.length)
        //console.log("show me : " + elp);
        //advisor
        var adv = [];
        adv.push({ walletAddress: max,index:1, statusActive:true});
        adv.push({ walletAddress: eli,index:2, statusActive:true});

        // eTeam
        var d = [];
        d.push({ walletAddress: friz,index:1, statusActive:true});
        d.push({ walletAddress: gin,index:2, statusActive:true});
        d.push({ walletAddress: fatboy,index:3, statusActive:true});
        
        
        var company = demi;
        this.king = await KingToken.new({ from: alice });
     
        this.stakeholderFund = await StakeHolderFund.new(this.king.address, elp, adv, d, company,kero,{ from: alice });
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


    it('Check if withdraw function fund divided correctly with no balance left', async () => {
        await this.king.mint(this.stakeholderFund.address, '1000000000');
        await this.stakeholderFund.withdraw({from: alice});
        //var result = await this.stakeholderFund.ELPAllocPoint();
        //assert.equal(result.valueOf(), 99);
        //1170/3600 * 1000000000 = 338,888,888.8888889
        assert.equal((await this.king.balanceOf(kero)).valueOf(), '325000000');
        //1500/3600 * 1000000000 * 47/99 = 197,811,447.8
        assert.equal((await this.king.balanceOf(alice)).valueOf(), '197811447');
        
        assert.equal((await this.king.balanceOf(eli)).valueOf(), '13888888');
        
        assert.equal((await this.king.balanceOf(gin)).valueOf(), '23148148');
        
        //assert.equal((await this.king.balanceOf(fatboy)).valueOf(), '8231');
        assert.equal((await this.king.balanceOf(this.stakeholderFund.address)).valueOf(), '0');
        assert.equal((await this.king.balanceOf(demi)).valueOf(), '161111116');
    });

    
    
});
   