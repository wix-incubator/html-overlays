import { waitFor, expect } from 'test-drive-react';
import { DOMMirror, createHTML } from '../src';
import {combineCSSNot} from "./utils";

describe('mirror DOM', () => {
    

    describe('mirrorNode()', () => {

        it('should generate a clone node', () => {
            const root = createHTML('<div></div>');
            const domMirror = new DOMMirror();

            const mirror = domMirror.mirrorNode(root);

            expect(mirror, 'duplication').to.not.equal(root);
            expect(mirror.outerHTML, 'equality').to.equal(root.outerHTML);
        });

        it('should clone everything by default', () => {
            const root = createHTML('<div id="x" a="1" data-x="2" onclick="3"></div>');
            const domMirror = new DOMMirror();

            const mirror = domMirror.mirrorNode(root);

            expect(mirror).to.match('div#x[a="1"][data-x="2"][onclick="3"]');
        });

        it('should allow custom filter for mirrored attributes', () => {
            const root = createHTML('<div id="x" a="1" data-x="2" onclick="3"></div>');
            const filterAll = (name) => false;
            const filterId = (name, value) => name !== 'id';
            const domMirrorFilterAll = new DOMMirror(filterAll);
            const domMirrorFilterID = new DOMMirror(filterId);
            
            const mirrorEmpty = domMirrorFilterAll.mirrorNode(root);
            const mirrorWithoutId = domMirrorFilterID.mirrorNode(root);

            expect(mirrorEmpty, 'filter all attributes').to.match(combineCSSNot(['[id="x"]', '[a="1"]', '[data-x="2"]', '[onclick="3"]']));
            expect(mirrorWithoutId, 'allow id').to.match(':not([id="x"])[a="1"][data-x="2"][onclick="3"]');
        });

        describe('update', () => {

            it('should add attribute', () => {
                const root = createHTML('<div></div>');
                const domMirror = new DOMMirror();
    
                const mirror = domMirror.mirrorNode(root);
                root.setAttribute('x', 'y');
                
                return waitFor(() => {
                    expect(mirror).to.match('[x="y"]');
                });
            });

            it('should modify attribute', () => {
                const root = createHTML('<div x="y"></div>');
                const domMirror = new DOMMirror();
    
                const mirror = domMirror.mirrorNode(root);
                root.setAttribute('x', 'z');
                
                return waitFor(() => {
                    expect(mirror).to.match('[x="z"]');
                });
            });

            it('should remove attribute', () => {
                const root = createHTML('<div x="y"></div>');
                const domMirror = new DOMMirror();
    
                const mirror = domMirror.mirrorNode(root);
                root.removeAttribute('x');
                
                return waitFor(() => {
                    expect(mirror).to.match(':not([x])');
                });
            });

            it('should update mirror of mirror', () => {
                const root = createHTML('<div></div>');
                const domMirror = new DOMMirror();
    
                const mirrorA = domMirror.mirrorNode(root);
                const mirrorB = domMirror.mirrorNode(mirrorA);
                root.setAttribute('x', 'y');
    
                return waitFor(() => {
                    expect(mirrorB).to.match('[x="y"]');
                });
            });

        });

    });

    describe('getSource()', () => {

        it('should return source node', () => {
            const root = createHTML('<div></div>');
            const domMirror = new DOMMirror();

            const mirror = domMirror.mirrorNode(root);

            expect(domMirror.getSource(mirror)).to.equal(root);
        });

        it('should return source node from mirror of mirror', () => {
            const root = createHTML('<div></div>');
            const domMirror = new DOMMirror();

            const mirrorA = domMirror.mirrorNode(root);
            const mirrorB = domMirror.mirrorNode(mirrorA);

            expect(domMirror.getSource(mirrorB)).to.equal(root);
        });

    });

});