function CheckboxLinker(master, slaves) {
  function is_checkbox(checkbox) {
    return (checkbox instanceof HTMLElement) && checkbox.tagName.toLowerCase() === "input" && checkbox.type === "checkbox";
  }
  if (!is_checkbox(master))
    throw "CheckboxLinker Error: Master checkbox is not a checkbox";
  if (!Array.isArray(slaves)) {
    if (HTMLCollection.prototype.isPrototypeOf(slaves) || NodeList.prototype.isPrototypeOf(slaves))
      slaves = Array.from(slaves);
    else
      throw "CheckboxLinker Error: Slave list is not array";
  }
  if (slaves.length === 0)
    throw "CheckboxLinker Error: No slaves provided";
  slaves.forEach(function(slave) {
    if (!is_checkbox(slave))
      throw `CheckboxLinker Error: Slave checkbox №${i} is not a checkbox`;
  })

  function update_master_state() {
    let master_state = slaves.reduce(function(master_state, slave) {
      if (slave.indeterminate) {
        master_state = null;
      } else if (master_state === undefined)
        master_state = slave.checked;
      else if (master_state !== null && master_state !== slave.checked)
        master_state = null;
      return master_state;
    }, undefined);

    if (master_state === null) {
      master.indeterminate = true;
    } else {
      master.indeterminate = false;
      master.checked = master_state;
    }
    master.dispatchEvent(createEvent("change"));
  }
	function createEvent(type){
    let evt;
    if ("createEvent" in document) {
      evt = document.createEvent("HTMLEvents");
      evt.initEvent(type, false, true);
    } else
      evt= new Event(type);
    return evt;
  }
  function masterClick() {
    master.indeterminate = false;
    slaves.forEach(function(slave){
    	slave.indeterminate=false;
      slave.checked = master.checked;
    	slave.dispatchEvent(createEvent("click"));
    });
  }

  function slaveClick(slave) {
    if (slaves.length === 1) {
      master.indeterminate = false;
      master.checked = slave.checked
    } else if (master.indeterminate === false && slave.checked !== master.checked) {
      master.indeterminate = true;
    	master.dispatchEvent(createEvent("change"));
    } else {
      update_master_state();
    }
  }
  update_master_state();
  master.addEventListener("click", masterClick);
  slaves.forEach(slave => slave.addEventListener("change", event => slaveClick(slave)));
}
