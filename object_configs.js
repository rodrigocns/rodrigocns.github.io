var Info_interactive = { 
  //For more explanations go to https://wiki.jmol.org/index.php/Jmol_JavaScript_Object/Info
  color: "#000000",
  height: 400,
  width: 400,
  use: "HTML5",
  j2sPath: "jsmol/j2s",
  serverURL: "jsmol/php/jsmol.php",
  disableMouse: true,

  defaultModel: "",
  src: "models/pseudobatracotoxin_molecule.xyz", //script overwrites this
  script: 
  "load models/pseudobatracotoxin_molecule.xyz;\
  set perspectiveDepth OFF;\
  unbind _rotateZ;\
  unbind _rotateZorZoom;\
  unbind _reset;\
  unbind _translate;\
  unbind _center;\
  unbind _pickAtom;\
  unbind _setMeasure;\
  unbind _slideZoom;\
  unbind _wheelZoom;\
  unbind _popupMenu;\
  frank off;",
  readyFunction: null,   //calls func. when jmol has loaded and is ready
  debug: true //deixar true se tiver problemas
}
//explaining JSmol script commands:
//disable perspective (needed for better precision in calculations of screen xy projections)
// set perspectiveDepth OFF;
//disable the input of most interactions
// unbind _rotateZ; unbind _rotateZorZoom; unbind <...>';
//disable the jmol watermark
// frank off;

var Info_reference = structuredClone(Info_interactive);
//disable rotation
Info_reference.script = Info_interactive.script.concat("set mouseDragFactor 0");

//reference orientation
//moveto 0 {-675 -389 -627 93.16} 
//or moveto 0 QUATERNION {-0.4902575975335792 -0.2825336376897219 -0.45539483504230244 0.6873410913449087}
var Ori1 = -675;        
var Ori2 = -389;
var Ori3 = -627;
var Ori4 = 93.16;

function prepMolecula(num) {   //mapper para o preparo do teste que está acontecendo
  //Rotaciona para a orientação inicial do objeto
  jsmol_obj = jsmolInteractiveObject; 
  Jmol.script(jsmol_obj,'moveto 0.0 {-666 39 745 139.54}');
  jsmol_ref = jsmolReferenceObject; 
  Jmol.script(jsmol_ref,'moveto 0 {-675 -389 -627 93.16}');
  //em cada case # estão as configurações de renderização dos objetos de cada tarefa
  switch (num){
    case 0:
      Jmol.script(jsmol_ref,'color cpk; spacefill off; wireframe 0.15');
      Jmol.script(jsmol_obj,'color cpk; spacefill off; wireframe 0.15');
      break;
    case 1:
      Jmol.script(jsmol_ref,'color structure; spacefill off; wireframe 0.15');
      Jmol.script(jsmol_obj,'color structure; spacefill off; wireframe 0.15');
      break;
    case 2:
      Jmol.script(jsmol_ref,'color structure; spacefill off; wireframe 0.15');
      Jmol.script(jsmol_obj,'color structure; spacefill off; wireframe 0.15');
      break;
    case 3:
      Jmol.script(jsmol_ref,'color structure; spacefill 23%; wireframe 0.15');
      Jmol.script(jsmol_obj,'color structure; spacefill 23%; wireframe 0.15');
      break;
    case 4:
      Jmol.script(jsmol_ref,'color cpk; spacefill 23%; wireframe OFF');
      Jmol.script(jsmol_obj,'color cpk; spacefill 23%; wireframe OFF');
      break;
    case 5:
      Jmol.script(jsmol_ref,'color structure; spacefill 23%; wireframe OFF');
      Jmol.script(jsmol_obj,'color structure; spacefill 23%; wireframe OFF');
      break;
    
    //https://chemapps.stolaf.edu/jmol/docs/examples/bonds.htm  altera visualisação dos dados
  }
}
