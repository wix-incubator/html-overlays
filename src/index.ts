export { default as createHTML } from './create-html';
export { DOMMirror } from './mirror-dom';
export { OverlayManager } from './overlay-manager';






// var observer = new MutationObserver(function(mutations) {
//     mutations.forEach(function(mutation) {
//       switch(mutation.type){
//           case 'attributes':
//         //   attributeName
//             const target = mutation.target as HTMLElement;
//             const clones = registrationMap.get(target);
//             if(clones){
//                 clones.forEach(clone => clone.setAttribute(mutation.attributeName, target.getAttribute(mutation.attributeName)));
//             }
//             break;
//       }
//     });    
// });
// var observerConfig = {attributes: true};
  
// var registrationMap = new Map();
  
// function openPopup(event) { 
//     const parents = getParentChain(event.target);
//     const portalsHolder = insurePopupHolder();
//     const layer = createPopupLayer(portalsHolder);
    
//     let currentParent = layer;
//     for(let i = 0; i < parents.length; ++i){
//       const parentOrigin = parents[i];
//       const parentClone = parentOrigin.cloneNode();
//       const copies = registrationMap.get(parentOrigin) || [];
//       if(!registrationMap.has(parentOrigin)){
//         registrationMap.set(parentOrigin, copies);
//       }
//       copies.push(parentClone);
//       parentClone.setAttribute('style', 'position:static;visibility:hidden;transform:unset;pointer-events:none;');
//       currentParent.appendChild(parentClone);
//       currentParent = parentClone;
//       observer.observe(parentOrigin, observerConfig);
//     }
    
//     currentParent.innerHTML = '<div class="Popup--root">POP!</div>'
// }
  
// function getParentChain(element) {
//     var result = [];
//     while(element && element !== document.body){
//       result.unshift(element)
//       element = element.parentElement;
//     }
//     return result;
// }
  
// var _portalsHolder;
// function insurePopupHolder(){
//     if(!_portalsHolder){
//       _portalsHolder = document.createElement('div');
//       _portalsHolder.style.position = 'fixed';
//       _portalsHolder.style.width = '0';
//       _portalsHolder.style.height = '0';
//       _portalsHolder.style.zIndex = '10';
//       document.body.insertBefore(_portalsHolder, document.body.firstChild);
//     } 
//     return _portalsHolder;
// }
  
// function createPopupLayer(portalsHolder){
//     const layer = document.createElement('div');
//     portalsHolder.appendChild(layer);
//     return layer;
// }