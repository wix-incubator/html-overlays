import createHTML from './create-html';
import { DOMMirror } from './mirror-dom';

const filterIdAndOn = (value:string) => !(value === 'id' || value.match(/^on/)); 
export type OverlayItem = { layer:HTMLElement, target:Element,parentTarget:Element, destroy:()=>void };

let overlayCounter = 0;
export const OVERLAY_LAYERS_CLASS = `overlay-layers`;
export const CONTENT_LAYERS_CLASS = `content-layer`;
export const PORTAL_ROOT_CLASS = `portal-root`;

export class OverlayManager {
    private domMirror:DOMMirror = new DOMMirror(filterIdAndOn);

    private portalRoot:HTMLDivElement = createHTML(`<div class="${PORTAL_ROOT_CLASS}" data-automation-id="${PORTAL_ROOT_CLASS}"></div>`) as HTMLDivElement;
    private contentLayer:HTMLDivElement = createHTML(`<div class="${CONTENT_LAYERS_CLASS}" data-automation-id="${CONTENT_LAYERS_CLASS}"></div>`) as HTMLDivElement;
    private overlayLayer:HTMLDivElement = createHTML(`<div class="${OVERLAY_LAYERS_CLASS}" data-automation-id="${OVERLAY_LAYERS_CLASS}"></div>`) as HTMLDivElement;

    private overlays:{[s:string]:{parent:string|null, layer:Element}} = {};
    constructor(
        private root:Element
    ) {
        this.portalRoot.appendChild(this.contentLayer);
        this.portalRoot.appendChild(this.overlayLayer); //Overlay should be after content

        root.appendChild(this.portalRoot);
    }

    getOverlayLayer (){
        return this.overlayLayer;
    }

    getContentLayer (){
        return this.contentLayer;
    }

    public createOverlay(overlayContext:Element):OverlayItem {
        const hideStyle = "position:static;visibility:hidden; transform:unset; pointer-events:none; width:0px; height:0px;";

        let id = overlayCounter++;
        const overlay = createHTML(`<div class="overlay" data-automation-id="overlay" style="${hideStyle}" data-overlay-id="${id}"></div>`);
        const {overlayTop, overlayTarget} = this.mirrorParentChain(overlayContext);
        
        if(!overlayTop || !overlayTarget){
            throw new Error('create overlay fail');
        }

        overlayTop.setAttribute('style',hideStyle);
        overlayContext.setAttribute('style',hideStyle);
        //TODO should hide all the chain of ancestors

        overlay.appendChild(overlayTop);
        this.overlayLayer.appendChild(overlay);

        this.overlays[id] = {parent:null, layer:overlay};

        return {
            layer:overlay,
            target: overlayTarget,
            parentTarget: overlayTarget.parentElement as Element,
            destroy: this.destroyPortal.bind(this, id)
        };
    }

    private destroyPortal(id:string){
        this.overlayLayer.removeChild(this.overlays[id].layer);
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

    public removeSelf(){
        this.root.removeChild(this.portalRoot);
    }
}