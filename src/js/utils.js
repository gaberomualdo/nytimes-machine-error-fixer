Array.prototype.contains = function (elm) {
  return this.indexOf(elm) > -1;
};
String.prototype.noHTML = function () {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = this;
  return tmp.textContent || tmp.innerText || '';
};
