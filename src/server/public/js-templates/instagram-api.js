var style = document.createElement('style');
document.head.appendChild(style);
var sheet = document.styleSheets[0];
sheet.insertRule(".instagram { text-align: center; }", sheet.cssRules.length);
sheet.insertRule(".instagram-pic { max-width: 100%; max-height: 100%; }", sheet.cssRules.length);
var langContent = document.createElement('div');
langContent.innerHTML = '{htmlcontent}';
var langBlock = document.getElementById('instagramBlock');
langBlock.appendChild(langContent);
