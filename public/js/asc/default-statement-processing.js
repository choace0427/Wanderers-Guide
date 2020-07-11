
let g_defaultItemPropRuneSlotNum = null;
function processDefaultItemRuneSheetCode(ascCode, itemID, invItemID){
    if(ascCode == null) {return false;}
    
    ascCode = ascCode.toUpperCase();
    let ascStatements = ascCode.split(/\n/);

    const runeData = g_runeDataStruct;

    g_defaultItemPropRuneSlotNum = 0;
    let success = true;
    for(const ascStatementRaw of ascStatements) {
        // Test/Check Statement for Expressions //
        let ascStatement = testExpr(ascStatementRaw);
        if(ascStatement === null) {continue;}
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

        if(ascStatement.includes("DEFAULT-WEAPON-RUNE")){
            // DEFAULT-WEAPON-RUNE=+1_Weapon_Potency

            let data = ascStatement.split('=');
            defaultSetWeaponRunes(invItemID, data[1], runeData);

            continue;
        }

        if(ascStatement.includes("DEFAULT-ARMOR-RUNE")){
            // DEFAULT-ARMOR-RUNE=+3_Armor_Potency

            let data = ascStatement.split('=');
            defaultSetArmorRunes(invItemID, data[1], runeData);

            continue;
        }

        if(ascStatement.includes("DEFAULT-ADD-ITEM-TO-BAG")){
            // DEFAULT-ADD-ITEM-TO-BAG=Bedroll
            // DEFAULT-ADD-ITEM-TO-BAG=Torch~5

            let itemName, itemQty;
            let data = ascStatement.split('=');
            let dataSplit = data[1].split('~');
            if(dataSplit[1] != null){
                itemName = dataSplit[0];
                itemQty = dataSplit[1];
            } else {
                itemName = data[1];
                itemQty = null;
            }

            defaultAddItemToBag(itemID, invItemID, itemName, itemQty);

            continue;
        }

    }

    return success;

}


function defaultAddItemToBag(bagItemID, bagInvItemID, itemToAddName, itemToAddQty){

    let bagItemDataStruct = g_itemMap.get(bagItemID+"");
    if(bagItemDataStruct.StorageData == null) {return;}

    let itemToAddDataStruct = null;
    for(const [itemID, itemDataStruct] of g_itemMap.entries()){
        if(itemToAddName == itemDataStruct.Item.name.toUpperCase()){
            itemToAddDataStruct = itemDataStruct;
            break;
        }
    }
    if(itemToAddDataStruct == null) {return;}

    if(itemToAddQty == null){itemToAddQty = itemToAddDataStruct.Item.quantity;}
    socket.emit("requestAddItemToBag",
        itemToAddDataStruct.Item.id,
        itemToAddQty,
        bagInvItemID);

    window.setTimeout(() => {
        socket.emit("requestInvUpdate",
            getCharIDFromURL());
    }, 1000);

}


function defaultSetWeaponRunes(invItemID, runeCodeName, runeData){
    runeCodeName = runeCodeName.replace(/_/g," ");
    runeCodeName = runeCodeName.replace(/’/g,"'");

    let rune = findWeaponRuneByName(runeCodeName, runeData);
    if(rune != null){
        if(rune.RuneData.isFundamental == 1) {
            socket.emit("requestAddFundamentalRune",
                invItemID,
                rune.RuneData.id);
        } else {
            g_defaultItemPropRuneSlotNum++;
            socket.emit("requestAddPropertyRune",
                invItemID,
                rune.RuneData.id,
                g_defaultItemPropRuneSlotNum);
        }
    } else {
        console.error('Failed to find weapon rune with name: '+runeCodeName);
    }

}

function findWeaponRuneByName(runeCodeName, runeData){
    for(let weapRune of runeData.WeaponArray){
        if(weapRune != null) {
            let weapRuneName = runestoneNameToRuneName(weapRune.Item.name).toUpperCase();
            if(weapRuneName === runeCodeName){
                return weapRune;
            }
        }
    }
    return null;
}



function defaultSetArmorRunes(invItemID, runeCodeName, runeData){
    runeCodeName = runeCodeName.replace(/_/g," ");
    runeCodeName = runeCodeName.replace(/’/g,"'");

    let rune = findArmorRuneByName(runeCodeName, runeData);
    if(rune != null){
        if(rune.RuneData.isFundamental == 1) {
            socket.emit("requestAddFundamentalRune",
                invItemID,
                rune.RuneData.id);
        } else {
            g_defaultItemPropRuneSlotNum++;
            socket.emit("requestAddPropertyRune",
                invItemID,
                rune.RuneData.id,
                g_defaultItemPropRuneSlotNum);
        }
    } else {
        console.error('Failed to find armor rune with name: '+runeCodeName);
    }

}

function findArmorRuneByName(runeCodeName, runeData){
    for(let weapRune of runeData.ArmorArray){
        if(weapRune != null) {
            let weapRuneName = runestoneNameToRuneName(weapRune.Item.name).toUpperCase();
            console.log(weapRuneName+' '+runeCodeName);
            if(weapRuneName === runeCodeName){
                return weapRune;
            }
        }
    }
    return null;
}
