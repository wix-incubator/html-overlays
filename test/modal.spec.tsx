import * as React from 'react';
import {ClientRenderer, expect, selectDom, waitFor} from 'test-drive-react';
import {OverlayManager} from '../src';
import createHTML from '../src/create-html';
import {MyPortal} from './react-e2e.spec';

xdescribe('React modal using react portal', () => {
    const clientRenderer = new ClientRenderer();
    let contentRoot: HTMLDivElement;
    afterEach(() => clientRenderer.cleanup());

    beforeEach(() => {
        contentRoot = createHTML('<div data-automation-id="content-root"></div>') as HTMLDivElement;
        document.body.appendChild(contentRoot);
    });

    afterEach(() => {
        document.body.removeChild(contentRoot);
    });

    it('should copy css to overlay layer', () => {
        const overlayManager = new OverlayManager(contentRoot);

        clientRenderer.render((
                <div className="out-of-portal">
                <style>{`
                    .out-of-portal .portal{

                        position:absolute;
                        width:95%;
                        height:90%;
                        margin: 20px;
                        box-shadow: 4px 4px 5px #888888;
                        background-color:grey;
                    }
                `}</style>
                <MyPortal tagName="div" data-automation-id="portal" className="portal" overlayManager={overlayManager}>
                    <div className="in-portal" data-automation-id="test-content"/>
                </MyPortal>
            </div>
        ), overlayManager.getContentLayer());

        return waitFor(() => {
            const selectBody = selectDom(document.body);
            expect(selectBody('overlay-layers', 'portal')).to.have.style('visibility', 'visible');
            // expect(selectBody('overlay-layers','test-content')).to.have.style('border','1px solid black');
        });
    });
});
