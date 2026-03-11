/*:
 * @plugindesc v1.0 ส่งชื่อผู้เล่นและคะแนนหลังจบการต่อสู้ขึ้น Google Sheets ผ่าน Google Apps Script
 * @author Teacher
 *
 * @param WebAppUrl
 * @text Google Web App URL
 * @type string
 * @desc URL จากการ Deploy Google Apps Script (แบบ Web App)
 * @default
 *
 * @param ScoreVariableId
 * @text ตัวแปรคะแนน (Score Variable ID)
 * @type variable
 * @desc ID ของตัวแปรที่ใช้เก็บคะแนน/แต้มของผู้เล่น
 * @default 1
 *
 * @param StudentActorId
 * @text นักเรียน (Student Actor ID)
 * @type actor
 * @desc Actor ที่ใช้แทนตัวผู้เล่น/นักเรียน เพื่อเอาชื่อไปส่งขึ้น Google Sheet
 * @default 1
 *
 * @param UseActorName
 * @text ใช้ชื่อจาก Actor?
 * @type boolean
 * @on ใช้ Actor
 * @off ใช้ตัวแปรชื่อ
 * @desc เลือกว่าจะใช้ชื่อจาก Actor หรือใช้จากตัวแปร
 * @default true
 *
 * @param StudentNameVariableId
 * @text ตัวแปรชื่อผู้เล่น (ถ้าไม่ใช้ Actor)
 * @type variable
 * @desc ถ้า UseActorName = false จะใช้ค่าข้อความจากตัวแปรนี้เป็นชื่อผู้เล่น
 * @default 2
 *
 * @help
 * ---------------------------------------------------------------------------
 * GS_BattleScore.js
 * ---------------------------------------------------------------------------
 * ปลั๊กอินนี้ใช้สำหรับ:
 *  - ส่ง "ชื่อผู้เล่น/นักเรียน" + "คะแนน" + "ผลการต่อสู้" + "รายชื่อมอน" + "ชื่อแมพ"
 *    ไปบันทึกใน Google Sheets ผ่าน Google Apps Script (Web App)
 *
 * การทำงาน:
 *  - เมื่อจบการต่อสู้ (แพ้หรือชนะ)
 *      → ปลั๊กอินจะรวบรวมข้อมูล
 *      → สร้าง JSON
 *      → ส่งไปยัง WebAppUrl ด้วย HTTP POST (แบบ JSON)
 *
 * ข้อมูลที่ส่งไป (ตัวอย่าง JSON):
 *  {
 *    "studentName": "Player1",
 *    "score": 150,
 *    "result": "win",
 *    "enemies": "Slime, Bat",
 *    "mapName": "Forest 1"
 *  }
 *
 * ---------------------------------------------------------------------------
 * ขั้นตอนการใช้งาน (สรุป):
 * ---------------------------------------------------------------------------
 * 1) สร้าง Google Sheet
 *    - แถวแรกใส่หัวคอลัมน์ เช่น:
 *      Timestamp | StudentName | Score | Result | Enemies | MapName
 *
 * 2) สร้าง Google Apps Script (ผูกกับ Google Sheet นั้น)
 *    - ใช้โค้ดประมาณนี้ใน Apps Script:
 *
 *    function doPost(e) {
 *      var ss = SpreadsheetApp.getActiveSpreadsheet();
 *      var sheet = ss.getSheetByName('Sheet1'); // แก้ให้ตรงกับชื่อชีตจริง
 *
 *      var data = JSON.parse(e.postData.contents);
 *
 *      var timestamp   = new Date();
 *      var studentName = data.studentName || '';
 *      var score       = data.score || 0;
 *      var result      = data.result || '';
 *      var enemies     = data.enemies || '';
 *      var mapName     = data.mapName || '';
 *
 *      sheet.appendRow([
 *        timestamp,
 *        studentName,
 *        score,
 *        result,
 *        enemies,
 *        mapName
 *      ]);
 *
 *      return ContentService
 *        .createTextOutput(JSON.stringify({ status: 'ok' }))
 *        .setMimeType(ContentService.MimeType.JSON);
 *    }
 *
 * 3) Deploy เป็น Web App
 *    - Deploy → New deployment (หรือ Manage deployments)
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone with the link
 *    - กด Deploy แล้ว copy URL เช่น:
 *      https://script.google.com/macros/s/xxxxxxxxxxxxxxxxxxxxx/exec
 *
 * 4) เปิด RPG Maker MV → Plugin Manager:
 *    - เปิดเพิ่ม GS_BattleScore
 *    - ตั้งค่า:
 *        WebAppUrl             = วาง URL จากข้อ 3
 *        ScoreVariableId       = ID ตัวแปรที่ใช้เก็บคะแนน
 *        StudentActorId        = Actor ที่แทนนักเรียน (ใช้กรณี UseActorName = true)
 *        UseActorName          = true ถ้าจะใช้ชื่อ Actor
 *                              = false ถ้าจะใช้ตัวแปรชื่อแทน
 *        StudentNameVariableId = ถ้า UseActorName = false ให้ใส่ตัวแปรที่เก็บชื่อผู้เล่น
 *
 * 5) ตอนทำ Event ในเกม:
 *    - เวลาอยากเพิ่มคะแนน → ใช้ Control Variables ปกติ เช่น:
 *      Control Variables: [0001: Score] += 10
 *
 *    - ถ้า UseActorName = false:
 *      ให้เก็บชื่อผู้เล่นในตัวแปรข้อความ เช่น:
 *      Control Variables: [0002: StudentName] = "ชื่อที่รับจากผู้เล่น"
 *
 * ---------------------------------------------------------------------------
 * ข้อควรรู้:
 *  - ถ้า WebAppUrl ไม่ถูก หรือ Apps Script ตั้งสิทธิ์ไม่ถูก จะส่งไม่สำเร็จ
 *  - เวลาเทส สามารถเปิด DevTools (กด F8 ตอนรันเกมใน MV) → ดู console
 *    จะเห็น error ถ้า HTTP POST มีปัญหา
 * ---------------------------------------------------------------------------
 */

var Imported = Imported || {};
Imported.GS_BattleScore = true;

var GS = GS || {};
GS.BattleScore = GS.BattleScore || {};

(function() {
    'use strict';

    // -----------------------------------------------------------------------
    // โหลดค่าพารามิเตอร์จาก Plugin Manager
    // -----------------------------------------------------------------------
    var parameters = PluginManager.parameters('GS_BattleScore');

    var webAppUrl             = String(parameters['WebAppUrl'] || '');
    var scoreVariableId       = Number(parameters['ScoreVariableId'] || 1);
    var studentActorId        = Number(parameters['StudentActorId'] || 1);
    var useActorName          = String(parameters['UseActorName'] || 'true') === 'true';
    var studentNameVariableId = Number(parameters['StudentNameVariableId'] || 2);

    // -----------------------------------------------------------------------
    // ฟังก์ชันส่งข้อมูลไปยัง Google Apps Script
    // -----------------------------------------------------------------------
    function gsSendBattleResult(payload) {
        if (!webAppUrl) {
            console.warn('GS_BattleScore: WebAppUrl is empty. กรุณาตั้งค่าใน Plugin Manager');
            return;
        }

        try {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', webAppUrl);
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    // ถ้าอยาก debug ผลลัพธ์จากเซิร์ฟเวอร์:
                    // console.log('GS_BattleScore response:', xhr.status, xhr.responseText);
                }
            };

            xhr.onerror = function() {
                console.error('GS_BattleScore: Network error while sending data.');
            };

            xhr.send(JSON.stringify(payload));
        } catch (e) {
            console.error('GS_BattleScore error while sending:', e);
        }
    }

    // -----------------------------------------------------------------------
    // รวบรวมข้อมูลหลังจบการต่อสู้
    // -----------------------------------------------------------------------
    GS.BattleScore.collectData = function(isWin) {
        // 1) หาชื่อผู้เล่น/นักเรียน
        var studentName = '';

        if (useActorName) {
            // ใช้ชื่อจาก Actor
            var studentActor = $gameActors.actor(studentActorId);
            if (studentActor) {
                studentName = studentActor.name();
            } else {
                studentName = 'UnknownActor';
            }
        } else {
            // ใช้จากตัวแปรข้อความแทน
            var nameVar = $gameVariables.value(studentNameVariableId);
            if (nameVar !== null && nameVar !== undefined) {
                studentName = String(nameVar);
            } else {
                studentName = 'UnknownStudent';
            }
        }

        // 2) คะแนนจากตัวแปรที่กำหนด
        var score = Number($gameVariables.value(scoreVariableId) || 0);

        // 3) ผลการต่อสู้
        var result = isWin ? 'win' : 'lose';

        // 4) รายชื่อมอนสเตอร์ในกองทัพ
        var troopMembers = $gameTroop.members();
        var enemies = troopMembers.map(function(enemy) {
            return enemy.originalName();
        }).join(', ');

        // 5) ชื่อแมพปัจจุบัน
        var mapName = '';
        if ($gameMap && $dataMapInfos && $dataMapInfos[$gameMap.mapId()]) {
            mapName = $dataMapInfos[$gameMap.mapId()].name || '';
        }

        // 6) สร้าง payload สำหรับส่งไป Apps Script
        var payload = {
            studentName: studentName,
            score: score,
            result: result,
            enemies: enemies,
            mapName: mapName
        };

        // 7) ส่ง
        gsSendBattleResult(payload);
    };

    // -----------------------------------------------------------------------
    // Hook เข้ากับ BattleManager.processVictory และ processDefeat
    // -----------------------------------------------------------------------

    // เก็บฟังก์ชันเดิมไว้ก่อน
    var _BattleManager_processVictory = BattleManager.processVictory;
    BattleManager.processVictory = function() {
        // เรียกฟังก์ชันเดิมก่อน เพื่อให้ระบบเกมทำงานครบ
        _BattleManager_processVictory.call(this);

        // จากนั้นค่อยส่งข้อมูลการชนะ
        GS.BattleScore.collectData(true);
    };

    var _BattleManager_processDefeat = BattleManager.processDefeat;
    BattleManager.processDefeat = function() {
        // เรียกฟังก์ชันเดิมก่อน
        _BattleManager_processDefeat.call(this);

        // ส่งข้อมูลการแพ้
        GS.BattleScore.collectData(false);
    };

})();
