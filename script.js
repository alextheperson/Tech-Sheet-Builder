blankCue = 
`<cue>
  <b contenteditable>"Line"</b>
  Enter
  <button onclick="switchCharacter(this);">Press to Select Character</button>
  From
  <button onclick="switchEntrance(this);">Press to Select Entrance</button>
  <i class="far fa-window-close delete-cue" onclick="deleteCue(this)" onmouseover="this.classList.toggle('far');this.classList.toggle('fas')" onmouseout="this.classList.toggle('far');this.classList.toggle('fas')"></i>
</cue>`

blankMetadata = '<metadata id="docTitle">Untitled</metadata><metadata id="docSaved">False</metadata>'

blankCharacterFirst = '<li id="'
blankCharacterSecond = '"><span contenteditable>'
blankCharacterThird = '</span><button onclick="deleteCharacter(this)"><i class="fas fa-window-close"></i> Delete Character</button></li>'

addCharacterMenu = '<li><button onclick="addCharacter(this)"><i class="fas fa-plus-square"></i> Add Character</button></li>'

blankEntranceFirst = '<li id="'
blankEntranceSecond = '"><span contenteditable>'
blankEntranceThird = '</span><button onclick="deleteEntrance(this)"><i class="fas fa-window-close"></i> Delete Entrance</button></li>'

addEntranceMenu = '<li><button onclick="addEntrance(this)"><i class="fas fa-plus-square"></i> Add Entrance</button></li>'

characters = []
entrances = []

function onBeforeUnload(e) {
    e.preventDefault();
    e.returnValue = '';
    return;

    delete e['returnValue'];
}

// window.addEventListener('beforeunload', onBeforeUnload);
// window.addEventListener('beforeclose', onBeforeUnload);

function addCue () {
  document.getElementById("sheet").innerHTML += blankCue;
  unSaved();
}

function switchCharacter(obj){
  loadCharacters();
  unSaved();
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
  loadEntrances();
  unSaved();
  entrance = entrances[entrances.indexOf(obj.innerHTML) + 1];
  if (entrance == undefined || entrance == '') {
    entrance = entrances[0];
    if (entrance == undefined || entrance == '') {
      alert("No entrances defined!");
    } else {
      obj.innerHTML = entrance;
    }
  } else {
    obj.innerHTML = entrance;
  }
}

function save(){
  if (document.getElementById("docSaved").innerHTML == "False"){
    name = prompt("What do you want to save the document as?");
    if (name != null && name != "null"){
      document.getElementById("docTitle").innerHTML = name;
      document.getElementById("docSaved").innerHTML = "True";
      document.getElementById("titleTab").innerHTML = name;
      document.getElementById("savedTab").innerHTML = "";
      localStorage.setItem("saves", localStorage.getItem("saves") + "," + name);
      console.log("Saved sheet: " + name + ".doc!");
      localStorage.setItem(name, document.getElementById("sheet").innerHTML);
      return true;
    } else {
      return false;
    }
  } else {
    name = document.getElementById("docTitle").innerHTML;
    document.getElementById("titleTab").innerHTML = name;
    document.getElementById("savedTab").innerHTML = "";
    console.log("Resaved sheet: " + name + ".doc!");
    localStorage.setItem(name, document.getElementById("sheet").innerHTML);
    return true;
  }
}

function unSaved() {
  document.getElementById("savedTab").innerHTML = " *";
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
      list.innerHTML += '<li id="' + saves[i] + '">' + saves[i] + '<button onclick="openSave(`' + saves[i] + '`)"><i class="fas fa-folder-open"></i> Open</button><button onclick="deleteSave(`' + saves[i] + '`)"><i class="fas fa-trash-alt"></i> Delete</button></li>'
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
  loadEntrances();
}

function openSave(name) {
  document.getElementById("sheet").innerHTML = localStorage.getItem(name);
  document.getElementById("titleTab").innerHTML = document.getElementById("docTitle").innerHTML;
  document.getElementById("savedTab").innerHTML = "";
  toggleShow(document.getElementById("file-window"));
  loadCharacters();
  loadEntrances();
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
  loadEntrances();
}

function deleteCue(self) {
  self.parentElement.remove()
  unSaved()
}

function deleteCharacter(self) {
  characters.splice(self.parentElement.id, 1)
  self.parentElement.remove();
  saveCharacters();
}

function addCharacter(self) {
  table = document.getElementById("character-list");
  self.parentElement.remove();
  let characterName = prompt("What is the character's name?");
  table.innerHTML += blankCharacterFirst + characters.length + blankCharacterSecond + characterName + blankCharacterThird;
  table.innerHTML += addCharacterMenu;
  characters.push(characterName);
  saveCharacters();
}

function saveCharacters(){
  localStorage.setItem("charactersNames", characters.join(","));
  localStorage.setItem("charactersHTML", document.getElementById("character-list").innerHTML);
}

function loadCharacters(){
  if(localStorage.getItem("charactersNames") != '' && localStorage.getItem("charactersNames") != null) {
    characters = localStorage.getItem("charactersNames").split(",");
    document.getElementById("character-list").innerHTML = localStorage.getItem("charactersHTML");
  }  else {
    document.getElementById("character-list").innerHTML = addCharacterMenu;
  }
}

function deleteEntrance(self) {
  entrances.splice(self.parentElement.id, 1)
  self.parentElement.remove();
  saveEntrances();
}

function addEntrance(self) {
  table = document.getElementById("entrance-list");
  self.parentElement.remove();
  let entranceName = prompt("What is the name of the entrance?");
  table.innerHTML += blankEntranceFirst + entrances.length + blankEntranceSecond + entranceName + blankEntranceThird;
  table.innerHTML += addEntranceMenu;
  entrances.push(entranceName);
  saveEntrances();
}

function saveEntrances(){
  localStorage.setItem("entrancesNames", entrances.join(","));
  localStorage.setItem("entrancesHTML", document.getElementById("entrance-list").innerHTML);
}

function loadEntrances(){
  if(localStorage.getItem("entrancesNames") != '' && localStorage.getItem("entrancesNames") != null) {
    entrances = localStorage.getItem("entrancesNames").split(",");
    document.getElementById("entrance-list").innerHTML = localStorage.getItem("entrancesHTML");
  }  else {
    document.getElementById("entrance-list").innerHTML = addEntranceMenu;
  }
}

function exportSheetHTML(preID) {
  document.getElementById(preID).innerHTML = document.getElementById("sheet").innerHTML.split("").join("")
}