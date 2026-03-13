/*:
 * @plugindesc ปุ่มไอคอนมุมซ้ายบน (ควบคุมเปิด/ปิดได้แยกปุ่ม)
 * @author คุณ
 */

(function() {

  // ===== ตั้งค่าแมพกลับ =====
  var returnMapId = 2;
  var returnX = 16;
  var returnY = 12;

  var clickSound = "Decision2";

  // ===== Switch ควบคุม =====
  var masterSwitch = 13; // เปิด/ปิดทั้งหมด
  var homeSwitch   = 12; // ปุ่มหน้าหลัก
  var backSwitch   = 11; // ปุ่มกลับแมพ

  function createIconButton(imageName, x, y, clickHandler) {
    var sprite = new Sprite(ImageManager.loadSystem(imageName));

    sprite.x = x;
    sprite.y = y;

    sprite.update = function() {

      // ถ้า Master ปิด → ไม่แสดง
      if (!$gameSwitches.value(masterSwitch)) {
        this.visible = false;
        return;
      }

      // ซ่อนระหว่างคัตซีน
      if ($gameMap.isEventRunning() || $gameMessage.isBusy()) {
        this.visible = false;
        return;
      }

      this.visible = true;

      // ตรวจการคลิก
      if (TouchInput.isTriggered() &&
          TouchInput.x >= this.x &&
          TouchInput.x <= this.x + this.width &&
          TouchInput.y >= this.y &&
          TouchInput.y <= this.y + this.height) {

        this.opacity = 180;

        AudioManager.playSe({
          name: clickSound,
          volume: 90,
          pitch: 100,
          pan: 0
        });

        clickHandler();
      } else {
        this.opacity = 255;
      }
    };

    return sprite;
  }

  var _Scene_Map_createDisplayObjects =
    Scene_Map.prototype.createDisplayObjects;

  Scene_Map.prototype.createDisplayObjects = function() {
    _Scene_Map_createDisplayObjects.call(this);

    // ปุ่มหน้าหลัก
    this._btnHome = createIconButton(
      "icon_home",
      10,
      10,
      function() {
        DataManager.setupNewGame();
SceneManager.goto(Scene_Map);
      }
    );
    this.addChild(this._btnHome);

    // ปุ่มกลับแมพ
    this._btnBack = createIconButton(
      "icon_back",
      84,
      10,
      function() {
        $gamePlayer.reserveTransfer(returnMapId, returnX, returnY, 2, 0);
      }
    );
    this.addChild(this._btnBack);

    // ===== ควบคุมแยกปุ่ม =====
    var _update = this.update;
    this.update = function() {
      _update.call(this);

      if (this._btnHome)
        this._btnHome.visible =
          $gameSwitches.value(masterSwitch) &&
          $gameSwitches.value(homeSwitch);

      if (this._btnBack)
        this._btnBack.visible =
          $gameSwitches.value(masterSwitch) &&
          $gameSwitches.value(backSwitch);
    };
  };

})();