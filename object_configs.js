var Info_interactive = { 
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
  //calls func. when jmol has loaded and is ready
  readyFunction: jmolRightIsReady, 
  debug: true //deixar true se tiver problemas
}
function jmolRightIsReady() { //changes post-loading. PRECISA estar aqui, se não diz function undefined
  //disable perspective (needed for better precision in calculations of screen xy projections)
  Jmol.script(jsmol_molecula,'set perspectiveDepth OFF');
  //disable any interaction besides rotation and menus
  Jmol.script(jsmol_molecula,'unbind _rotateZ;unbind _rotateZorZoom;unbind _reset;unbind _translate;unbind _center;unbind _pickAtom;unbind _setMeasure;unbind _slideZoom;unbind _wheelZoom');
  //disable popup menu
  Jmol.script(jsmol_molecula,'unbind _popupMenu');
  //disable rotation(for zero interactions)
  //Jmol.script(jsmol_molecula,'unbind _rotate');
  //disable the jmol watermark
  Jmol.script(jsmol_molecula,'frank off');
  prepMolecula(task_n,jsmol_molecula);
  //alert();//debug
}
function jmolLeftIsReady() {
  Jmol.script(jsmol_molecula,'set perspectiveDepth OFF');
  Jmol.script(jsmol_molecula,'unbind _rotateZ;unbind _rotateZorZoom;unbind _reset;unbind _translate;unbind _center;unbind _pickAtom;unbind _setMeasure;unbind _slideZoom;unbind _wheelZoom');
  Jmol.script(jsmol_molecula,'unbind _popupMenu');
  Jmol.script(jsmol_molecula,'unbind _rotate');
  Jmol.script(jsmol_molecula,'frank off');
  prepMolecula(task_n,jsmol_molecula);
}
//reference orientation
var Ori1 = -675;        
var Ori2 = -389;
var Ori3 = -627;
var Ori4 = 93.16;
//commands for changing into reference orientation
//moveto 0 {-675 -389 -627 93.16} 
//or moveto 0 QUATERNION {-0.4902575975335792 -0.2825336376897219 -0.45539483504230244 0.6873410913449087}
