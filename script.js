blankCue = 
`<cue>
  <b contenteditable>"Line"</b>
  Enter
  <button onclick="switchCharacter(this);">Press to Select Character</button>
  From
  <button onclick="switchEntrance(this);">LA</button>
  <button class="delete-cue" onclick="deleteCue(this)"><i class="far fa-window-close"></i></button>
</cue>`

blankMetadata = '<metadata id="docTitle">Untitled</metadata><metadata id="docSaved">False</metadata>'

blankCharacterFirst = '<tr id="'
blankCharacterSecond = '"><td contenteditable>'
blankCharacterThird = '</td><td><button class="delete-cue" onclick="deleteCharacter(this)"><i class="far fa-window-close"></i></button></td></tr>'

addCharacterMenu = '<tr><td>Add Character</td><td><button class="add-cue" onclick="addCharacter(this)"><i class="far fa-plus-square"></i></button></td></tr>'

characters = []
entrances = ["LA","RA","UL","UR","RRA","LLA"]

function onBeforeUnload(e) {
    e.preventDefault();
    e.returnValue = '';
    return;

    delete e['returnValue'];
}

// window.addEventListener('beforeunload', onBeforeUnload);
// window.addEventListener('beforeclose', onBeforeUnload);

function addCue() {
  document.getElementById("sheet").innerHTML += blankCue;
}

function switchCharacter(obj){
  loadCharacters();
  character = characters[characters.indexOf(obj.innerHTML) + 1];
  if (character == undefined || character == '') {
    character = characters[0];
    if (character == undefined || character == '') {
      alert("No characters defined!");
    } else {
      obj.innerHTML = character;
    }
  } else {
    obj.innerHTML = character;
  }
}

function switchEntrance(obj){
  entance = entrances[entrances.indexOf(obj.innerHTML) + 1];
  if (entance == undefined) entance = entrances[0];
  obj.innerHTML = entance;
}

function save(){
  if (document.getElementById("docSaved").innerHTML == "False"){
    name = prompt("What do you want to save the document as?");
    if (name != null && name != "null"){
      document.getElementById("docTitle").innerHTML = name;
      document.getElementById("docSaved").innerHTML = "True";
      localStorage.setItem("saves", localStorage.getItem("saves") + "," + name);
      console.log("Saved sheet: " + name + ".doc!");
      localStorage.setItem(name, document.getElementById("sheet").innerHTML);
      return true;
    } else {
      return false;
    }
  } else {
    name = document.getElementById("docTitle").innerHTML;
    console.log("Resaved sheet: " + name + ".doc!");
    localStorage.setItem(name, document.getElementById("sheet").innerHTML);
    return true;
  }
}

function openSheet(){
  if (localStorage.getItem("saves") == null || localStorage.getItem("saves").split(",").length == 1) alert("There are no saves!");
  else {
    saves = localStorage.getItem("saves").split(",");
    saves.shift();
    console.log(saves);
    list = document.getElementById("file-chooser")
    list.innerHTML = "";
    for (let i = 0; i < saves.length; i++){
      list.innerHTML += '<li id="' + saves[i] + '">' + saves[i] + '<button onclick="openSave(`' + saves[i] + '`)"><i class="far fa-folder-open"></i> Open</button><button onclick="deleteSave(`' + saves[i] + '`)"><i class="far fa-trash-alt"></i> Delete</button></li>'
    }
    toggleShow(document.getElementById('file-window'))
  }
}

function clearItems() {
  if (confirm("Are you sure?")) localStorage.clear();
}

function toggleShow(obj) {
  obj.classList.toggle("hidden");
  obj.classList.toggle("shown");
  loadCharacters();
}

function openSave(name) {
  document.getElementById("sheet").innerHTML = localStorage.getItem(name);
  toggleShow(document.getElementById("file-window"));
  loadCharacters();
}

function deleteSave(name) {
  if(confirm("Delete Document? What's done is done and cannot be undone.")){
    localStorage.removeItem(name);
    saves = localStorage.getItem("saves").split(",");
    for(let i = 0; i < saves.length; i++){ 
      if (saves[i] == name) { 
        saves.splice(i, 1); 
      }
    }
    localStorage.setItem("saves", saves);
    document.getElementById(name).remove();
  }
}

function newSheet() {
  if (save()) document.getElementById("sheet").innerHTML = blankMetadata;
  loadCharacters();
}

function deleteCue(self) {
  self.parentElement.remove()
}

function deleteCharacter(self) {
  characters.splice(self.parentElement.parentElement.id, 1)
  self.parentElement.parentElement.remove();
  saveCharacters();
}

function addCharacter(self) {
  table = self.parentElement.parentElement.parentElement;
  self.parentElement.parentElement.remove();
  let characterName = prompt("What is the character's name?");
  table.innerHTML += blankCharacterFirst + characters.length + blankCharacterSecond + characterName + blankCharacterThird;
  table.innerHTML += addCharacterMenu;
  characters.push(characterName);
  saveCharacters();
}

function saveCharacters (){
  localStorage.setItem("charactersNames", characters.join(","));
  localStorage.setItem("charactersHTML", document.getElementById("character-table").innerHTML);
}

function loadCharacters (){
  characters = localStorage.getItem("charactersNames").split(",");
  document.getElementById("character-table").innerHTML = localStorage.getItem("charactersHTML");
  characters.shift();
}