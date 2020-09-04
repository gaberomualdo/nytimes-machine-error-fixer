Array.prototype.contains = function (elm) {
  return this.indexOf(elm) > -1;
};
String.prototype.noHTML = function () {
  return (
    this.replace(/<style[^>]*>.*<\/style>/gm, '')
      // Remove script tags and content
      .replace(/<script[^>]*>.*<\/script>/gm, '')
      // Remove all opening, closing and orphan HTML tags
      .replace(/<[^>]+>/gm, '')
      // Remove leading spaces and repeated CR/LF
      .replace(/([\r\n]+ +)+/gm, '')
  );
};
