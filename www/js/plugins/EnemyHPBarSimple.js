/*:
 * @plugindesc Simple Enemy HP Bar + Number for RPG Maker MV
 * @author ChatGPT
 */

(function() {

var _Sprite_Enemy_update = Sprite_Enemy.prototype.update;
Sprite_Enemy.prototype.update = function() {
    _Sprite_Enemy_update.call(this);
    this.updateHpBar();
};

Sprite_Enemy.prototype.updateHpBar = function() {
    if (!this._enemyHpBar) {
        this.createHpBar();
    }

    var enemy = this._enemy;
    var rate = enemy.hp / enemy.mhp;

    this._enemyHpBar.clear();
    
    var width = 120;
    var height = 10;

    // background
    this._enemyHpBar.fillRect(0, 0, width, height, "#000000");

    // hp fill
    this._enemyHpBar.fillRect(0, 0, width * rate, height, "#ff4444");

    // hp text
    this._enemyHpBar.fontSize = 14;
    this._enemyHpBar.drawText(enemy.hp + " / " + enemy.mhp, 0, 10, width, 'center');
};

Sprite_Enemy.prototype.createHpBar = function() {
    this._enemyHpBar = new Bitmap(120, 40);
    this._enemyHpSprite = new Sprite(this._enemyHpBar);
    this._enemyHpSprite.y = -40;
    this.addChild(this._enemyHpSprite);
};

})();