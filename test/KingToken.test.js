const { expectRevert } = require("C:/KingToken/openzeppelin-test-helpers-master");
const KingToken = artifacts.require('KingToken');

contract('KingToken', ([alice, bob, carol]) => {
    beforeEach(async () => {
        this.king = await KingToken.new({ from: alice });
    });

    // it('should have correct name and symbol and decimal', async () => {
    //     const name = await this.king.name();
    //     const symbol = await this.king.symbol();
    //     const decimals = await this.king.decimals();
    //     assert.equal(name.valueOf(), 'KingToken');
    //     assert.equal(symbol.valueOf(), 'KING');
    //     assert.equal(decimals.valueOf(), '18');
    // });

    // it('should only allow owner to mint token', async () => {
    //     await this.king.mint(alice, '100', { from: alice });
    //     await this.king.mint(bob, '1000', { from: alice });
    //     await expectRevert(
    //         this.king.mint(carol, '1000', { from: bob }),
    //         'Ownable: caller is not the owner',
    //     );
    //     const totalSupply = await this.king.totalSupply();
    //     const aliceBal = await this.king.balanceOf(alice);
    //     const bobBal = await this.king.balanceOf(bob);
    //     const carolBal = await this.king.balanceOf(carol);
    //     assert.equal(totalSupply.valueOf(), '1100');
    //     assert.equal(aliceBal.valueOf(), '100');
    //     assert.equal(bobBal.valueOf(), '1000');
    //     assert.equal(carolBal.valueOf(), '0');
    // });

    // it('should supply token transfers properly', async () => {
    //     await this.king.mint(alice, '100', { from: alice });
    //     await this.king.mint(bob, '1000', { from: alice });
    //     await this.king.transfer(carol, '10', { from: alice });
    //     await this.king.transfer(carol, '100', { from: bob });
    //     const totalSupply = await this.king.totalSupply();
    //     const aliceBal = await this.king.balanceOf(alice);
    //     const bobBal = await this.king.balanceOf(bob);
    //     const carolBal = await this.king.balanceOf(carol);
    //     assert.equal(totalSupply.valueOf(), '1100');
    //     assert.equal(aliceBal.valueOf(), '90');
    //     assert.equal(bobBal.valueOf(), '900');
    //     assert.equal(carolBal.valueOf(), '110');
    // });

    // it('should fail if you try to do bad transfers', async () => {
    //     await this.king.mint(alice, '100', { from: alice });
    //     await expectRevert(
    //         this.king.transfer(carol, '110', { from: alice }),
    //         'ERC20: transfer amount exceeds balance',
    //     );
    //     await expectRevert(
    //         this.king.transfer(carol, '1', { from: bob }),
    //         'ERC20: transfer amount exceeds balance',
    //     );
    // });

    // it('should update vote of delegatee when delegator transfers', async () => {
    //     await this.king.mint(alice, '100', { from: alice });
    //     await this.king.delegate(bob, { from: alice });
    //     assert.equal(await this.king.getCurrentVotes(alice), '0');
    //     assert.equal(await this.king.getCurrentVotes(bob), '100');
    //     await this.king.mint(alice, '100', { from: alice });
    //     assert.equal(await this.king.getCurrentVotes(bob), '200');
    //     await this.king.mint(carol, '100', { from: alice });
    //     await this.king.transfer(alice, '50', { from: carol });
    //     assert.equal(await this.king.getCurrentVotes(bob), '250');
    //     await this.king.delegate(carol, { from: alice });
    //     assert.equal(await this.king.getCurrentVotes(bob), '0');
    //     assert.equal(await this.king.getCurrentVotes(carol), '250');
    // });
  });
