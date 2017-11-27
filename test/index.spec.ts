import { expect, waitFor, selectDom } from 'test-drive-react';
import { OverlayManager, createHTML } from '../src';

describe('e2e', () => {

    it('should copy css to overlay layer', () => {
        const root = createHTML('<div><div class="a"><style>.a .b {color:green;}</style><div id="origin"><span>portal</span></div></div></div>');
        document.body.appendChild(root);
        const overlayContextSrc = root.querySelector('#origin')!;
        const rootOverlay = new OverlayManager(root);

        const {target,destroy} = rootOverlay.createOverlay(overlayContextSrc);
        const portalContent = createHTML('<div class="b"></div>');
        target.appendChild(portalContent);

        expect(portalContent).to.have.style('color','green');

        destroy();
        document.body.removeChild(root);
    });
});
