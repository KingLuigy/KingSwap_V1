const { expectRevert, time } = require("C:/KingToken/openzeppelin-test-helpers-master");
const KingToken = artifacts.require('KingToken');
const Archbishop = artifacts.require('Archbishop');
const MockERC20 = artifacts.require('MockERC20');

contract('Archbishop', ([alice, bob, carol, stakeholder, minter]) => {
    beforeEach(async () => {
        this.king = await KingToken.new({ from: alice });
    });

    it('should set correct state variables', async () => {
        this.bishop = await Archbishop.new(this.king.address, stakeholder, '1000', '0', { from: alice });
        await this.king.transferOwnership(this.bishop.address, { from: alice });
        const king = await this.bishop.king();
        const stakeholderaddress = await this.bishop.stakeholderaddress();
        const owner = await this.king.owner();
        assert.equal(king.valueOf(), this.king.address);
        assert.equal(stakeholderaddress.valueOf(), stakeholder);
        assert.equal(owner.valueOf(), this.bishop.address);
    });

    it('should allow stakeholder and only stakeholder to update stakeholder', async () => {
        this.bishop = await Archbishop.new(this.king.address, stakeholder, '1000', '0', { from: alice });
        assert.equal((await this.bishop.stakeholderaddress()).valueOf(), stakeholder);
        await expectRevert(this.bishop.stakeholder(bob, { from: bob }), 'stakeholder: wut?');
        await this.bishop.stakeholder(bob, { from: stakeholder });
        assert.equal((await this.bishop.stakeholderaddress()).valueOf(), bob);
        await this.bishop.stakeholder(alice, { from: bob });
        assert.equal((await this.bishop.stakeholderaddress()).valueOf(), alice);
    })

    context('With ERC/LP token added to the field', () => {
        beforeEach(async () => {
            this.lp = await MockERC20.new('LPToken', 'LP', '10000000000', { from: minter });
            await this.lp.transfer(alice, '1000', { from: minter });
            await this.lp.transfer(bob, '1000', { from: minter });
            await this.lp.transfer(carol, '1000', { from: minter });
            this.lp2 = await MockERC20.new('LPToken2', 'LP2', '10000000000', { from: minter });
            await this.lp2.transfer(alice, '1000', { from: minter });
            await this.lp2.transfer(bob, '1000', { from: minter });
            await this.lp2.transfer(carol, '1000', { from: minter });
        });

        it('should allow emergency withdraw', async () => {
            // 100 per block farming rate starting at block 100 with bonus until block 1000
            this.bishop = await Archbishop.new(this.king.address, stakeholder, '100', '100', { from: alice });
            await this.bishop.add('100', this.lp.address, true);
            await this.lp.approve(this.bishop.address, '1000', { from: bob });
            await this.bishop.deposit(0, '100', { from: bob });
            assert.equal((await this.lp.balanceOf(bob)).valueOf(), '900');
            await this.bishop.emergencyWithdraw(0, { from: bob });
            assert.equal((await this.lp.balanceOf(bob)).valueOf(), '1000');
        });

        it('should give out KINGs only after farming time', async () => {
            // 100 per block farming rate starting at block 100 with bonus until block 1000
            this.bishop = await Archbishop.new(this.king.address, stakeholder, '1000', '100', { from: alice });
            await this.king.transferOwnership(this.bishop.address, { from: alice });
            await this.bishop.add('100', this.lp.address, true);
            await this.lp.approve(this.bishop.address, '1000', { from: bob });
            await this.bishop.deposit(0, '100', { from: bob });
            await time.advanceBlockTo('89');
            await this.bishop.deposit(0, '0', { from: bob }); // block 90
            assert.equal((await this.king.balanceOf(bob)).valueOf(), '0');
            await time.advanceBlockTo('94');
            await this.bishop.deposit(0, '0', { from: bob }); // block 95
            assert.equal((await this.king.balanceOf(bob)).valueOf(), '0');
            await time.advanceBlockTo('99');
            await this.bishop.deposit(0, '0', { from: bob }); // block 100
            assert.equal((await this.king.balanceOf(bob)).valueOf(), '0');
            await time.advanceBlockTo('100');
            await this.bishop.deposit(0, '0', { from: bob }); // block 101
            assert.equal((await this.king.balanceOf(bob)).valueOf(), '6400');
            assert.equal((await this.king.balanceOf(stakeholder)).valueOf(), '3600');
            assert.equal((await this.king.totalSupply()).valueOf(), '10000');
            await time.advanceBlockTo('109');
            await this.bishop.deposit(0, '0', { from: bob }); // block 110
            assert.equal((await this.king.balanceOf(bob)).valueOf(), '64000');
            assert.equal((await this.king.balanceOf(stakeholder)).valueOf(), '36000');
            assert.equal((await this.king.totalSupply()).valueOf(), '100000');
        });

        it('should not distribute KINGs if no one deposit', async () => {
            // 100 per block farming rate starting at block 200 with bonus until block 1000
            this.bishop = await Archbishop.new(this.king.address, stakeholder, '1000', '200', { from: alice });
            await this.king.transferOwnership(this.bishop.address, { from: alice });
            await this.bishop.add('100', this.lp.address, true);
            await this.lp.approve(this.bishop.address, '1000', { from: bob });
            await time.advanceBlockTo('199');
            assert.equal((await this.king.totalSupply()).valueOf(), '0');
            await time.advanceBlockTo('204');
            assert.equal((await this.king.totalSupply()).valueOf(), '0');
            await time.advanceBlockTo('209');
            await this.bishop.deposit(0, '10', { from: bob }); // block 210
            assert.equal((await this.king.totalSupply()).valueOf(), '0');
            assert.equal((await this.king.balanceOf(bob)).valueOf(), '0');
            assert.equal((await this.king.balanceOf(stakeholder)).valueOf(), '0');
            assert.equal((await this.lp.balanceOf(bob)).valueOf(), '990');
            await time.advanceBlockTo('219');
            await this.bishop.withdraw(0, '10', { from: bob }); // block 220
            assert.equal((await this.king.totalSupply()).valueOf(), '100000');
            assert.equal((await this.king.balanceOf(bob)).valueOf(), '64000');
            assert.equal((await this.king.balanceOf(stakeholder)).valueOf(), '36000');
            assert.equal((await this.lp.balanceOf(bob)).valueOf(), '1000');
        });

        it('should distribute KINGs properly for each staker', async () => {
            // 1000 per block farming rate starting at block 300 with bonus until block 1000
            this.bishop = await Archbishop.new(this.king.address, stakeholder, '1000', '300', { from: alice });
            await this.king.transferOwnership(this.bishop.address, { from: alice });
            await this.bishop.add('100', this.lp.address, true);
            await this.lp.approve(this.bishop.address, '1000', { from: alice });
            await this.lp.approve(this.bishop.address, '1000', { from: bob });
            await this.lp.approve(this.bishop.address, '1000', { from: carol });
            // Alice deposits 10 LPs at block 310
            await time.advanceBlockTo('309');
            await this.bishop.deposit(0, '10', { from: alice });
            // Bob deposits 20 LPs at block 314
            await time.advanceBlockTo('313');
            await this.bishop.deposit(0, '20', { from: bob });
            // Carol deposits 30 LPs at block 318
            await time.advanceBlockTo('317');
            await this.bishop.deposit(0, '30', { from: carol });
            // Alice deposits 10 more LPs at block 320. At this point:
            // formula = (noOfBlock)*(individualDeposit/collectiveDeposit)*(Reward)
            //   Alice should have: 4*6400 + 4*1/3*6400 + 2*1/6*6400 = 36266.666
            //   Archbishop should have the remaining: 100000 - 36266.666 = 43340
            await time.advanceBlockTo('319')
            await this.bishop.deposit(0, '10', { from: alice });
            assert.equal((await this.king.totalSupply()).valueOf(), '100000');
            assert.equal((await this.king.balanceOf(alice)).valueOf(), '36266');
            assert.equal((await this.king.balanceOf(bob)).valueOf(), '0');
            assert.equal((await this.king.balanceOf(carol)).valueOf(), '0');
            assert.equal((await this.king.balanceOf(this.bishop.address)).valueOf(), '27734');
            assert.equal((await this.king.balanceOf(stakeholder)).valueOf(), '36000');
            // Bob withdraws 5 LPs at block 330. At this point:
            //   Bob should have: 4*2/3*6400 + 2*2/6*6400 + 10*2/7*6400 = 61900
            await time.advanceBlockTo('329')
            await this.bishop.withdraw(0, '5', { from: bob });
            assert.equal((await this.king.totalSupply()).valueOf(), '200000');
            assert.equal((await this.king.balanceOf(alice)).valueOf(), '36266');
            assert.equal((await this.king.balanceOf(bob)).valueOf(), '39619');
            assert.equal((await this.king.balanceOf(carol)).valueOf(), '0');
            assert.equal((await this.king.balanceOf(this.bishop.address)).valueOf(), '52115');
            assert.equal((await this.king.balanceOf(stakeholder)).valueOf(), '72000');
            // Alice withdraws 20 LPs at block 340.
            // Bob withdraws 15 LPs at block 350.
            // Carol withdraws 30 LPs at block 360.
            await time.advanceBlockTo('339')
            await this.bishop.withdraw(0, '20', { from: alice });
            await time.advanceBlockTo('349')
            await this.bishop.withdraw(0, '15', { from: bob });
            await time.advanceBlockTo('359')
            await this.bishop.deposit(0, '30', { from: carol });
            assert.equal((await this.king.totalSupply()).valueOf(), '500000');
            assert.equal((await this.king.balanceOf(stakeholder)).valueOf(), '180000');
            // Alice should have: 36266 + 10*2/7*6400 + 10*2/6.5*6400 = 74244
            assert.equal((await this.king.balanceOf(alice)).valueOf(), '74244');
            // Bob should have: 39619 + 10*1.5/6.5 * 6400 + 10*1.5/4.5*6400 = 75721
            assert.equal((await this.king.balanceOf(bob)).valueOf(), '75721');
            // Carol should have: 2*3/6*6400 + 10*3/7*6400 + 10*3/6.5*6400 + 10*3/4.5*6400 + 10*6400 = 170034
            assert.equal((await this.king.balanceOf(carol)).valueOf(), '170034'); // 2 is missing 
            assert.equal((await this.king.balanceOf(this.bishop.address)).valueOf(), '1'); // business decision who gets the correction error
            // All of them should have 10000 LPs back.
            await time.advanceBlockTo('369')
            await this.bishop.withdraw(0, '60', { from: carol });
            assert.equal((await this.king.totalSupply()).valueOf(), '600000');
            assert.equal((await this.king.balanceOf(stakeholder)).valueOf(), '216000');
            assert.equal((await this.king.balanceOf(this.bishop.address)).valueOf(), '0');
            assert.equal((await this.king.balanceOf(carol)).valueOf(), '234035');
           



            assert.equal((await this.lp.balanceOf(alice)).valueOf(), '1000');
            assert.equal((await this.lp.balanceOf(bob)).valueOf(), '1000');
            assert.equal((await this.lp.balanceOf(carol)).valueOf(), '1000');
        });

        it('should give proper KINGs allocation to each pool', async () => {
            // 100 per block farming rate starting at block 400 with bonus until block 1000
            this.bishop = await Archbishop.new(this.king.address, stakeholder, '1000', '400', { from: alice });
            await this.king.transferOwnership(this.bishop.address, { from: alice });
            await this.lp.approve(this.bishop.address, '1000', { from: alice });
            await this.lp2.approve(this.bishop.address, '1000', { from: bob });
            // Add first LP to the pool with allocation 1
            await this.bishop.add('10', this.lp.address, true);
            // Alice deposits 10 LPs at block 410
            await time.advanceBlockTo('409');
            await this.bishop.deposit(0, '10', { from: alice });
            // Add LP2 to the pool with allocation 2 at block 420
            await time.advanceBlockTo('419');
            await this.bishop.add('20', this.lp2.address, true);
            // Alice should have 10*6400 pending reward
            assert.equal((await this.bishop.pendingKing(0, alice)).valueOf(), '64000');
            // Bob deposits 10 LP2s at block 425
            await time.advanceBlockTo('424');
            await this.bishop.deposit(1, '5', { from: bob });
            // Alice should have 64000 + 5*1/3*6400 = 74667 pending reward
            assert.equal((await this.bishop.pendingKing(0, alice)).valueOf(), '74667');
            await time.advanceBlockTo('430');
            // At block 430. Bob should get 5*2/3*6400 = 33333. Alice should get ~16666 more.
            assert.equal((await this.bishop.pendingKing(0, alice)).valueOf(), '85334');
            assert.equal((await this.bishop.pendingKing(1, bob)).valueOf(), '21334');
        });

        // it('should stop giving bonus KINGs after the bonus period ends', async () => {
        //     // 100 per block farming rate starting at block 500 with bonus until block 600
        //     this.bishop = await Archbishop.new(this.king.address, stakeholder, '100', '500', { from: alice });
        //     await this.king.transferOwnership(this.bishop.address, { from: alice });
        //     await this.lp.approve(this.bishop.address, '1000', { from: alice });
        //     await this.bishop.add('1', this.lp.address, true);
        //     // Alice deposits 10 LPs at block 590
        //     await time.advanceBlockTo('589');
        //     await this.bishop.deposit(0, '10', { from: alice });
        //     // At block 605, she should have 1000*10 + 100*5 = 10500 pending.
        //     await time.advanceBlockTo('100505');
        //     assert.equal((await this.bishop.pendingKing(0, alice)).valueOf(), '10500');
        //     // At block 606, Alice withdraws all pending rewards and should get 10600.
        //     await this.bishop.deposit(0, '0', { from: alice });
        //     assert.equal((await this.bishop.pendingKing(0, alice)).valueOf(), '0');
        //     assert.equal((await this.king.balanceOf(alice)).valueOf(), '10600');
        // });

        it('getMultiplier', async () => {
            this.bishop = await Archbishop.new(this.king.address, stakeholder, '1000', '0', { from: alice });
            assert.equal((await this.bishop.getMultiplier(0, 64000)).valueOf(), '640000');
            assert.equal((await this.bishop.getMultiplier(64000, 64001)).valueOf(), '1');
        });

        it('add lp token', async () => {
            this.bishop = await Archbishop.new(this.king.address, stakeholder, '100', '0', { from: alice });
            await this.bishop.add('10', this.lp.address, false);
            await expectRevert(
                this.bishop.add('10', this.lp.address, false),
                'Archbishop:duplicate add.',
            );
            await this.bishop.add('10', this.lp2.address, false);
            assert.equal(await this.bishop.lpTokenPID(this.lp.address), 1);
            assert.equal(await this.bishop.lpTokenPID(this.lp2.address), 2);
            assert.equal(await this.bishop.poolLength(), 2);
        });
    });
});




