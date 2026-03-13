/*:
 * @plugindesc แสดงชื่อ NPC เหนือหัว (กำหนดสีในบรรทัดเดียว)
 * รูปแบบ: <name:ชื่อ,#สี>
 * ตัวอย่าง: <name:ลุงร้านของชำ,#FFD700>
 * @author คุณ
 */

(function() {

  var _Sprite_Character_initialize = Sprite_Character.prototype.initialize;
  Sprite_Character.prototype.initialize = function(character) {
    _Sprite_Character_initialize.call(this, character);
    this.createNameSprite();
  };

  Sprite_Character.prototype.createNameSprite = function() {
    if (this._character instanceof Game_Event) {

      var note = this._character.event().meta.name;
      if (!note) return;

      var parts = note.split(",");
      var name = parts[0].trim();
      var color = parts[1] ? parts[1].trim() : "#FFD700"; // สี default

      this._nameSprite = new Sprite(new Bitmap(160, 32));
      var bitmap = this._nameSprite.bitmap;

      bitmap.fontSize = 20;
      bitmap.textColor = color;
      bitmap.outlineColor = "#000000";
      bitmap.outlineWidth = 6;

      bitmap.drawText(name, 0, 0, 160, 32, "center");

      this._nameSprite.anchor.x = 0.5;
      this._nameSprite.anchor.y = 1;
      this._nameSprite.y = -50;

      this.addChild(this._nameSprite);
    }
  };

})();