import createHTML from './create-html';
import {DOMMirror} from './mirror-dom';

const filterIdAndOn = (value: string) => !(value === 'id' || value.match(/^on/));
export interface OverlayItem { layer: HTMLElement; target: Element; parentTarget: Element; destroy: () => void; }

let overlayCounter = 0;
export const OVERLAY_LAYERS_CLASS = `overlay-layers`;
export const CONTENT_LAYERS_CLASS = `content-layer`;
export const PORTAL_ROOT_CLASS = `portal-root`;
export const HIDE_PORTAL_STYLE = `hide-portal`;

const css =
    `.${HIDE_PORTAL_STYLE}{position:absolute;visibility:hidden; transform:unset;` +
    `pointer-events:none;width:100%;height:100%;top:0;left:0}`;
let style: HTMLStyleElement;

export class OverlayManager {
    private domMirror: DOMMirror = new DOMMirror(filterIdAndOn);

    private portalRoot: HTMLDivElement = createHTML(
        `<div class="${PORTAL_ROOT_CLASS} ${HIDE_PORTAL_STYLE}" data-automation-id="${PORTAL_ROOT_CLASS}"></div>`
    ) as HTMLDivElement;
    private contentLayer: HTMLDivElement = createHTML(
        `<div class="${CONTENT_LAYERS_CLASS} ${HIDE_PORTAL_STYLE}" data-automation-id="${CONTENT_LAYERS_CLASS}"></div>`
    ) as HTMLDivElement;
    private overlayLayer: HTMLDivElement = createHTML(
        `<div class="${OVERLAY_LAYERS_CLASS} ${HIDE_PORTAL_STYLE}" data-automation-id="${OVERLAY_LAYERS_CLASS}"></div>`
    ) as HTMLDivElement;

    private overlays: { [s: string]: { parent: string | null; layer: Element } } = {};
    constructor(private root: Element) {
        this.portalRoot.appendChild(this.contentLayer);
        this.portalRoot.appendChild(this.overlayLayer); // Overlay should be after content

        // this.portalRoot.setAttribute('class',HIDE_PORTAL_STYLE);
        if (style === undefined) {
            const s = document.createElement('style');
            s.textContent = css;
            style = s;
            document.head.appendChild(style);
        }
        root.appendChild(this.portalRoot);
    }

    public getOverlayLayer() {
        return this.overlayLayer;
    }

    public getContentLayer() {
        return this.contentLayer;
    }

    public getPortalRoot() {
        return this.portalRoot;
    }

    public createOverlay(overlayContext: Element): OverlayItem {
        const id = overlayCounter++;
        const overlay = createHTML(
            `<div class="overlay ${HIDE_PORTAL_STYLE}" data-automation-id="overlay" data-overlay-id="${id}"></div>`
        );
        const {overlayTop, overlayTarget} = this.mirrorParentChain(overlayContext);

        if (!overlayTop || !overlayTarget) {
            throw new Error('create overlay fail');
        }

        overlayContext.setAttribute('style', 'display:none;');
        const orgClassName = overlayContext.getAttribute('class') || '';
        overlayContext.setAttribute('class', orgClassName + ' ' + HIDE_PORTAL_STYLE);

        overlay.appendChild(overlayTop);
        this.overlayLayer.appendChild(overlay);

        this.overlays[id] = {parent: null, layer: overlay};

        return {
            layer: overlay,
            target: overlayTarget,
            parentTarget: overlayTarget.parentElement as Element,
            destroy: this.destroyPortal.bind(this, id)
        };
    }

    public removeSelf() {
        this.root.removeChild(this.portalRoot);
    }

    private destroyPortal(id: string) {
        this.overlayLayer.removeChild(this.overlays[id].layer);
    }

    private mirrorParentChain(overlayContext: Element) {
        let currentSource: Element | null = overlayContext;
        let prevMirror: Element | undefined;
        let overlayTarget: Element | undefined;

        while (currentSource && currentSource !== this.root) {
            const mirror = this.domMirror.mirrorNode(currentSource);
            if (prevMirror) {
                const orgClassName = mirror.getAttribute('class') || '';
                mirror.setAttribute('class', orgClassName + ' ' + HIDE_PORTAL_STYLE); // hide chain except source
                mirror.appendChild(prevMirror);
            } else {
                overlayTarget = mirror;
            }
            currentSource = currentSource.parentElement;
            prevMirror = mirror;
        }
        return {overlayTop: prevMirror, overlayTarget};
    }
}
