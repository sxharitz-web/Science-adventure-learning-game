/*:
 * @plugindesc v1.1 Allows player movement via WASD keys and activation via E key in addition to standard arrow keys and Enter/Space for activation. No lag issues.
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * This plugin enables player movement using the WASD keys and activation of
 * events using the E key. These controls work in parallel with the standard
 * arrow keys for movement and Enter/Space for activation.
 *
 * ============================================================================
 * Instructions
 * ============================================================================
 * To use this plugin, simply install it in your project's Plugin Manager.
 * There are no additional parameters to configure.
 *
 * ============================================================================
 * Terms of Use
 * ============================================================================
 * Free for use in both commercial and non-commercial projects, with credit
 * given to Design's Edge.
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 * Version 1.1:
 * - Improved performance and fixed functionality issues
 * - Added comments for better readability
 */

(function() {
    // Extend Input to recognize WASD keys and E for interaction
    var DE_Input_initialize = Input.initialize;
    Input.initialize = function() {
        DE_Input_initialize.call(this);
        this.keyMapper[87] = 'up';    // W
        this.keyMapper[65] = 'left';  // A
        this.keyMapper[83] = 'down';  // S
        this.keyMapper[68] = 'right'; // D
        this.keyMapper[69] = 'ok';    // E
    };

    // Ensure that pressing 'E' triggers the same event as Enter/Space
    var DE_Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        DE_Scene_Map_update.call(this);
        this.updateWasdInput();
    };

    Scene_Map.prototype.updateWasdInput = function() {
        if (Input.isTriggered('ok')) {
            if (!$gamePlayer.isMoving() && !$gameMessage.isBusy()) {
                $gamePlayer.checkEventTriggerHere([0]);
                if ($gameMap.setupStartingEvent()) return;
                $gamePlayer.checkEventTriggerThere([0, 1, 2]);
                $gameMap.setupStartingEvent();
            }
        }
    };

    // Modify player's movement to support WASD and arrow keys
    var DE_Game_Player_moveByInput = Game_Player.prototype.moveByInput;
    Game_Player.prototype.moveByInput = function() {
        if (!this.isMoving() && this.canMove()) {
            var direction = this.getInputDirection();
            if (direction > 0) {
                $gameTemp.clearDestination();
                this.executeMove(direction);
            } else if ($gameTemp.isDestinationValid()){
                var x = $gameTemp.destinationX();
                var y = $gameTemp.destinationY();
                direction = this.findDirectionTo(x, y);
                if (direction > 0) {
                    this.executeMove(direction);
                }
            }
        }
    };

    Game_Player.prototype.getInputDirection = function() {
        return Input.dir4;
    };

})();
