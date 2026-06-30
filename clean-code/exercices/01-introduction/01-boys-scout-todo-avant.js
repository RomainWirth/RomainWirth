var data = [];

function add(t, p) {
  if (!t) {
    console.log('Erreur: titre non defini');
    return false;
  }

  var prio = p || 'normale';

  data.push({
    titre: t,
    priorite: prio,
    fini: false,
    date_creation: new Date(),
  });

  return true;
}

function getAll() {
  return data;
}

function marquerFini(i) {
  if (i >= 0 && i < data.length) {
    data[i].fini = true;
    return true;
  } else {
    console.log('Index invalide');
    return false;
  }
}

function afficher() {
  if (data.length === 0) {
    console.log('Aucune tache');
  } else {
    for (var i = 0; i < data.length; i++) {
      var t = data[i];
      var status = t.fini ? '[x]' : '[ ]';
      console.log(i + '. ' + status + ' ' + t.titre + ' (Priorite: ' + t.priorite + ')');
    }
  }
}

add('Faire les courses', 'haute');
add('Appeler le plombier');
afficher();
marquerFini(0);
afficher();
