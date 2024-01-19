/**
 * All code is in an anonymous closure to keep the global namespace clean.
 *
 * @param {number=} overflow
 * @param {number=} startdenom
 */

(function (pool, mathee, width, chunks, significance, overflow, startdenom) {
  //
  // seedrandom()
  // This is the seedrandom function described above.
  //
  mathee["seedrandom"] = function seedrandom(seed, use_entropy) {
    var key = [];
    var arc4;

    // Flatten the seed string or build one from local entropy if needed.
    seed = mixkey(
      flatten(
        use_entropy
          ? [seed, pool]
          : arguments.length
          ? seed
          : [new Date().getTime(), pool, window],
        3
      ),
      key
    );

    // Use the seed to initialize an ARC4 generator.
    arc4 = new ARC4(key);

    // Mix the randomness into accumulated entropy.
    mixkey(arc4.S, pool);

    // Override Math.random

    // This function returns a random double in [0, 1) that contains
    // randomness in every bit of the mantissa of the IEEE 754 value.

    mathee["random"] = function random() {
      // Closure to return a random double:
      var n = arc4.g(chunks); // Start with a numerator n < 2 ^ 48
      var d = startdenom; //   and denominator d = 2 ^ 48.
      var x = 0; //   and no 'extra last byte'.
      while (n < significance) {
        // Fill up all significant digits by
        n = (n + x) * width; //   shifting numerator and
        d *= width; //   denominator and generating a
        x = arc4.g(1); //   new least-significant-byte.
      }
      while (n >= overflow) {
        // To avoid rounding up, before adding
        n /= 2; //   last byte, shift everything
        d /= 2; //   right using integer math until
        x >>>= 1; //   we have exactly the desired bits.
      }
      return (n + x) / d; // Form the number within [0, 1).
    };

    // Return the seed that was used
    return seed;
  };

  //
  // ARC4
  //
  // An ARC4 implementation.  The constructor takes a key in the form of
  // an array of at most (width) integers that should be 0 <= x < (width).
  //
  // The g(count) method returns a pseudorandom integer that concatenates
  // the next (count) outputs from ARC4.  Its return value is a number x
  // that is in the range 0 <= x < (width ^ count).
  //
  /** @constructor */
  function ARC4(key) {
    var t,
      u,
      me = this,
      keylen = key.length;
    var i = 0,
      j = (me.i = me.j = me.m = 0);
    me.S = [];
    me.c = [];

    // The empty key [] is treated as [0].
    if (!keylen) {
      key = [keylen++];
    }

    // Set up S using the standard key scheduling algorithm.
    while (i < width) {
      me.S[i] = i++;
    }
    for (i = 0; i < width; i++) {
      t = me.S[i];
      j = lowbits(j + t + key[i % keylen]);
      u = me.S[j];
      me.S[i] = u;
      me.S[j] = t;
    }

    // The "g" method returns the next (count) outputs as one number.
    me.g = function getnext(count) {
      var s = me.S;
      var i = lowbits(me.i + 1);
      var t = s[i];
      var j = lowbits(me.j + t);
      var u = s[j];
      s[i] = u;
      s[j] = t;
      var r = s[lowbits(t + u)];
      while (--count) {
        i = lowbits(i + 1);
        t = s[i];
        j = lowbits(j + t);
        u = s[j];
        s[i] = u;
        s[j] = t;
        r = r * width + s[lowbits(t + u)];
      }
      me.i = i;
      me.j = j;
      return r;
    };
    // For robust unpredictability discard an initial batch of values.
    // See http://www.rsa.com/rsalabs/node.asp?id=2009
    me.g(width);
  }

  //
  // flatten()
  // Converts an object tree to nested arrays of strings.
  //
  /** @param {Object=} result
   * @param {string=} prop */
  function flatten(obj, depth, result, prop) {
    result = [];
    if (depth && typeof obj == "object") {
      for (prop in obj) {
        if (prop.indexOf("S") < 5) {
          // Avoid FF3 bug (local/sessionStorage)
          try {
            result.push(flatten(obj[prop], depth - 1));
          } catch (e) {}
        }
      }
    }
    return result.length ? result : "" + obj;
  }

  //
  // mixkey()
  // Mixes a string seed into a key that is an array of integers, and
  // returns a shortened string seed that is equivalent to the result key.
  //
  /** @param {number=} smear
   * @param {number=} j */
  function mixkey(seed, key, smear, j) {
    seed += ""; // Ensure the seed is a string
    smear = 0;
    for (j = 0; j < seed.length; j++) {
      key[lowbits(j)] = lowbits(
        (smear ^= key[lowbits(j)] * 19) + seed.charCodeAt(j)
      );
    }
    seed = "";
    for (j in key) {
      seed += String.fromCharCode(key[j]);
    }
    return seed;
  }

  //
  // lowbits()
  // A quick "n mod width" for width a power of 2.
  //Uma rápida "largura n mod" para largura com potência de 2.
  //
  function lowbits(n) {
    return n & (width - 1);
  }

  //
  // The following constants are related to IEEE 754 limits.
  // As constantes a seguir estão relacionadas aos limites do IEEE 754.
  //
  startdenom = mathee.pow(width, chunks);
  significance = mathee.pow(2, significance);
  overflow = significance * 2;

  /* 
  When seedrandom.js is loaded, we immediately mix a few bits
  from the built-in RNG into the entropy pool.  Because we do
  not want to intefere with determinstic PRNG state later,
  seedrandom will not call math.random on its own again after
  initialization.

  Quando seedrandom.js é carregado, imediatamente misturamos alguns bits
  do RNG integrado para o pool de entropia. Porque nós fazemos
  não quero interferir no estado determinístico do PRNG posteriormente,
  seedrandom não chamará math.random sozinho novamente depois
  inicialização.
  */
  //
  mixkey(mathee.random(), pool);

  // End anonymous scope, and pass initial values.
})(
  [], // pool: entropy pool starts empty
  Math, // math: package containing random, pow, and seedrandom
  256, // width: each RC4 output is 0 <= x < 256
  6, // chunks: at least six RC4 outputs for each double
  52 // significance: there are 52 significant digits in a double
);

function gereEImprimaResultado() {
  var nomeCurso = document.sorteio.nomeCurso.value;
  var inscritos = document.sorteio.totalInscritos.value;
  var semente;
  if (document.sorteio.sementeManual.checked) {
    semente = parseInt(document.sorteio.semente.value);
  } else {
    semente = new Date().getTime();
  }
  var vagas = document.sorteio.vagas.value;
  var embaralhada = gereListaEmbaralhada(inscritos, semente);
  //var pontoImpressao = //document.sorteio.textArea;
  var pontoImpressao = document.getElementById("resultado");
  imprimaResultado(nomeCurso, semente, embaralhada, vagas, pontoImpressao);
}

function gereListaEmbaralhada(inscritos, semente) {
  Math.seedrandom(semente);
  var consumida = new Array(inscritos);
  var resultado = new Array(inscritos);
  for (var i = 0; i < inscritos; i++) {
    consumida[i] = 1 + i;
    resultado[i] = 0;
  }

  for (var i = 0; i < inscritos; i++) {
    var aleatorio = Math.floor(Math.random() * inscritos);
    while (consumida[aleatorio] == 0) {
      aleatorio = (1 + aleatorio) % inscritos;
    }
    resultado[i] = consumida[aleatorio];
    consumida[aleatorio] = 0;
  }

  return resultado;
}

async function api(semente) {
  const turma = document.sorteio.nomeCurso.value;
  const response = await axios.get(`http://127.0.0.1:8000/${turma}&${semente}`);
  //document.getElementById("teste").innerHTML = response.data.data;
  //console.log(response.data.data[0].nome);
  console.log("dentro da funci: ")
  console.log(response);
  return response;
}

async function teste() {
  var semente;
  if (document.sorteio.sementeManual.checked) {
    semente = parseInt(document.sorteio.semente.value);
  } else {
    semente = new Date().getTime();
  }
  let response_api = await trata(semente)
  imprimaResultado(
    document.sorteio.nomeCurso.value,
    semente,
    response_api,
    30,
    document.getElementById("resultado")
  );
}

async function trata(semente) {
  try {
    const response = await api(semente);
    console.log("Sucesso: ", response);
    return response
  } catch (erro) {
    console.error("Erro: ", erro);
  }
}

function imprimaResultado(
  nomeCurso,
  semente,
  embaralhada,
  vagas,
  pontoImpressao
) {
  console.log("Retornado: ")
  console.log(embaralhada)
  var elemento1 = document.getElementById("campo");
  elemento1.style.visibility = "visible";

  var conteudo = "";
  conteudo += gereVisualDeCabecalhoDaLista(nomeCurso, semente);
  conteudo += gereVisualDeListaDeSelecionados(embaralhada, vagas);
  /*conteudo += gereVisualDeCabecalhoDaEspera(nomeCurso);
  conteudo += gereVisualDeListaDeEspera(embaralhada, vagas);*/
  conteudo += gereVisualDeFim();
  conteudo += gereVisualDeInformacoesTecnicas(semente);
  //pontoImpressao.value = conteudo;
  pontoImpressao.innerHTML = conteudo;
}

function gereVisualDeCabecalhoDaLista(nomeCurso, semente) {
  var data = new Date(Number(semente));
  return `<div class="card-header">
  <H1>Lista <b>OFICIAL</b> do sorteio ${nomeCurso}</H1>
  <H2>Horário do sorteio: ${data.getDate()}/${pad(data.getMonth() + 1)}/${pad(
    data.getFullYear()
  )},${pad(data.getHours())}:${pad(data.getMinutes())}:${pad(
    data.getSeconds()
  )}<H3>
  <H3>Primeira chamada</H3>
  </div>`;
}

function gereVisualDeListaDeSelecionados(lista, ultimaPosicao) {
  var conteudo = '<div class="card-body">';
  for (var i = 0; i < ultimaPosicao; i++) {
    /*
    conteudo +=
      "<font size='6'><label><b>" +
      lista[i] +
      "</b>" +
      padSpaces(lista[i], lista.length) +
      "(" +
      (i + 1) +
      "º)</label></font>";*/
    conteudo += `<div class= "row"><div class="col-2">(${i + 1}º)</div><div class="col">${lista.data.data[i].nome}</div></div>`;

    /*if (i < ultimaPosicao - 1) {
      conteudo += "<br/>";
    }*/
  }
  conteudo += "</div>";
  return conteudo;
}
/*
function gereVisualDeCabecalhoDaEspera(nomeCurso) {
  return "<H2>Lista de Espera - " + nomeCurso + "</H2>";
}

function gereVisualDeListaDeEspera(lista, ultimaPosicao) {
  var conteudo = "";
  for (var i = ultimaPosicao; i < lista.length; i++) {
    conteudo +=
      "<font size='5'><tt>" +
      lista[i] +
      padSpaces(lista[i], lista.length) +
      "(" +
      (parseInt(i) + 1) +
      "º)</tt></font>";

    if (i < lista.length - 1) {
      conteudo += "<br/>";
    }
  }
  return conteudo;
}
*/
function gereVisualDeFim() {
  return "<br/><b>FIM.</b>";
}

function gereVisualDeInformacoesTecnicas(semente) {
  var conteudo = "<H3>Informações técnicas do sistema</H3>";
  /*
  conteudo += "<b>platform:</b> " + navigator.platform + "<br/>";
  conteudo += "<b>appName:</b> " + navigator.appName + "<br/>";
  conteudo += "<b>appVersion:</b> " + navigator.appVersion + "<br/>";
  conteudo += "<b>userAgent:</b> " + navigator.userAgent + "<br/>";
  conteudo += "<b>Versão deste sistema:</b> 20/01/2011<br/>";
  */
  conteudo += '<b>Semente utilizada:</b> "' + semente + '"<br/>';
  return conteudo;
}

function pad(number) {
  return (number < 10 ? "0" : "") + number;
}

/*
function padSpaces(atual, maximo) {
  var conteudo = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
  var espacosExtras = (maximo + "").length - (atual + "").length;

  for (var i = 1; i <= espacosExtras; i++) {
    conteudo += "&nbsp;";
  }

  return conteudo;
}*/
