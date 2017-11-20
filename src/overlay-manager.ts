import createHTML from './create-html';
import { DOMMirror } from './mirror-dom';

const filterIdAndOn = (value:string) => !(value === 'id' || value.match(/^on/)); 
export type OverlayItem = { layer:HTMLElement, target:Element, destroy:()=>void };

let overlayCounter = 0;

export class OverlayManager {
    private domMirror:DOMMirror = new DOMMirror(filterIdAndOn);
    private wrapper:Element = createHTML('<div class="overlay-layers"></div>');
    private overlays:{[s:string]:{parent:string|null, layer:Element}} = {};
    constructor(
        private root:Element
    ) {
        root.appendChild(this.wrapper);
    }

    public createOverlay(overlayContext:Element):OverlayItem {
        let id = overlayCounter++;
        const overlay = createHTML(`<div class="overlay" data-overlay-id="${id}"></div>`);
        const {overlayTop, overlayTarget} = this.mirrorParentChain(overlayContext);
        
        if(!overlayTop || !overlayTarget){
            throw new Error('create overlay fail');
        }
        
        overlay.appendChild(overlayTop);
        this.wrapper.appendChild(overlay);

        this.overlays[id] = {parent:null, layer:overlay};

        return {
            layer:overlay,
            target: overlayTarget, 
            destroy: this.destroyPortal.bind(this, id)
        };
    }

    private destroyPortal(id){
        this.wrapper.removeChild(this.overlays[id].layer);
    }

    private mirrorParentChain(overlayContext:Element) {
        let currentSource:Element|null = overlayContext;
        let prevMirror:Element|undefined;
        let overlayTarget:Element|undefined;
        while(currentSource && currentSource !== this.root){
            const mirror = this.domMirror.mirrorNode(currentSource);
            if(prevMirror){
                mirror.appendChild(prevMirror);
            } else {
                overlayTarget = mirror;
            }
            currentSource = currentSource.parentElement;
            prevMirror = mirror;
        }
        return {overlayTop:prevMirror, overlayTarget};
    }

}