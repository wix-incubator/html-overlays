import { expect, waitFor, selectDom } from 'test-drive';
import { OverlayManager, createHTML } from '../src';
import { combineCSSNot } from '../test-kit';

const OVERLAY_LAYERS_CLASS = `overlay-layers`;

describe('overlay manager', () => {

    describe('overlay layers wrapper', () => {

        it('should be added to content root', () => {
            const root = createHTML('<div></div>');
    
            new OverlayManager(root);
    
            expect(root.children[0]).to.match('.' + OVERLAY_LAYERS_CLASS);
        });
    
        it('should be added after existing content', () => {
            const root = createHTML('<div><content></content></div>');
    
            new OverlayManager(root);
    
            expect(root.children[0], 'existing child before').to.match('content');
            expect(root.children[1], 'overlays wrapper after').to.match('.' + OVERLAY_LAYERS_CLASS);
        });

    });

    describe('createOverlay()', () => {

        it('should create an overlay target mirroring source ancestors all the way to the overlay root', () => {
            const root = createHTML('<div><content class="a b"><div class="x y"></div></content></div>');
            const overlayContextSrc = root.querySelector('div')!;
            const om = new OverlayManager(root);
            
            const {target} = om.createOverlay(overlayContextSrc);

            expect(target).to.match('div.x.y');
            expect(target.parentElement).to.match('content.a.b');
        });

        it('should not mirror id & on* attributes', () => {
            const root = createHTML('<div><span id="x" onclick="doSomething()"></span></div>');
            const overlayContextSrc = root.querySelector('span')!;
            const om = new OverlayManager(root);
            
            const {target} = om.createOverlay(overlayContextSrc);

            expect(target).to.match(combineCSSNot(['[id]','[onclick]']));
        });

        it('should hide and disable any effect of structural ancestors & show only the overlay target', () => {
            const expectedAncestorStyle = {position:'static', visibility:'hidden', transform:'unset', 'pointer-events':'none', width:0, height:0};
            const root = createHTML('<div><content class="a b"><div class="x y"></div></content></div>');
            const overlayContextSrc = root.querySelector('div')!;
            const om = new OverlayManager(root);
            
            const {layer, target} = om.createOverlay(overlayContextSrc);

            expect(layer.style, 'layer').to.contain(expectedAncestorStyle);
            expect((layer.firstChild! as HTMLElement).style, 'ancestor').to.contain(expectedAncestorStyle);
            expect((target as HTMLElement).style, 'target').to.contain(expectedAncestorStyle);
        });

    });

    describe('destroyOverlay', () => {

        it('should remove the overlay elements', () => {
            const root = createHTML('<div><content class="a b"><div class="x y"></div></content></div>');
            const overlayContextSrc = root.querySelector('div')!;
            const om = new OverlayManager(root);
            
            const {target, destroy} = om.createOverlay(overlayContextSrc);
            destroy();

            expect(root, 'ancestor').to.not.contain(`.${OVERLAY_LAYERS_CLASS} content.a.b`);
            expect(root, 'target').to.not.contain(`.${OVERLAY_LAYERS_CLASS} div.x.y`);
        });

    });

});
