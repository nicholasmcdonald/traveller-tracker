var Character = {
    id: '', ambushing: false, initiative: 0, name: '', damage: 0, aim: 0, cover: false,
    reactions: 0, run: false, prone: false, diving: false, grappling: false,
    unconscious: false, keep: false,

    ambushModifier: function() {
        return (isAmbushRound && !this.ambushing) ? -6 : 0;
    },

    rangedModifier: function() {
        let result = this.aim - this.reactions + this.ambushModifier();
        let output = `<strong>${result}</strong> = +${this.aim} (aim) -${this.reactions} (reactions)`;
        return (this.ambushModifier() === 0) ? output : output + ` -6 (ambushed)`;
    },

    meleeModifier: function() {
        let result = -this.reactions + this.ambushModifier();
        let output = `<strong>${result}</strong> = -${this.reactions} (reactions)`;
        return (this.ambushModifier() === 0) ? output : output + ` -6 (ambushed)`;
    },

    evadeModifier: function() {
        let result = 0, output = '';

        if (this.cover) {
            result -= 2;
            output += `-2 (cover) `;
        }

        if (this.run) {
            result -= 1;
            output += '-1 (running) ';
        }

        if (this.prone) {
            result -= 1;
            output += '-1 (prone) ';
        }

        if (this.diving) {
            result -= 2;
            output += '-2 (diving) ';
        }

        return `<strong>${result}</strong> = ${output}`;
    },
    skillModifier: function() {},
    warning: function() {},
    notice: function() {},

    updateRowView: function() {
        let $row = $('#' + this.id);
        $row.children('.ambush input').prop('checked', this.ambushing);
        $row.children('.initiative input[type=number]').val(this.initiative);
        $row.children('.name input').val(this.name);
        $row.children('.damage input').val(this.damage);
        $row.children('.aim input').val(this.aim);
        $row.children('.reactions input').val(this.reactions);
        $row.children('.run input').prop('checked', this.run);
        $row.children('.diving input').prop('checked', this.diving);
        $row.children('.prone input').prop('checked', this.prone);
        $row.children('.cover input').prop('checked', this.cover);
        $row.children('.grappling input').prop('checked', this.grappling);
        $row.children('.unconscious input').prop('checked', this.unconscious);
    },

    updateObject: function() {
        let $row = $('#' + this.id);
        this.ambushing = $row.find('.ambush input').prop('checked');
        this.initiative = parseInt($row.find('.initiative input[type=number]').val());
        this.name = $row.find('.name input').val();
        this.damage = parseInt($row.find('.damage input').val());
        this.aim = parseInt($row.find('.aim input').val());
        this.reactions = parseInt($row.find('.reactions input').val());
        this.run = $row.find('.run input').prop('checked');
        this.diving = $row.find('.diving input').prop('checked');
        this.prone = $row.find('.prone input').prop('checked');
        this.cover = parseInt($row.find('.cover input').val());
        this.grappling = $row.find('.grappling input').prop('checked');
        this.unconscious = $row.find('.unconscious input').prop('checked');
    }
}

function CharacterRowView(referenceCharacter) {
    this.character = referenceCharacter;
}