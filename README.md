# html-overlays 

HTML overlays clones a given a element (and its ancestors) under a different root.
This allows correct styling to be applied to an element, even if not rendered under the same html sub-tree. 

## Overlay Manager
Manages the overlay layer using a given context.

### createOverlay(overlayContext:Element)
Clones overlayContext onto a new layer.
It returns some useful stuff (see below)

Example:
```ts
//constructor creates the overlay layer which will house the clones:
const overlayManager = new OverlayManager(document.body);

//createOverlay clones the popup (an HTMLElement) 
const {layer,           // the cloned layer created (ancestors top)
        target,         // the clone of overlayContext
        parentTarget,   // parent of target
        destroy         //a function which, when called, destroys the created layer
} = overlayManager.createOverlay(popup);

destroy();
```
