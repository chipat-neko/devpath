/* =============================================================================
   erreurs-index.js — DÉRIVÉ de js/erreurs-data.js par tools/build-erreurs-index.js.
   NE PAS ÉDITER À LA MAIN : régénérer après toute modification du décodeur.

   À quoi il sert : les leçons citées par le décodeur affichent un encart « quand ça
   casse ». Elles n'ont pas besoin des causes, des remèdes ni des exemples — juste du
   nom des erreurs qui les concernent. Cet index pèse quelques kilo-octets là où le
   fichier de données en pèse une cinquantaine.
   Clé : le chemin de la leçon, relatif à pages/.
   ============================================================================= */
window.ERREURS_INDEX = {
  "bash/lecon-01.html": [
    {"id":"sh-command-not-found","gabarit":"…: line …: …: command not found","langue":"bash"}
  ],
  "bash/lecon-02.html": [
    {"id":"sh-eof-guillemet","gabarit":"unexpected EOF while looking for matching `…'","langue":"bash"},
    {"id":"sh-substitution","gabarit":"${…}: bad substitution","langue":"bash"},
    {"id":"sh-division","gabarit":"…: division by 0 (error token is \"…\")","langue":"bash"},
    {"id":"sh-readonly","gabarit":"…: readonly variable","langue":"bash"}
  ],
  "bash/lecon-03.html": [
    {"id":"sh-no-such-file","gabarit":"…: …: No such file or directory","langue":"bash"}
  ],
  "bash/lecon-04.html": [
    {"id":"sh-token-inattendu","gabarit":"syntax error near unexpected token `…'","langue":"bash"},
    {"id":"sh-fin-de-fichier","gabarit":"syntax error: unexpected end of file from `…' command on line …","langue":"bash"},
    {"id":"sh-test-unaire","gabarit":"[: …: unary operator expected","langue":"bash"}
  ],
  "bash/lecon-08.html": [
    {"id":"sh-unbound","gabarit":"…: unbound variable","langue":"bash"}
  ],
  "js/lecon-01.html": [
    {"id":"js-parenthese","gabarit":"SyntaxError: missing ) after argument list","langue":"javascript"}
  ],
  "js/lecon-02.html": [
    {"id":"js-not-defined","gabarit":"ReferenceError: … is not defined","langue":"javascript"},
    {"id":"js-const","gabarit":"TypeError: Assignment to constant variable.","langue":"javascript"},
    {"id":"js-deja-declaree","gabarit":"SyntaxError: Identifier '…' has already been declared","langue":"javascript"}
  ],
  "js/lecon-07.html": [
    {"id":"js-not-a-function","gabarit":"TypeError: ….… is not a function","langue":"javascript"}
  ],
  "js/lecon-08.html": [
    {"id":"js-map-objet","gabarit":"TypeError: ….map is not a function","langue":"javascript"}
  ],
  "js/lecon-09.html": [
    {"id":"js-undefined-prop","gabarit":"TypeError: Cannot read properties of undefined (reading '…')","langue":"javascript"},
    {"id":"js-not-iterable","gabarit":"TypeError: … is not iterable","langue":"javascript"}
  ],
  "js/lecon-10.html": [
    {"id":"js-null-prop","gabarit":"TypeError: Cannot set properties of null (setting '…')","langue":"javascript"}
  ],
  "js/lecon-14.html": [
    {"id":"js-tofixed","gabarit":"RangeError: toFixed() digits argument must be between 0 and 100","langue":"javascript"}
  ],
  "js/lecon-16.html": [
    {"id":"js-tdz","gabarit":"ReferenceError: Cannot access '…' before initialization","langue":"javascript"}
  ],
  "js/lecon-18.html": [
    {"id":"js-stack","gabarit":"RangeError: Maximum call stack size exceeded","langue":"javascript"}
  ],
  "js/lecon-23.html": [
    {"id":"js-await-hors-async","gabarit":"SyntaxError: await is only valid in async functions and the top level bodies of modules","langue":"javascript"}
  ],
  "js/lecon-32.html": [
    {"id":"js-json-vide","gabarit":"SyntaxError: Unexpected end of JSON input","langue":"javascript"},
    {"id":"js-json-simple","gabarit":"SyntaxError: Expected property name or '}' in JSON at position … (line … column …)","langue":"javascript"}
  ],
  "python/lecon-01.html": [
    {"id":"py-parenthese","gabarit":"SyntaxError: '…' was never closed","langue":"python"}
  ],
  "python/lecon-02.html": [
    {"id":"py-name","gabarit":"NameError: name '…' is not defined. Did you mean: '…'?","langue":"python"},
    {"id":"py-concat","gabarit":"TypeError: can only concatenate str (not \"…\") to str","langue":"python"},
    {"id":"py-int","gabarit":"ValueError: invalid literal for int() with base 10: '…'","langue":"python"}
  ],
  "python/lecon-03.html": [
    {"id":"py-zero","gabarit":"ZeroDivisionError: division by zero","langue":"python"}
  ],
  "python/lecon-04.html": [
    {"id":"py-indent","gabarit":"IndentationError: expected an indented block after '…' statement on line …","langue":"python"},
    {"id":"py-deux-points","gabarit":"SyntaxError: expected ':'","langue":"python"}
  ],
  "python/lecon-05.html": [
    {"id":"py-int-iterable","gabarit":"TypeError: '…' object is not iterable","langue":"python"}
  ],
  "python/lecon-06.html": [
    {"id":"py-argument","gabarit":"TypeError: …() missing … required positional argument…: '…'","langue":"python"},
    {"id":"py-unbound","gabarit":"UnboundLocalError: cannot access local variable '…' where it is not associated with a value","langue":"python"},
    {"id":"py-recursion","gabarit":"RecursionError: maximum recursion depth exceeded","langue":"python"}
  ],
  "python/lecon-07.html": [
    {"id":"py-index","gabarit":"IndexError: list index out of range","langue":"python"},
    {"id":"py-attribute","gabarit":"AttributeError: '…' object has no attribute '…'","langue":"python"}
  ],
  "python/lecon-08.html": [
    {"id":"py-key","gabarit":"KeyError: '…'","langue":"python"}
  ],
  "python/lecon-09.html": [
    {"id":"py-str-item","gabarit":"TypeError: '…' object does not support item assignment","langue":"python"}
  ],
  "python/lecon-11.html": [
    {"id":"py-module","gabarit":"ModuleNotFoundError: No module named '…'","langue":"python"}
  ],
  "sql/lecon-02.html": [
    {"id":"sql-table","gabarit":"no such table: …","langue":"sql"},
    {"id":"sql-colonne","gabarit":"no such column: …","langue":"sql"},
    {"id":"sql-syntaxe","gabarit":"near \"…\": syntax error","langue":"sql"},
    {"id":"sql-incomplet","gabarit":"incomplete input","langue":"sql"}
  ],
  "sql/lecon-03.html": [
    {"id":"sql-order-range","gabarit":"…st ORDER BY term out of range - should be between … and …","langue":"sql"}
  ],
  "sql/lecon-04.html": [
    {"id":"sql-fonction","gabarit":"no such function: …","langue":"sql"},
    {"id":"sql-agregat","gabarit":"misuse of aggregate function …()","langue":"sql"}
  ],
  "sql/lecon-05.html": [
    {"id":"sql-ambigu","gabarit":"ambiguous column name: …","langue":"sql"},
    {"id":"sql-sous-requete","gabarit":"sub-select returns … columns - expected …","langue":"sql"}
  ],
  "sql/lecon-06.html": [
    {"id":"sql-unique","gabarit":"UNIQUE constraint failed: ….…","langue":"sql"},
    {"id":"sql-notnull","gabarit":"NOT NULL constraint failed: ….…","langue":"sql"},
    {"id":"sql-nb-valeurs","gabarit":"… values for … columns","langue":"sql"},
    {"id":"sql-table-existe","gabarit":"table … already exists","langue":"sql"},
    {"id":"sql-fk","gabarit":"FOREIGN KEY constraint failed","langue":"sql"}
  ]
};
