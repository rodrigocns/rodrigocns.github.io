var Info = { 
  //https://wiki.jmol.org/index.php/Jmol_JavaScript_Object/Info
  color: "#000000",
  height: 400,
  width: 400,
  use: "HTML5",
  src: "models/pseudobatracotoxin_molecule.xyz",
  j2sPath: "jsmol/j2s",
  serverURL: "jsmol/php/jsmol.php",
  disableMouse: true,

  defaultModel: "",
  script: null,
  readyFunction: jmolIsReady, //ou null. chama função qndo jmol carregou e está pronto
  // readyFunction: null,    
  debug: false //deixar true se tiver problemas
}
function jmolIsReady() { //mudanças pós-carregamento. PRECISA estar aqui, se não diz function undefined
  // Jmol.script(jsmol_molecula,'zoom off; frank off');
  // Jmol.script(jsmol_molecula,'frank off');
  Jmol.script(jsmol_molecula,'set perspectiveDepth OFF');
  // Jmol.script(jsmol_molecula,'unbind _popupMenu;unbind _rotateZ;unbind _rotateZorZoom;unbind _reset;unbind _translate;unbind _center;unbind _pickAtom;unbind _setMeasure;unbind _slideZoom;unbind _wheelZoom;frank off;');
  Jmol.script(jsmol_molecula,'unbind _rotateZ;unbind _rotateZorZoom;unbind _reset;unbind _translate;unbind _center;unbind _pickAtom;unbind _setMeasure;unbind _slideZoom;unbind _wheelZoom;frank off;');
  
  prepMolecula(task_n);
  // alert('feito!');//debug
}
//orientações da referência
var Ori1 = -675;        
var Ori2 = -389;
var Ori3 = -627;
var Ori4 = 93.16;
    //moveto 0 {-675 -389 -627 93.16} 
    //or moveto 0 QUATERNION {-0.4902575975335792 -0.2825336376897219 -0.45539483504230244 0.6873410913449087}
