var max = 3;
var tmps = 15;

function U(p, n, e, m) {
  this.p = p;
  this.n = n;
  this.e = e;
  this.m = m;
  this.d = new Date();
  this.t = 0;
  this.v = false;

  this.nc = function () {
    return this.p + ' ' + this.n;
  };

  this.check = function (em, mdp) {
    if (this.v) {
      console.log('Locked');
      return false;
    }

    var ok = this.e == em && this.m == mdp;

    if (!ok) {
      this.t++;
      if (this.t >= max) {
        this.v = true;
        var self = this;
        setTimeout(function () {
          self.v = false;
          self.t = 0;
        }, tmps * 60 * 1000);
      }
    } else {
      this.t = 0;
    }

    return ok;
  };
}

var users = [];

var addUser = function (a, b, c, d) {
  for (var i = 0; i < users.length; i++) {
    if (users[i].e === c) throw 'Exists';
  }
  var u = new U(a, b, c, d);
  users.push(u);
  return u;
};

var find = function (x) {
  for (var i = 0; i < users.length; i++) {
    if (users[i].e === x) return users[i];
  }
  return null;
};

var auth = function (x, y) {
  var u = find(x);
  return u ? u.check(x, y) : false;
};

try {
  var u1 = addUser('Jean', 'Dupont', 'jean.dupont@exemple.fr', 'MotDePasse123');
  console.log('Created: ' + u1.nc());

  if (auth('jean.dupont@exemple.fr', 'MotDePasse123')) {
    console.log('OK!');
  } else {
    console.log('FAIL');
  }
} catch (e) {
  console.log('ERR: ' + e);
}
