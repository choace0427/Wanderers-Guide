/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

let g_materialsMap = new Map();

g_materialsMap.set('ADAMANTINE', {Name: 'Adamantine', Description: 'Mined from rocks that fell from the heavens, adamantine is one of the hardest metals known. It has a shiny, black appearance, and it is prized for its amazing resiliency and ability to hold an incredibly sharp edge. See more on page 578.'});
g_materialsMap.set('COLD IRON', {Name: 'Cold Iron', Description: 'Weapons made from cold iron are deadly to demons and fey alike. Cold iron looks like normal iron but is mined from particularly pure sources and shaped with little or no heat. This process is extremely difficult, especially for high-grade cold iron items. See more on page 578.'});
g_materialsMap.set('DARKWOOD', {Name: 'Darkwood', Description: 'Darkwood is a very lightweight wood found primarily in old-growth forests; it is dark as ebony but has a slight purple tint. A darkwood item’s Bulk is reduced by 1 (or to light Bulk if its normal Bulk is 1, with no effect on an item that normally has light Bulk). See more on page 578.'});
g_materialsMap.set('DRAGONHIDE', {Name: 'Dragonhide', Description: 'Dragonhide varies in color from blue to glittering gold, depending on the dragon it came from. Due to the scales’ resiliency, it can also be used to Craft armor usually made out of metal plates (such as a breastplate, half plate, and full plate), allowing such armor to be made without metal. Dragonhide objects are immune to one damage type, depending on the type of dragon. See more on page 579.'});
g_materialsMap.set('MITHRAL', {Name: 'Mithral', Description: 'Mithral is renowned for its lightness, durability, and effectiveness against a range of creatures including devils and lycanthropes. It has the same sheen as silver but a slightly lighter hue. Mithral weapons and armor are treated as if they were silver for the purpose of damaging creatures with weakness to silver. A metal item made of mithral is lighter than one made of iron or steel: the item’s Bulk is reduced by 1 (reduced to light Bulk if its normal Bulk is 1, with no effect on an item that normally has light Bulk). See more on page 579.'});
g_materialsMap.set('ORICHALCUM', {Name: 'Orichalcum', Description: 'The most rare and valuable skymetal, orichalcum is coveted for its incredible time-related magical properties. This dull, coppery metal isn’t as physically sturdy as adamantine, but orichalcum’s time-bending properties protect it, granting it greater Hardness and Hit Points. If an orichalcum item takes damage but isn’t destroyed, it repairs itself completely 24 hours later. See more on page 579.'});
g_materialsMap.set('SILVER', {Name: 'Silver', Description: 'Silver weapons are a bane to creatures ranging from devils to werewolves. Silver items are less durable than steel items, and low-grade silver items are usually merely silver-plated. See more on page 579.'});
g_materialsMap.set('SOVEREIGN STEEL', {Name: 'Sovereign Steel', Description: 'This unique alloy of cold iron and the skymetal noqual can provide protection from magical assault. The process of cold-forging the two materials together is quite complicated and precise. All sovereign steel items have a +4 circumstance bonus on saves against magic that the item makes, and grant their bonus to saves the owner makes specifically to protect the item from magic.'});
g_materialsMap.set('WARPGLASS', {Name: 'Warpglass', Description: 'This bizarre substance is fashioned from the raw, chaotic quintessence of the Maelstrom. It can be fashioned into weapons and items, but is too unstable to make into useful armor or shields. Raw warpglass is an opalescent glassy material with surprising strength. When worked, it changes its appearance - though not its properties - to appear as random striations of other metals and types of stone.'});