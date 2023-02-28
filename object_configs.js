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
  readyFunction: jmolIsReady, 
  debug: true //deixar true se tiver problemas
}
function jmolIsReady() { //changes post-loading. PRECISA estar aqui, se não diz function undefined
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
  //alert();//debug
}
//reference orientation
//moveto 0 {-675 -389 -627 93.16} 
//or moveto 0 QUATERNION {-0.4902575975335792 -0.2825336376897219 -0.45539483504230244 0.6873410913449087}
var Ori1 = -675;        
var Ori2 = -389;
var Ori3 = -627;
var Ori4 = 93.16;

function prepMolecula(num) {   //mapper para o preparo do teste que está acontecendo
  //Rotaciona para a orientação inicial do objeto
  jsmol_obj = jsmol_molecula; 
  Jmol.script(jsmol_obj,'moveto 0.0 {-666 39 745 139.54}');
  //em cada case # estão as configurações de renderização do objeto interativo em cada tarefa
  switch (num){
    case 0:
      Jmol.script(jsmol_obj,'color cpk; spacefill off; wireframe 0.15');
      document.getElementById('modelo_estatico').src='imgs/batracoisa_0.png';
      break;
    case 1:
      Jmol.script(jsmol_obj,'color structure; spacefill off; wireframe 0.15');
      document.getElementById('modelo_estatico').src='imgs/batracoisa_1.png';
      break;
    case 2:
      Jmol.script(jsmol_obj,'color cpk; spacefill 23%; wireframe 0.15');
      document.getElementById('modelo_estatico').src='imgs/batracoisa_2.png';
      break;
    case 3:
      Jmol.script(jsmol_obj,'color structure; spacefill 23%; wireframe 0.15');
      document.getElementById('modelo_estatico').src='imgs/batracoisa_3.png';
      break;
    case 4:
      Jmol.script(jsmol_obj,'color cpk; spacefill 23%; wireframe OFF');
      document.getElementById('modelo_estatico').src='imgs/batracoisa_4.png';
      break;
    case 5:
      Jmol.script(jsmol_obj,'color structure; spacefill 23%; wireframe OFF');
      document.getElementById('modelo_estatico').src='imgs/batracoisa_5.png';
      break;
    
    //https://chemapps.stolaf.edu/jmol/docs/examples/bonds.htm  altera visualisação dos dados
  }
}
