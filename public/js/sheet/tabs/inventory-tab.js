
function openInventoryTab(data){

    // Update armor and shield within the sheet
    determineArmor(data.DexMod);

    $('#tabContent').append('<div class="columns is-mobile pt-1 is-marginless"><div class="column is-inline-flex is-paddingless pt-2 px-3"><p class="is-size-6 pr-3"><strong class="has-text-grey-lighter">Total Bulk</strong></p><p id="bulkTotal" class="is-size-6 has-text-left">'+g_bulkAndCoinsStruct.TotalBulk+' / '+g_bulkAndCoinsStruct.WeightEncumbered+'</p><p id="bulkMax" class="is-size-7 pl-2 has-text-left">(Limit '+g_bulkAndCoinsStruct.WeightMax+')</p></div><div class="column is-paddingless pt-2 px-3"><div class="is-inline-flex is-pulled-right"><p id="coinsMessage" class="is-size-6"><strong class="has-text-grey-lighter">Total Coins</strong></p><div id="coinsCopperSection" class="is-inline-flex" data-tooltip="Copper"><figure class="image is-16x16 is-marginless mt-1 ml-3 mr-1"><img src="/images/copper_coin.png"></figure><p>'+g_bulkAndCoinsStruct.CopperCoins+'</p></div><div id="coinsSilverSection" class="is-inline-flex" data-tooltip="Silver"><figure class="image is-16x16 is-marginless mt-1 ml-3 mr-1"><img src="/images/silver_coin.png"></figure><p>'+g_bulkAndCoinsStruct.SilverCoins+'</p></div><div id="coinsGoldSection" class="is-inline-flex" data-tooltip="Gold"><figure class="image is-16x16 is-marginless mt-1 ml-3 mr-1"><img src="/images/gold_coin.png"></figure><p>'+g_bulkAndCoinsStruct.GoldCoins+'</p></div><div id="coinsPlatinumSection" class="is-inline-flex" data-tooltip="Platinum"><figure class="image is-16x16 is-marginless mt-1 ml-3 mr-1"><img src="/images/platinum_coin.png"></figure><p>'+g_bulkAndCoinsStruct.PlatinumCoins+'</p></div></div></div></div>');

    $('#tabContent').append('<div class="columns is-mobile is-marginless"><div class="column is-10"><p class="control has-icons-left"><input id="inventorySearch" class="input" type="text" placeholder="Search Inventory"><span class="icon is-left"><i class="fas fa-search" aria-hidden="true"></i></span></p></div><div class="column"><a id="invAddItems" class="button is-info is-rounded has-text-light">Add Items</a></div></div><div class="tile is-ancestor is-vertical"><div class="tile is-parent is-paddingless pt-1 px-2"><div class="tile is-child is-6"><p class="has-text-left pl-3"><strong class="has-text-grey-light">Name</strong></p></div><div class="tile is-child is-1"><p class="pr-3"><strong class="has-text-grey-light">Qty</strong></p></div><div class="tile is-child is-1"><p class="pr-3"><strong class="has-text-grey-light">Bulk</strong></p></div><div class="tile is-child is-1"><p class="pr-3"><strong class="has-text-grey-light">Health</strong></p></div><div class="tile is-child is-3"><p class="pr-4"><strong class="has-text-grey-light">Tags</strong></p></div></div><div class="is-divider hr-light is-marginless"></div><div id="inventoryContent" class="use-custom-scrollbar"></div></div>');

    if(g_bulkAndCoinsStruct.CantMove) {
        $('#bulkTotal').addClass('has-text-black');
        $('#bulkTotal').addClass('has-text-weight-bold');
        $('#bulkTotal').addClass('has-background-danger');
        $('#bulkMax').addClass('has-text-black');
        $('#bulkMax').addClass('has-text-weight-bold');
        $('#bulkMax').addClass('has-background-danger');
    } else if(g_bulkAndCoinsStruct.IsEncumbered){
        $('#bulkTotal').addClass('has-text-danger');
        $('#bulkTotal').addClass('has-text-weight-bold');
    }

    let foundCoins = false;
    if(g_bulkAndCoinsStruct.CopperCoins > 0){
        foundCoins = true;
        $('#coinsCopperSection').removeClass('is-hidden');
    } else {
        $('#coinsCopperSection').addClass('is-hidden');
    }
    if(g_bulkAndCoinsStruct.SilverCoins > 0){
        foundCoins = true;
        $('#coinsSilverSection').removeClass('is-hidden');
    } else {
        $('#coinsSilverSection').addClass('is-hidden');
    }
    if(g_bulkAndCoinsStruct.GoldCoins > 0){
        foundCoins = true;
        $('#coinsGoldSection').removeClass('is-hidden');
    } else {
        $('#coinsGoldSection').addClass('is-hidden');
    }
    if(g_bulkAndCoinsStruct.PlatinumCoins > 0){
        foundCoins = true;
        $('#coinsPlatinumSection').removeClass('is-hidden');
    } else {
        $('#coinsPlatinumSection').addClass('is-hidden');
    }

    if(!foundCoins){
        $('#coinsMessage').append(' None');
    }

    displayInventorySection(data);

    $("#inventoryContent").scrollTop(g_inventoryTabScroll);

    $('#invAddItems').click(function(){
        openQuickView('addItemView', {
            ItemMap : g_itemMap,
            InvID : g_invStruct.Inventory.id,
            Data : data
        });
    });

}








// Inventory //

function displayInventorySection(data){

    $('#inventorySearch').off('change');

    let openBagInvItemArray = [];
    for(const invItem of g_invStruct.InvItems){
        let item = g_itemMap.get(invItem.itemID+"");
        if(item.Item.itemType == "STORAGE" && invItem.bagInvItemID == null){
            openBagInvItemArray.push(invItem);
        }
    }

    let runeDataStruct = generateRuneDataStruct();

    let inventorySearch = $('#inventorySearch');
    let invSearchInput = null;
    if(inventorySearch.val() != ''){
        invSearchInput = inventorySearch.val().toLowerCase();
        inventorySearch.addClass('is-info');
    } else {
        inventorySearch.removeClass('is-info');
    }

    $('#inventorySearch').change(function(){
        displayInventorySection(data);
    });

    $('#inventoryContent').html('');

    for(const invItem of g_invStruct.InvItems){

        let willDisplay = true;
        if(invItem.bagInvItemID != null){
            willDisplay = false;
        }

        if(invSearchInput == 'weapons'){
            let item = g_itemMap.get(invItem.itemID+"");
            if(item.Item.itemType == 'WEAPON'){
                willDisplay = true;
            } else {
                willDisplay = false;
            }

        } else if(invSearchInput == 'armor'){
            let item = g_itemMap.get(invItem.itemID+"");
            if(item.Item.itemType == 'ARMOR'){
                willDisplay = true;
            } else {
                willDisplay = false;
            }

        } else if(invSearchInput == 'coins' || invSearchInput == 'money' || invSearchInput == 'currency'){
            let item = g_itemMap.get(invItem.itemID+"");
            if(item.Item.itemType == 'CURRENCY'){
                willDisplay = true;
            } else {
                willDisplay = false;
            }

        } else {

            if(invSearchInput != null){
                let itemName = invItem.name.toLowerCase();
                if(!itemName.includes(invSearchInput)){
                    willDisplay = false;
                } else {
                    willDisplay = true;
                }
            }

        }

        if(willDisplay) {
            displayInventoryItem(invItem, openBagInvItemArray, runeDataStruct, data);
        }

    }

    handleArmorEquip(g_invStruct.Inventory.id);
    handleShieldEquip(g_invStruct.Inventory.id);

}

function displayInventoryItem(invItem, openBagInvItemArray, runeDataStruct, data) {

    let item = g_itemMap.get(invItem.itemID+"");
    let itemIsStorage = (item.Item.itemType == "STORAGE");
    let itemIsStorageAndEmpty = false;

    let invItemSectionID = 'invItemSection'+invItem.id;
    let invItemNameID = 'invItemName'+invItem.id;
    let invItemQtyID = 'invItemQty'+invItem.id;
    let invItemBulkID = 'invItemBulk'+invItem.id;
    let invItemHealthID = 'invItemHealth'+invItem.id;
    let invItemShoddyTagID = 'invItemShoddyTag'+invItem.id;
    let invItemBrokenTagID = 'invItemBrokenTag'+invItem.id;

    // Halve maxHP if it's shoddy
    let maxHP = (invItem.isShoddy == 1) ? Math.floor(invItem.hitPoints/2) : invItem.hitPoints;

    // Halve brokenThreshold if it's shoddy
    let brokenThreshold = (invItem.isShoddy == 1) ? Math.floor(invItem.brokenThreshold/2) : invItem.brokenThreshold;

    // Reduce currentHP if it's over maxHP
    invItem.currentHitPoints = (invItem.currentHitPoints > maxHP) ? maxHP : invItem.currentHitPoints;

    if(itemIsStorage) {

        let invItemStorageViewButtonID = 'invItemStorageViewButton'+invItem.id;
        let invItemStorageSectionID = 'invItemStorageSection'+invItem.id;
        let invItemStorageBulkAmountID = 'invItemStorageBulkAmount'+invItem.id;

        $('#inventoryContent').append('<div id="'+invItemSectionID+'" class="tile is-parent is-paddingless pt-1 px-2 border-bottom border-dark-lighter cursor-clickable"><div class="tile is-child is-6"><p id="'+invItemNameID+'" class="has-text-left pl-3 is-size-6 has-text-grey-light"><a id="'+invItemStorageViewButtonID+'" class="button is-very-small is-info is-rounded is-outlined mb-1 ml-3">Open</a></p></div><div id="'+invItemQtyID+'" class="tile is-child is-1"><p></p></div><div id="'+invItemBulkID+'" class="tile is-child is-1"><p></p></div><div id="'+invItemHealthID+'" class="tile is-child is-1"><p></p></div><div class="tile is-child is-3"><div class="tags is-centered"><span id="'+invItemShoddyTagID+'" class="tag is-warning">Shoddy</span><span id="'+invItemBrokenTagID+'" class="tag is-danger">Broken</span></div></div></div>');

        $('#inventoryContent').append('<div id="'+invItemStorageSectionID+'" class="tile is-vertical is-hidden"></div>');

        let bulkIgnored = item.StorageData.bulkIgnored;
        let bagBulk = g_bulkAndCoinsStruct.BagBulkMap.get(invItem.id);
        if(bagBulk == null) {
            bagBulk = 0;
        } else {
            bagBulk += bulkIgnored;
        }
        bagBulk = round(bagBulk, 1);
        let maxBagBulk = item.StorageData.maxBulkStorage;
        let bulkIgnoredMessage = "";
        if(bulkIgnored != 0.0){
            if(bulkIgnored == maxBagBulk){
                bulkIgnoredMessage = "Items don’t count towards your Total Bulk.";
            } else {
                bulkIgnoredMessage = "The first "+bulkIgnored+" Bulk of items don’t count towards your Total Bulk.";
            }
        }
        $('#'+invItemStorageSectionID).append('<div class="tile is-parent is-paddingless pt-1 px-2"><div class="tile is-child is-1"></div><div class="tile is-child is-3 border-bottom border-dark-lighter"><p id="'+invItemStorageBulkAmountID+'" class="has-text-left pl-5 is-size-6 has-text-grey">Bulk '+bagBulk+' / '+maxBagBulk+'</p></div><div class="tile is-child is-8 border-bottom border-dark-lighter"><p class="has-text-left pl-3 is-size-6 has-text-grey is-italic">'+bulkIgnoredMessage+'</p></div></div>');

        if(bagBulk > maxBagBulk){
            $('#'+invItemStorageBulkAmountID).removeClass('has-text-grey');
            $('#'+invItemStorageBulkAmountID).addClass('has-text-danger');
            $('#'+invItemStorageBulkAmountID).addClass('has-text-weight-bold');
        }

        let foundBaggedItem = false;
        for(const baggedInvItem of g_invStruct.InvItems){
            if(baggedInvItem.bagInvItemID == invItem.id){
                foundBaggedItem = true;

                let baggedItem = g_itemMap.get(baggedInvItem.itemID+"");
                let baggedItemIsStorage = (baggedItem.Item.itemType == "STORAGE");

                let baggedInvItemSectionID = 'baggedInvItemSection'+baggedInvItem.id;
                let baggedInvItemIndentID = 'baggedInvItemIndent'+baggedInvItem.id;
                let baggedInvItemNameID = 'baggedInvItemName'+baggedInvItem.id;
                let baggedInvItemQtyID = 'baggedInvItemQty'+baggedInvItem.id;
                let baggedInvItemBulkID = 'baggedInvItemBulk'+baggedInvItem.id;
                let baggedInvItemHealthID = 'baggedInvItemHealth'+baggedInvItem.id;
                let baggedInvItemShoddyTagID = 'baggedInvItemShoddyTag'+baggedInvItem.id;
                let baggedInvItemBrokenTagID = 'baggedInvItemBrokenTag'+baggedInvItem.id;


                // Halve maxHP if it's shoddy
                let baggedInvItemMaxHP = (baggedInvItem.isShoddy == 1) ? Math.floor(baggedInvItem.hitPoints/2) : baggedInvItem.hitPoints;

                // Halve brokenThreshold if it's shoddy
                let baggedInvItemBrokenThreshold = (baggedInvItem.isShoddy == 1) ? Math.floor(baggedInvItem.brokenThreshold/2) : baggedInvItem.brokenThreshold;

                // Reduce currentHP if it's over maxHP
                baggedInvItem.currentHitPoints = (baggedInvItem.currentHitPoints > baggedInvItemMaxHP) ? baggedInvItemMaxHP : baggedInvItem.currentHitPoints;

                $('#'+invItemStorageSectionID).append('<div id="'+baggedInvItemSectionID+'" class="tile is-parent is-paddingless pt-1 px-2 cursor-clickable"><div id="'+baggedInvItemIndentID+'" class="tile is-child is-1"></div><div class="tile is-child is-5 border-bottom border-dark-lighter"><p id="'+baggedInvItemNameID+'" class="has-text-left pl-3 is-size-6 has-text-grey-light"></p></div><div id="'+baggedInvItemQtyID+'" class="tile is-child is-1 border-bottom border-dark-lighter"><p></p></div><div id="'+baggedInvItemBulkID+'" class="tile is-child is-1 border-bottom border-dark-lighter"><p></p></div><div id="'+baggedInvItemHealthID+'" class="tile is-child is-1 border-bottom border-dark-lighter"><p></p></div><div class="tile is-child is-3 border-bottom border-dark-lighter"><div class="tags is-centered"><span id="'+baggedInvItemShoddyTagID+'" class="tag is-warning">Shoddy</span><span id="'+baggedInvItemBrokenTagID+'" class="tag is-danger">Broken</span></div></div></div>');

                $('#'+baggedInvItemNameID).html(baggedInvItem.name);

                if(baggedItem.WeaponData != null){
                    let calcStruct = getAttackAndDamage(baggedItem, baggedInvItem);
                    $('#'+baggedInvItemNameID).append('<sup class="pl-2 has-text-weight-light">'+calcStruct.AttackBonus+'</sup><sup class="pl-3 has-text-weight-light has-text-grey">'+calcStruct.Damage+'</sup>');
                }

                if(baggedItem.Item.hasQuantity == 1){
                    $('#'+baggedInvItemQtyID).html(baggedInvItem.quantity);
                } else {
                    $('#'+baggedInvItemQtyID).html('-');
                }

                let bulk = getConvertedBulkForSize(baggedInvItem.size, baggedInvItem.bulk);
                bulk = getBulkFromNumber(bulk);
                $('#'+baggedInvItemBulkID).html(bulk);

                if(baggedInvItem.currentHitPoints == baggedInvItemMaxHP) {
                    $('#'+baggedInvItemHealthID).html('-');
                } else {
                    $('#'+baggedInvItemHealthID).html(baggedInvItem.currentHitPoints+'/'+baggedInvItemMaxHP);
                }

                if(baggedInvItem.isShoddy == 0){
                    $('#'+baggedInvItemShoddyTagID).addClass('is-hidden');
                } else {
                    $('#'+baggedInvItemShoddyTagID).removeClass('is-hidden');
                }

                if(baggedInvItem.currentHitPoints > baggedInvItemBrokenThreshold){
                    $('#'+baggedInvItemBrokenTagID).addClass('is-hidden');
                } else {
                    $('#'+baggedInvItemBrokenTagID).removeClass('is-hidden');
                }

                $('#'+baggedInvItemSectionID).click(function(){
                    openQuickView('invItemView', {
                        InvItem : baggedInvItem,
                        Item : baggedItem,
                        RuneDataStruct : runeDataStruct,
                        InvData : {
                            OpenBagInvItemArray : openBagInvItemArray,
                            ItemIsStorage : baggedItemIsStorage,
                            ItemIsStorageAndEmpty : true
                        },
                        Data : data
                    });
                });

                $('#'+baggedInvItemSectionID).mouseenter(function(){
                    $(this).addClass('has-background-grey-darker');
                });
                $('#'+baggedInvItemSectionID).mouseleave(function(){
                    $(this).removeClass('has-background-grey-darker');
                });

            }
        }

        if(!foundBaggedItem){
            $('#'+invItemStorageSectionID).append('<div class="tile is-parent is-paddingless pt-1 px-2"><div class="tile is-child is-1"></div><div class="tile is-child is-11 border-bottom border-dark-lighter"><p class="has-text-left pl-3 is-size-7 has-text-grey is-italic">Empty</p></div></div>');
            itemIsStorageAndEmpty = true;
        }

        $('#'+invItemStorageViewButtonID).click(function(event){
            event.stopImmediatePropagation();
            if($('#'+invItemStorageSectionID).is(":visible")){
                $('#'+invItemStorageSectionID).addClass('is-hidden');
                $('#'+invItemStorageViewButtonID).html('Open');
                $('#'+invItemStorageViewButtonID).removeClass('has-text-white');
                $('#'+invItemStorageViewButtonID).addClass('is-outlined');

                g_openBagsSet.delete(invItem.id);
            } else {
                $('#'+invItemStorageSectionID).removeClass('is-hidden');
                $('#'+invItemStorageViewButtonID).html('Close');
                $('#'+invItemStorageViewButtonID).addClass('has-text-white');
                $('#'+invItemStorageViewButtonID).removeClass('is-outlined');
                
                g_openBagsSet.add(invItem.id);
            }
        });

        if(g_openBagsSet.has(invItem.id)){
            $('#'+invItemStorageViewButtonID).click();
        }

    } else {
        $('#inventoryContent').append('<div id="'+invItemSectionID+'" class="tile is-parent is-paddingless pt-1 px-2 border-bottom border-dark-lighter cursor-clickable"><div class="tile is-child is-6"><p id="'+invItemNameID+'" class="has-text-left pl-3 is-size-6 has-text-grey-light"></p></div><div id="'+invItemQtyID+'" class="tile is-child is-1"><p></p></div><div id="'+invItemBulkID+'" class="tile is-child is-1"><p></p></div><div id="'+invItemHealthID+'" class="tile is-child is-1"><p></p></div><div class="tile is-child is-3"><div class="tags is-centered"><span id="'+invItemShoddyTagID+'" class="tag is-warning">Shoddy</span><span id="'+invItemBrokenTagID+'" class="tag is-danger">Broken</span></div></div></div>');
    }

    

    $('#'+invItemNameID).prepend(invItem.name);

    if(item.WeaponData != null){
        let calcStruct = getAttackAndDamage(item, invItem);
        $('#'+invItemNameID).append('<sup class="pl-2 has-text-weight-light">'+calcStruct.AttackBonus+'</sup><sup class="pl-3 has-text-weight-light has-text-grey">'+calcStruct.Damage+'</sup>');
    }

    if(item.ArmorData != null){
        $('#'+invItemNameID).append('<button name="'+invItem.id+'" class="equipArmorButton button is-very-small is-info is-rounded is-outlined mb-1 ml-3"><span class="icon is-small"><i class="fas fa-tshirt"></i></span></button>');
    }

    if(item.ShieldData != null){
        let notBroken = (invItem.currentHitPoints > brokenThreshold);
        if(notBroken){
            $('#'+invItemNameID).append('<button name="'+invItem.id+'" class="equipShieldButton button is-very-small is-info is-rounded is-outlined mb-1 ml-3"><span class="icon is-small"><i class="fas fa-shield-alt"></i></span></button>');
        } else {
            $('#'+invItemNameID).append('<button class="button is-very-small is-danger is-rounded mb-1 ml-3"><span class="icon is-small"><i class="fas fa-shield-alt"></i></span></button>');
        }
    }


    if(item.Item.hasQuantity == 1){
        $('#'+invItemQtyID).html(invItem.quantity);
    } else {
        $('#'+invItemQtyID).html('-');
    }

    let bulk = getConvertedBulkForSize(invItem.size, invItem.bulk);
    bulk = getBulkFromNumber(bulk);
    if(item.StorageData != null && item.StorageData.ignoreSelfBulkIfWearing == 1){ bulk = '-'; }
    $('#'+invItemBulkID).html(bulk);

    if(invItem.currentHitPoints == maxHP) {
        $('#'+invItemHealthID).html('-');
    } else {
        $('#'+invItemHealthID).html(invItem.currentHitPoints+'/'+maxHP);
    }

    if(invItem.isShoddy == 0){
        $('#'+invItemShoddyTagID).addClass('is-hidden');
    } else {
        $('#'+invItemShoddyTagID).removeClass('is-hidden');
    }

    if(invItem.currentHitPoints > brokenThreshold){
        $('#'+invItemBrokenTagID).addClass('is-hidden');
    } else {
        $('#'+invItemBrokenTagID).removeClass('is-hidden');
    }

    $('#'+invItemSectionID).click(function(){
        openQuickView('invItemView', {
            InvItem : invItem,
            Item : item,
            RuneDataStruct : runeDataStruct,
            InvData : {
                OpenBagInvItemArray : openBagInvItemArray,
                ItemIsStorage : itemIsStorage,
                ItemIsStorageAndEmpty : itemIsStorageAndEmpty
            },
            Data : data
        });
    });

    $('#'+invItemSectionID).mouseenter(function(){
        $(this).addClass('has-background-grey-darker');
    });
    $('#'+invItemSectionID).mouseleave(function(){
        $(this).removeClass('has-background-grey-darker');
    });

}

function handleArmorEquip(invID){
    $('.equipArmorButton').each(function(i, obj) {
        let invItemID = $(this).attr('name');
        if(g_equippedArmorInvItemID == invItemID) {
            $(this).removeClass('is-outlined');
            $(this).click(function(event){
                event.stopImmediatePropagation();
                g_equippedArmorInvItemID = null;
                loadCharSheet();
                updateInventoryBackend(invID);
            });
        } else {
            $(this).addClass('is-outlined');
            $(this).click(function(event){
                event.stopImmediatePropagation();
                g_equippedArmorInvItemID = invItemID;
                loadCharSheet();
                updateInventoryBackend(invID);
            });
        }
    });
}

function handleShieldEquip(invID){
    $('.equipShieldButton').each(function(i, obj) {
        let invItemID = $(this).attr('name');
        if(g_equippedShieldInvItemID == invItemID) {
            $(this).removeClass('is-outlined');
            $(this).click(function(event){
                event.stopImmediatePropagation();
                g_equippedShieldInvItemID = null;
                loadCharSheet();
                updateInventoryBackend(invID);
            });
        } else {
            $(this).addClass('is-outlined');
            $(this).click(function(event){
                event.stopImmediatePropagation();
                g_equippedShieldInvItemID = invItemID;
                loadCharSheet();
                updateInventoryBackend(invID);
            });
        }
    });
}

let isUpdateInventoryAvailable = true;
function updateInventoryBackend(invID){
    if(isUpdateInventoryAvailable){
        isUpdateInventoryAvailable = false;
        setTimeout(function(){
            socket.emit("requestUpdateInventory",
                invID,
                g_equippedArmorInvItemID,
                g_equippedShieldInvItemID);
            isUpdateInventoryAvailable = true;
        }, 5000);
    }
}