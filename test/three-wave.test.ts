import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { ThreeWave } from '../src/ThreeWave.js';
import '../src/three-wave.js';

describe('ThreeWave', () => {
  it('has a default title "Hey there" and counter 5', async () => {
    const el = await fixture<ThreeWave>(html`<three-wave></three-wave>`);

    expect(el.title).to.equal('Hey there');
   
  });

  it('increases the counter on button click', async () => {
    const el = await fixture<ThreeWave>(html`<three-wave></three-wave>`);
    el.shadowRoot!.querySelector('button')!.click();

   
  });

  it('can override the title via attribute', async () => {
    const el = await fixture<ThreeWave>(html`<three-wave title="attribute title"></three-wave>`);

    expect(el.title).to.equal('attribute title');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<ThreeWave>(html`<three-wave></three-wave>`);

    await expect(el).shadowDom.to.be.accessible();
  });
});
