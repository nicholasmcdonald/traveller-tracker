// TODO: When unconscious, show errors for to-hit etc
// TODO: When selecting unconscious, clear grapple/dive for cover
// TODO: Fix fonts
// TODO: Add jqueryui sortable to replace up/down tuners

var characterList = {};
var characterIndex = 0;
var isAmbushRound = false;

function addNewCharacter() {
    let newCharacter = Object.create(Character);
    newCharacter.id = characterIndex++;
    characterList[newCharacter.id] = (newCharacter);

    $('#character-list:last-child').append(
        '<tr id="' + newCharacter.id + '" onclick="showCharacterDetails(this.id)">' +
        '<td class="active-marker"></td>' +
        '<td class="ambush"><input type="checkbox" ' +
            'onchange="updateCharacterValues(this)"></td>' +
        '<td class="initiative">' +
        '<input type="button" value="-" onclick="adjustCharacterDown(this)"> ' +
        '<input type="number" value="0" onchange="updateCharacterValues(this)"> ' +
        '<input type="button" value="+" onclick="adjustCharacterUp(this)">' +
        '<td class="name"">' +
            '<input type="text" onchange="updateCharacterValues(this)"></td>' +
        '<td class="damage">' +
            '<input type="number" min="0" value="0" onchange="updateCharacterValues(this)"></td>' +
        '<td class="aim">' +
            '<input type="number" min="0" value="0" onchange="updateCharacterValues(this)"></td>' +
        '<td class="reactions">' +
            '<input type="number" min="0" value="0" onchange="updateCharacterValues(this)"></td>' +
        '<td class="run">' +
            '<input type="checkbox" onchange="updateCharacterValues(this)"></td>' +
        '<td class="diving">' +
            '<input type="checkbox" onchange="updateCharacterValues(this)"></td>' +
        '<td class="prone">' +
            '<input type="checkbox" onchange="updateCharacterValues(this)"></td>' +
        '<td class="cover"><input type="checkbox"></td>' +
        '<td class="grappling">' +
            '<input type="checkbox" onchange="updateCharacterValues(this)"></td>' +
        '<td class="unconscious">' +
            '<input type="checkbox" onchange="updateCharacterValues(this)"></td>' +
        '<td class="delete"><input type="button" value="X" ' +
            'onClick="removeCharacter(this, ' + newCharacter.id + ')"></td>' +
        '<td class="character-id">' + newCharacter.id +'</td>' +
        '</tr>');
}

function moveCursor() {
    let $currentPlayer = $('tr.active-player');
    $currentPlayer.removeClass('active-player');
    $currentPlayer.children(':first').html('');
    resetEndOfTurnStats($currentPlayer);
    let $nextPlayer = getNextPlayer($currentPlayer);
    $nextPlayer.addClass('active-player').children(':first')
        .html('<span class="material-icons">double_arrow</span>');
    resetStatsAtStartOfTurn($nextPlayer);
}

function getNextPlayer($currentPlayer) {
    if ($currentPlayer.next().length === 0) {
        // It's a new round. Clear all ambushes and sort
        $('.ambush input').prop('checked', false);
        isAmbushRound = false;

        $('#character-list').children().each(function() {
            characterList[this.id].ambushing = false;
        });

        sortCharactersByInitiative();
        return $('#character-list').children(':first');
    } else {
        showCharacterDetails($currentPlayer.next().attr('id'));
        return $currentPlayer.next();
    }
}

function startCombat() {
    sortCharactersByInitiative();
    $('tr.active-player').removeClass('active-player').children(':first').html('');
    $('#character-list').children(':first').addClass('active-player').children(':first')
        .html('<span class="material-icons">double_arrow</span>');
    // if any characters have ambushing, make it an ambush round
    isAmbushRound = ($('.ambush input:checked').length > 0);
}

function sortCharactersByInitiative() {
    let $charList = $('#character-list');
    $charList.children().sort(function(a, b) {
        let charA = characterList[a.id];
        let rankA = charA.initiative;
        if (charA.ambushing) rankA += 6;

        let charB = characterList[b.id];
        let rankB = charB.initiative;
        if (charB.ambushing) rankB += 6;

        return rankB - rankA;
    }).appendTo($charList);
}

function resetStatsAtStartOfTurn($character) {
    $('.run input', $character).prop('checked', false);
    characterList[$character.attr('id')].run = false;
}

function resetEndOfTurnStats($character) {
    $('.reactions input', $character).val('0');
    characterList[$character.attr('id')].reactions = 0;
    $('.diving input', $character).prop('checked', false);
    characterList[$character.attr('id')].diving = false;
}

function adjustCharacterUp(element) {
    let $currentChar = $(element).closest('tr');
    let $prevChar = $currentChar.prev();
    if ($prevChar.length) {
        $currentChar.insertBefore($prevChar);
    }
}

function adjustCharacterDown(element) {
    let $currentChar = $(element).closest('tr');
    let $nextChar = $currentChar.next();
    if ($nextChar.length) {
        $currentChar.insertAfter($nextChar);
    }
}

function removeCharacter(element, character) {
    delete characterList[character];
    $(element).closest('tr').remove();
}

function showCharacterDetails(id) {
    let character = characterList[id];
    let $details = $('#blow-up');

    let $warning = $details.find('.warning');
    $warning.removeClass('hidden');
    if (character.unconscious) {
        $warning.html('<i class="material-icons">warning_amber</i>This character is <strong>unconscious</strong> and can\'t act!');
    } else if (character.diving) {
        $warning.html('<i class="material-icons">warning_amber</i>This character <strong>dove for cover</strong> and cannot act!');
    } else if (character.grappling) {
        $warning.html('<i class="material-icons">warning_amber</i>This character is <strong>locked in a grapple</strong> and must fight back!');
    } else {
        $warning.html('');
        $warning.addClass('hidden');
    }

    $('#blow-up-name').html(character.name);
    $('#range-dm').html(character.rangedModifier());
    $('#melee-dm').html(character.meleeModifier());
    $('#evade-dm').html(character.evadeModifier());
}

function updateCharacterValues(elem) {
    let character = characterList[$(elem).closest('tr').attr('id')];
    character.updateObject();
    showCharacterDetails(character.id);
}