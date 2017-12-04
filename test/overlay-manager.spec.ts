import { expect, waitFor, selectDom } from 'test-drive-react';
import { OverlayManager, createHTML } from '../src';
import {CONTENT_LAYERS_CLASS, HIDE_PORTAL_STYLE, OVERLAY_LAYERS_CLASS, PORTAL_ROOT_CLASS} from "../src/overlay-manager";
import {combineCSSNot} from "./utils";

const hideStyle = {visibility:'hidden', transform:'unset', 'pointer-events':'none',width:'100%', height:'100%',top:'0px',left:'0px',position:'absolute'};

describe('overlay manager', () => {

    describe('overlay layers wrapper', () => {

        it('should be added to content root', () => {
            const root = createHTML('<div></div>');
    
            new OverlayManager(root);

            debugger;
            expect(root.children[0]).to.match('.' + PORTAL_ROOT_CLASS);
            expect(root.children[0].children[0]).to.match('.' + CONTENT_LAYERS_CLASS);
            expect(root.children[0].children[1]).to.match('.' + OVERLAY_LAYERS_CLASS);
        });
    
        it('should be added after existing content', () => {
            const root = createHTML('<div><content></content></div>');
    
            new OverlayManager(root);
    
            expect(root.children[0], 'existing child before').to.match('content');
            expect(root.children[1],'overlays wrapper after').to.match('.' + PORTAL_ROOT_CLASS);
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
            const root = createHTML('<div><content class="a b"><div class="x y" data-portal-open="true"></div></content></div>');
            const overlayContextSrc = root.querySelector('div')!;
            const om = new OverlayManager(root);
            
            const {layer, target} = om.createOverlay(overlayContextSrc);

            expect(layer.className, 'layer').to.contain(HIDE_PORTAL_STYLE);
            // expect(overlayContextSrc.className, 'source hide').to.contain(HIDE_PORTAL_STYLE);
            expect(overlayContextSrc.style, 'source hide').to.contain({display:'none'});
            expect(om.getPortalRoot().className, 'portal root styling').to.contain(HIDE_PORTAL_STYLE);
        });

        it('should hide and disable any effect of all ancestors', () => {
            const root = createHTML('<div><content class="a b">' +
                    '<div class="x y">' +
                        '<div>' +
                            '<span data-portal-open="true">hi</span>' +
                        '</div>' +
                    '</div>' +
                '</content></div>');
            const overlayContextSrc = root.querySelector('span')!;
            const om = new OverlayManager(root);

            const {layer, target} = om.createOverlay(overlayContextSrc);

            expect((layer.firstChild! as HTMLElement).className, 'ancestor').to.contain(HIDE_PORTAL_STYLE);
            expect((layer.firstChild!.firstChild! as HTMLElement).className, 'ancestor').to.contain(HIDE_PORTAL_STYLE);
            expect((layer.firstChild!.firstChild!.firstChild! as HTMLElement).className, 'ancestor').to.contain(HIDE_PORTAL_STYLE);
            expect((layer.firstChild!.firstChild!.firstChild!.firstChild! as HTMLElement).className, 'ancestor').not.to.contain(HIDE_PORTAL_STYLE); //the span
        });

        xit('should hide portal when prop open is false', () => {
            const root = createHTML('<div><content><div data-portal-open="false"></div></content></div>');
            const overlayContextSrc = root.querySelector('div')!;
            const om = new OverlayManager(root);

            const {target} = om.createOverlay(overlayContextSrc);

            expect((target as HTMLElement).style, 'target').to.contain({visibility:'hidden'});
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

        it('should allow clear of portal root',()=>{
            const root = createHTML('<div><content class="a b"><div class="x y"></div></content></div>');
            const overlayContextSrc = root.querySelector('div')!;
            const om = new OverlayManager(root);

            om.createOverlay(overlayContextSrc);
            om.removeSelf();

            expect(root).to.not.contain(`.${PORTAL_ROOT_CLASS}`);
        });
    });

});
