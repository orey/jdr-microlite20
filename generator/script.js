function rollStats() {
    let stats = [];
    for (let i = 0; i < 3; i++) {
        let rolls = [rollD6(), rollD6(), rollD6(), rollD6()];
        rolls.sort((a, b) => a - b);
        rolls.shift(); // Remove the lowest roll
        let stat = rolls.reduce((a, b) => a + b, 0);
        stats.push(stat);
    }
    return stats;
}

function rollD6() {
    return Math.floor(Math.random() * 6) + 1;
}

function generateCharacter() {
    const name = document.getElementById('name').value;
    const race = document.getElementById('race').value;
    const charClass = document.getElementById('class').value;
    const level = parseInt(document.getElementById('level').value);

    // Generate random stats
    let stats = rollStats();
    let str = stats[0];
    let dex = stats[1];
    let mind = stats[2];

    let character = {
        name: name,
        race: race,
        class: charClass,
        level: level,
        str: str,
        dex: dex,
        mind: mind,
        hp: str + Math.floor(Math.random() * 6) + 1 + (level - 1) * (Math.floor(Math.random() * 6) + 1),
        ac: 10 + Math.floor((dex - 10) / 2),
        skills: {
            physical: level + Math.floor((str - 10) / 2),
            subterfuge: level + Math.floor((dex - 10) / 2),
            knowledge: level + Math.floor((mind - 10) / 2),
            communication: level + Math.floor((mind - 10) / 2)
        },
        bonuses: {
            meleeAttack: Math.floor((str - 10) / 2) + level,
            missileAttack: Math.floor((dex - 10) / 2) + level,
            magicAttack: Math.floor((mind - 10) / 2) + level
        }
    };

    // Apply race bonuses
    if (race === 'human') {
        character.skills.physical += 1;
        character.skills.subterfuge += 1;
        character.skills.knowledge += 1;
        character.skills.communication += 1;
    } else if (race === 'elf') {
        character.mind += 2;
    } else if (race === 'dwarf') {
        character.str += 2;
    } else if (race === 'halfling') {
        character.dex += 2;
    }

    // Apply class bonuses
    if (charClass === 'fighter') {
        character.skills.physical += 3;
        character.hp += 3;
        character.bonuses.meleeAttack += 3;
        character.bonuses.missileAttack += 3;
    } else if (charClass === 'rogue') {
        character.skills.subterfuge += 3;
    } else if (charClass === 'mage') {
        character.skills.knowledge += 3;
    } else if (charClass === 'cleric') {
        character.skills.communication += 3;
    }

    displayCharacter(character);
}

function displayCharacter(character) {
    const characterDetails = document.getElementById('characterDetails');
    characterDetails.innerHTML = `
        <p><strong>Name:</strong> ${character.name}</p>
        <p><strong>Race:</strong> ${character.race}</p>
        <p><strong>Class:</strong> ${character.class}</p>
        <p><strong>Level:</strong> ${character.level}</p>
        <p><strong>Strength (STR):</strong> ${character.str} (${Math.floor((character.str - 10) / 2)})</p>
        <p><strong>Dexterity (DEX):</strong> ${character.dex} (${Math.floor((character.dex - 10) / 2)})</p>
        <p><strong>Mind (MIND):</strong> ${character.mind} (${Math.floor((character.mind - 10) / 2)})</p>
        <p><strong>Hit Points (HP):</strong> ${character.hp}</p>
        <p><strong>Armour Class (AC):</strong> ${character.ac}</p>
        <p><strong>Skills:</strong></p>
        <p><strong>Physical:</strong> ${character.skills.physical}</p>
        <p><strong>Subterfuge:</strong> ${character.skills.subterfuge}</p>
        <p><strong>Knowledge:</strong> ${character.skills.knowledge}</p>
        <p><strong>Communication:</strong> ${character.skills.communication}</p>
        <p><strong>Bonuses:</strong></p>
        <p><strong>Melee Attack:</strong> ${character.bonuses.meleeAttack}</p>
        <p><strong>Missile Attack:</strong> ${character.bonuses.missileAttack}</p>
        <p><strong>Magic Attack:</strong> ${character.bonuses.magicAttack}</p>
    `;
    document.getElementById('characterSheet').classList.remove('hidden');
}

function exportCharacter() {
    const characterDetails = document.getElementById('characterDetails').innerText;
    const blob = new Blob([characterDetails], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'character.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function importCharacter() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'text/plain';
    input.onchange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const characterDetails = e.target.result;
            document.getElementById('characterDetails').innerText = characterDetails;
            document.getElementById('characterSheet').classList.remove('hidden');
        };
        reader.readAsText(file);
    };
    input.click();
}
